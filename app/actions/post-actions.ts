'use server'

import { prisma } from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"
import crypto from 'crypto'
import { cache } from 'react'
import { getCachedData, redis } from "@/lib/redis"

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string
  let slug = formData.get("slug") as string
  const content = formData.get("content") as string
  const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : undefined
  const authorId = formData.get("authorId") ? parseInt(formData.get("authorId") as string) : undefined
  const seoTitle = formData.get("seoTitle") as string
  const metaDesc = formData.get("metaDesc") as string
  const published = formData.get("published") === "true"
  
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
      seoTitle,
      metaDesc,
      categoryId,
      authorId
    }
  })

  // Invalidate cache
  await redis.del('home_page_data')
  await redis.del('popular_posts')
  
  revalidatePath("/admin/posts")
  revalidatePath("/")
  
  return post
}

export async function getPosts() {
  return await prisma.post.findMany({
    include: {
      category: true,
      author: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getCategories() {
  return await prisma.category.findMany()
}

export async function getAuthors() {
  return await prisma.user.findMany()
}

export async function getDashboardData() {
  const totalPosts = await prisma.post.count()
  const totalCategories = await prisma.category.count()
  const totalAuthors = await prisma.user.count()
  
  // Real category distribution
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    }
  })
  
  const categoryData = categories.map((cat: any, i: number) => ({
    name: cat.name,
    value: cat._count.posts,
    fill: `oklch(${0.45 + i * 0.05} ${0.15 - i * 0.01} 250)`
  })).filter((c: any) => c.value > 0)

  // Real author distribution
  const authors = await prisma.user.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    },
    take: 6
  })

  const authorData = authors.map((author: any) => ({
    name: author.name || 'Anonymous',
    articles: author._count.posts
  })).sort((a: any, b: any) => b.articles - a.articles)

  return {
    totalPosts,
    totalCategories,
    totalAuthors,
    categoryData,
    authorData
  }
}

export const getHomePageData = cache(async (page: number = 1) => {
  const limit = 10
  const skip = (page - 1) * limit
  
  return getCachedData(`home_page_data:p${page}`, async () => {
    const [latestPosts, totalCount, featuredPosts] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          featuredImage: true,
          createdAt: true,
          category: true,
          author: true,
          metaDesc: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip
      }),
      prisma.post.count({ where: { published: true } }),
      prisma.post.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          featuredImage: true,
          createdAt: true,
          category: true,
          author: true,
          metaDesc: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    console.log(`[Pagination] Total: ${totalCount}, Pages: ${Math.ceil(totalCount / limit)}, Current: ${page}`)

    return { 
      latestPosts, 
      featuredPosts,
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
    return await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        createdAt: true,
        category: true,
        author: true,
        metaDesc: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
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
  const limit = 10
  const skip = (page - 1) * limit

  return getCachedData(`category_posts:${slug}:p${page}`, async () => {
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { 
          category: { slug },
          published: true 
        },
        select: {
          id: true,
          title: true,
          slug: true,
          featuredImage: true,
          createdAt: true,
          category: true,
          author: true,
          metaDesc: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip
      }),
      prisma.post.count({
        where: { 
          category: { slug },
          published: true 
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
  }, 3600)
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
