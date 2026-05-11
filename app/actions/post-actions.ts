'use server'

import { prisma } from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import crypto from 'crypto'
import { cache } from 'react'
import { getCachedData, redis } from "@/lib/redis"
import { postToTelegram } from "@/lib/telegram"

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string
  let slug = formData.get("slug") as string
  const content = formData.get("content") as string
  const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : undefined
  const authorId = formData.get("authorId") ? parseInt(formData.get("authorId") as string) : undefined
  const seoTitle = formData.get("seoTitle") as string
  const metaDesc = formData.get("metaDesc") as string
  const published = formData.get("published") === "true"
  const publishedAt = formData.get("publishedAt") ? new Date(formData.get("publishedAt") as string) : new Date()
  
  // Make slug unique with UUID as requested
  const shortId = crypto.randomUUID().split('-')[0]
  slug = `${slug}-${shortId}`

  const imageFile = formData.get("featuredImage") as File
  let featuredImage = ""

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "smenews" }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }).end(buffer)
    })
    
    featuredImage = (uploadResponse as any).secure_url
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      featuredImage,
      published,
      publishedAt,
      seoTitle,
      metaDesc,
      categoryId,
      authorId
    }
  })

  // Invalidate cache
  for (let i = 1; i <= 5; i++) {
    await redis.del(`home_page_data:p${i}`)
  }
  await redis.del('popular_posts')
  await redis.del('dashboard_data')
  await redis.del('admin_posts:p1:l10')
  
  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (category) {
      for (let i = 1; i <= 5; i++) {
        await redis.del(`category_posts:${category.slug}:p${i}`)
      }
    }
  }
  
  revalidatePath("/admin/posts")
  revalidatePath("/", "layout")

  // Post to Telegram only if checkbox was checked
  const shareTelegram = formData.get('shareTelegram') === 'true'
  if (shareTelegram) {
    const [category, author] = await Promise.all([
      categoryId ? prisma.category.findUnique({ where: { id: categoryId }, select: { name: true } }) : null,
      authorId ? prisma.user.findUnique({ where: { id: authorId }, select: { name: true } }) : null,
    ])
    postToTelegram({
      title,
      slug: post.slug,
      featuredImage: featuredImage || null,
      categoryName: category?.name,
      authorName: author?.name || undefined,
      content,
    }).catch(err => console.error('[Telegram] Background post failed:', err))
  }
  
  return post
}

export const getPosts = cache(async (page: number = 1, limit: number = 10) => {
  return getCachedData(`admin_posts:p${page}:l${limit}`, async () => {
    const skip = (page - 1) * limit
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        include: {
          category: true,
          author: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: skip
      }),
      prisma.post.count()
    ])
    
    return { posts, total, page, totalPages: Math.ceil(total / limit) }
  }, 15) // Short 15s cache so it's fresh but doesn't spam DB
})

export const getDraftPosts = async () => {
  return await prisma.post.findMany({
    where: { published: false },
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' }
  })
}

export const getScheduledPosts = async () => {
  return await prisma.post.findMany({
    where: { 
      published: true, 
      publishedAt: { gt: new Date() } 
    },
    include: { category: true, author: true },
    orderBy: { publishedAt: 'asc' }
  })
}

export const getCategories = cache(async () => {
  return getCachedData('all_categories', async () => {
    return await prisma.category.findMany()
  }, 3600)
})

export const getAuthors = cache(async () => {
  return getCachedData('all_authors', async () => {
    return await prisma.user.findMany()
  }, 3600)
})

export const getDashboardData = cache(async () => {
  return getCachedData('dashboard_data', async () => {
    const [totalPosts, publishedPosts, draftPosts, totalCategories, totalAuthors, totalViews] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.category.count(),
      prisma.user.count(),
      prisma.post.aggregate({ _sum: { viewCount: true } }),
    ])
    
    // Real category distribution
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    })
    
    const hues = [250, 200, 150, 100, 300, 50, 30, 180, 270, 330]
    const categoryData = categories.map((cat: any, i: number) => ({
      name: cat.name,
      value: cat._count.posts,
      fill: `oklch(0.65 0.18 ${hues[i % hues.length]})`
    })).filter((c: any) => c.value > 0).sort((a: any, b: any) => b.value - a.value)

    // Real author distribution (top 8)
    const authors = await prisma.user.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      },
      take: 8
    })

    const authorData = authors.map((author: any) => ({
      name: author.name || 'Anonymous',
      articles: author._count.posts
    })).sort((a: any, b: any) => b.articles - a.articles)

    // Monthly post trends (last 12 months)
    const now = new Date()
    const monthlyData = []
    const khmerMonths = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ']
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const count = await prisma.post.count({
        where: {
          createdAt: { gte: start, lt: end }
        }
      })
      monthlyData.push({
        month: khmerMonths[start.getMonth()],
        year: start.getFullYear(),
        posts: count,
      })
    }

    // Top 5 most viewed posts
    const topPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        viewCount: true,
        slug: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
      }
    })

    // 5 most recent posts
    const recentPosts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        slug: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
      }
    })

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalAuthors,
      totalViews: totalViews._sum.viewCount || 0,
      categoryData,
      authorData,
      monthlyData,
      topPosts,
      recentPosts,
    }
  }, 300) // 5 minutes cache
})

export async function refreshDashboard() {
  await redis.del('dashboard_data')
  revalidatePath('/admin')
  return { success: true }
}
export const getHomePageData = cache(async (page: number = 1) => {
  const limit = 6
  // On page 1, we take the latest 13 items. 
  // We'll show the first 7 in the Hero and the first 6 in the List (overlapping).
  const take = page === 1 ? 13 : limit
  const skip = page === 1 ? 0 : (page - 1) * limit

  return getCachedData(`home_page_data:p${page}`, async () => {
    const [latestPosts, totalCount] = await Promise.all([
      (async () => {
        try {
          return await prisma.post.findMany({
            where: { 
              published: true,
              publishedAt: { lte: new Date(Date.now() + 60000) }
            },
            select: {
              id: true,
              title: true,
              slug: true,
              featuredImage: true,
              publishedAt: true,
              createdAt: true,
              category: true,
              author: true,
              metaDesc: true
            },
            orderBy: { publishedAt: 'desc' },
            take: take,
            skip: skip
          })
        } catch (error) {
          console.error("Prisma error in getHomePageData, likely stale client:", error);
          return await prisma.post.findMany({
            where: { published: true },
            select: {
              id: true,
              title: true,
              slug: true,
              featuredImage: true,
              publishedAt: true,
              createdAt: true,
              category: true,
              author: true,
              metaDesc: true
            },
            orderBy: { createdAt: 'desc' },
            take: take,
            skip: skip
          })
        }
      })(),
      (async () => {
        try {
          return await prisma.post.count({ 
            where: { 
              published: true,
              publishedAt: { lte: new Date(Date.now() + 60000) }
            } 
          })
        } catch (error) {
          return await prisma.post.count({ where: { published: true } })
        }
      })(),
    ])

    console.log(`[getHomePageData] Page: ${page}, Take: ${take}, Skip: ${skip}, Total: ${totalCount}`)

    return { 
      latestPosts, 
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    }
  }, 3600)
})

export const getPopularPosts = cache(async () => {
  return getCachedData('popular_posts', async () => {
    const posts = await prisma.post.findMany({
      where: { 
        published: true,
        publishedAt: { lte: new Date(Date.now() + 60000) }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        publishedAt: true,
        createdAt: true,
        category: true,
        author: true,
        metaDesc: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  
    return posts
  }, 3600)
})

export const getPostBySlug = cache(async (slug: string) => {
  return getCachedData(`post:${slug}`, async () => {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
      }
    })
  }, 3600)
})

export const getPostsByCategory = cache(async (slug: string, page: number = 1) => {
  const limit = 6
  const skip = (page - 1) * limit

  // Disable Redis cache for debugging category fetch issues
  // return getCachedData(`category_posts:${slug}:p${page}`, async () => {
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { 
          category: { slug },
          published: true,
          publishedAt: { lte: new Date(Date.now() + 60000) } // 1 minute buffer for clock drift
        },
        select: {
          id: true,
          title: true,
          slug: true,
          featuredImage: true,
          publishedAt: true,
          createdAt: true,
          category: true,
          author: true,
          metaDesc: true
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: skip
      }),
      prisma.post.count({
        where: { 
          category: { slug },
          published: true,
          publishedAt: { lte: new Date(Date.now() + 60000) }
        }
      })
    ])

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    }
  // }, 3600)
})

export const getAds = cache(async () => {
  return getCachedData('site_ads', async () => {
    return await prisma.advertisement.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }, 31536000) // 1 year cache, manual invalidation handles updates
})

export async function createAd(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const position = formData.get("position") as string
    const linkUrl = formData.get("linkUrl") as string
    
    const imageFile = formData.get("image") as File
    let imageUrl = ""

    if (imageFile && imageFile.size > 0) {
      console.log(`[Cloudinary] Uploading ad image: ${imageFile.name} (${imageFile.size} bytes)`)
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const fs = require('fs')
      const path = require('path')
      const os = require('os')
      const tempPath = path.join(os.tmpdir(), `upload-${Date.now()}-${imageFile.name}`)
      
      try {
        fs.writeFileSync(tempPath, buffer)
        const uploadResponse = await cloudinary.uploader.upload(tempPath, {
          folder: "smenews/ads",
          resource_type: "auto"
        })
        imageUrl = uploadResponse.secure_url
        console.log(`[Cloudinary] Upload success: ${imageUrl}`)
      } finally {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath)
        }
      }
    }

    const ad = await prisma.advertisement.create({
      data: {
        title,
        position,
        imageUrl,
        linkUrl,
        active: true
      }
    })

    await redis.del('site_ads')
    revalidatePath("/admin/ads")
    revalidatePath("/")
    return ad
  } catch (error: any) {
    console.error("[createAd] Error:", error)
    throw new Error(error.message || "Failed to create advertisement")
  }
}

export async function toggleAdStatus(id: number, active: boolean) {
  const ad = await prisma.advertisement.update({
    where: { id },
    data: { active }
  })
  await redis.del('site_ads')
  revalidatePath("/admin/ads")
  revalidatePath("/")
  return ad
}

export async function deleteAd(id: number) {
  await prisma.advertisement.delete({
    where: { id }
  })
  await redis.del('site_ads')
  revalidatePath("/admin/ads")
  revalidatePath("/")
}

export async function updatePost(id: number, formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : undefined
  const authorId = formData.get("authorId") ? parseInt(formData.get("authorId") as string) : undefined
  const seoTitle = formData.get("seoTitle") as string
  const metaDesc = formData.get("metaDesc") as string
  const published = formData.get("published") === "true"
  const publishedAt = formData.get("publishedAt") ? new Date(formData.get("publishedAt") as string) : new Date()

  const imageFile = formData.get("featuredImage") as File
  let featuredImageData: any = {}

  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "smenews" }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }).end(buffer)
    })
    
    featuredImageData.featuredImage = (uploadResponse as any).secure_url
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      ...featuredImageData,
      published,
      publishedAt,
      seoTitle,
      metaDesc,
      categoryId,
      authorId
    }
  })

  // Invalidate cache
  for (let i = 1; i <= 5; i++) {
    await redis.del(`home_page_data:p${i}`)
  }
  await redis.del('popular_posts')
  await redis.del('dashboard_data')
  await redis.del('admin_posts:p1:l10')
  await redis.del(`post:${post.slug}`)
  
  if (post.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: post.categoryId } })
    if (category) {
      for (let i = 1; i <= 5; i++) {
        await redis.del(`category_posts:${category.slug}:p${i}`)
      }
    }
  }
  
  revalidatePath("/admin/posts")
  revalidatePath("/", "layout")
  revalidatePath(`/news/${post.slug}`)
  
  return post
}

export async function deletePost(id: number) {
  const post = await prisma.post.delete({
    where: { id }
  })

  // Invalidate cache
  for (let i = 1; i <= 5; i++) {
    await redis.del(`home_page_data:p${i}`)
  }
  await redis.del('popular_posts')
  await redis.del('dashboard_data')
  await redis.del('admin_posts:p1:l10')
  await redis.del(`post:${post.slug}`)
  
  if (post.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: post.categoryId } })
    if (category) {
      for (let i = 1; i <= 5; i++) {
        await redis.del(`category_posts:${category.slug}:p${i}`)
      }
    }
  }
  
  revalidatePath("/admin/posts")
  revalidatePath("/", "layout")
  revalidatePath(`/news/${post.slug}`)
  
  return post
}

export async function publishPostNow(id: number) {
  const post = await prisma.post.update({
    where: { id },
    data: {
      published: true,
      publishedAt: new Date()
    }
  })

  // Invalidate cache
  for (let i = 1; i <= 5; i++) {
    await redis.del(`home_page_data:p${i}`)
  }
  await redis.del('popular_posts')
  await redis.del('dashboard_data')
  await redis.del('admin_posts:p1:l10')
  await redis.del(`post:${post.slug}`)
  
  if (post.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: post.categoryId } })
    if (category) {
      for (let i = 1; i <= 5; i++) {
        await redis.del(`category_posts:${category.slug}:p${i}`)
      }
    }
  }
  
  revalidatePath("/admin/posts")
  revalidatePath("/", "layout")
  revalidatePath(`/news/${post.slug}`)
  return post
}
