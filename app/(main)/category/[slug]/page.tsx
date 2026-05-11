import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { getCategories, getPostsByCategory } from '@/app/actions/post-actions'
import { NewsCard } from '@/components/news-card'
import { notFound } from 'next/navigation'
import { Pagination } from '@/components/pagination'
import Image from 'next/image'
import { Category, PostWithRelations } from '@/types/prisma'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((c: Category) => c.slug === slug)
  if (!category) return { title: 'Category Not Found - SME NEWS' }
  return {
    title: `${category.name} - SME NEWS`,
    description: `អានព័ត៌មានថ្មីៗបំផុតអំពី ${category.name} នៅលើគេហទំព័រ SME NEWS`,
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((cat: Category) => ({ slug: cat.slug }))
}

async function CategoryPostsGrid({ slug, categoryName, page }: { slug: string, categoryName: string, page: number }) {
  const { posts, pagination } = await getPostsByCategory(slug, page)
  if (posts.length === 0) {
    return <div className="py-20 text-center text-muted-foreground KhmerOS">មិនទាន់មានអត្ថបទក្នុងប្រភេទនេះនៅឡើយទេ</div>
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post: PostWithRelations) => (
          <NewsCard 
            key={post.id} 
            news={{
              id: post.id, slug: post.slug, title: post.title, category: categoryName, categorySlug: slug,
              date: new Date(post.publishedAt).toLocaleDateString('km-KH'),
              image: post.featuredImage || "https://images.unsplash.com/photo-1540959733332-e94e270b2d42?w=800&q=80",
              summary: post.metaDesc ?? undefined
            }} 
          />
        ))}
      </div>
      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} baseUrl={`/category/${slug}`} />
    </>
  )
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || "1")
  const categories = await getCategories()
  const category = categories.find((c: Category) => c.slug === slug)
  if (!category) notFound()

  return (
    <>
      {/* ACCENT BACKGROUND GLOW */}
      <div className="lg:col-span-3 absolute top-0 left-0 w-full h-[600px] -z-10 pointer-events-none opacity-40 dark:opacity-50 overflow-hidden">
        <div className="absolute inset-0 blur-[80px] scale-150">
          <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80" alt="Glow" fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="lg:col-span-3 border-b pb-4">
        <h1 className="text-3xl font-bold text-primary dark:text-white">{category.name}</h1>
        <p className="text-muted-foreground mt-1 KhmerOS">បង្ហាញអត្ថបទទាំងអស់ក្នុងប្រភេទ "{category.name}"</p>
      </div>

      <div className="lg:col-span-2">
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-[300px] bg-muted animate-pulse rounded-lg" />)}</div>}>
          <CategoryPostsGrid slug={slug} categoryName={category.name} page={page} />
        </Suspense>
      </div>
    </>
  )
}
