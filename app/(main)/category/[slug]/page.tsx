import React, { Suspense } from 'react'
import { getCategories, getPostsByCategory, getAds, getPopularPosts } from '@/app/actions/post-actions'
import { NewsCard } from '@/components/news-card'
import { notFound } from 'next/navigation'
import { NewsCardSkeleton } from '@/components/news-card-skeleton'
import { Pagination } from '@/components/pagination'
import Image from 'next/image'
import { Category, Advertisement, Post } from '@/types/prisma'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

async function AdsPanel({ position }: { position: 'sidebar_left' | 'sidebar_right' }) {
  const ads = await getAds();
  
  return (
    <div className="hidden xl:flex w-[160px] flex-shrink-0 flex-col gap-4 sticky top-24 h-fit">
      {(() => {
        const sideAds = ads.filter((ad: Advertisement) => 
          ad.active && (ad.position === `${position}_1` || ad.position === `${position}_2`)
        ).sort((a: Advertisement, b: Advertisement) => a.position.localeCompare(b.position));

        return sideAds.length > 0 ? (
          sideAds.map((ad: Advertisement) => (
            <a key={ad.id} href={ad.linkUrl || "#"} target="_blank" rel="noreferrer" className="block w-full">
              <div className="relative w-full h-[475px] rounded-md overflow-hidden border border-border/40 shadow-sm transition-transform hover:scale-[1.02]">
                <Image 
                  src={ad.imageUrl} 
                  alt={ad.title} 
                  fill 
                  sizes="160px"
                  className="object-cover" 
                />
              </div>
            </a>
          ))
        ) : (
          <div className="h-[475px] bg-muted border border-border/40 rounded-md flex items-center justify-center overflow-hidden">
            <span className="vertical-text text-muted-foreground/30 font-bold text-lg tracking-widest uppercase">ADVERTISEMENT</span>
          </div>
        );
      })()}
    </div>
  );
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((cat: Category) => ({
    slug: cat.slug,
  }))
}

async function CategoryPostsGrid({ slug, categoryName, page }: { slug: string, categoryName: string, page: number }) {
  const { posts, pagination } = await getPostsByCategory(slug, page)

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center bg-muted/30 rounded-lg">
        <p className="text-muted-foreground KhmerOS">មិនទាន់មានអត្ថបទក្នុងប្រភេទ "{categoryName}" នៅឡើយទេ</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post: any) => (
          <NewsCard 
            key={post.id} 
            news={{
              id: post.id,
              slug: post.slug,
              title: post.title,
              category: categoryName,
              categorySlug: slug,
              date: new Date(post.createdAt).toLocaleDateString('km-KH'),
              image: post.featuredImage || "https://images.unsplash.com/photo-1540959733332-e94e270b2d42?w=800&q=80",
              summary: post.metaDesc ?? undefined
            }} 
          />
        ))}
      </div>
      
      <Pagination 
        currentPage={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        baseUrl={`/category/${slug}`} 
      />
    </>
  )
}

async function PopularNews() {
  const popular = await getPopularPosts()
  
  return (
    <div className="space-y-4 sticky top-24 h-fit">
      <h2 className="text-xl font-bold border-b pb-2 mb-4">ព័ត៌មានពេញនិយម</h2>
      <div className="space-y-3">
        {popular.map((p: any) => (
          <NewsCard 
            key={p.id} 
            news={{
              id: p.id,
              slug: p.slug,
              title: p.title,
              category: p.category?.name || "General",
              categorySlug: p.category?.slug,
              date: new Date(p.createdAt).toLocaleDateString('km-KH'),
              image: p.featuredImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80"
            }} 
            variant="small" 
          />
        ))}
      </div>
      {/* AD AFTER POPULAR */}
      <Suspense fallback={<div className="h-[250px] bg-muted animate-pulse rounded-md" />}>
        <AdAfterPopular />
      </Suspense>
    </div>
  )
}

async function AdAfterPopular() {
  const ads = await getAds()
  const ad = ads.find((ad: Advertisement) => ad.active && ad.position === 'after_popular')
  
  if (!ad) return (
    <div className="w-full aspect-[2200/2200] bg-muted rounded-md flex items-center justify-center border border-dashed border-muted-foreground/20 mt-4">
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest italic">Sponsored</span>
    </div>
  )

  return (
    <a href={ad.linkUrl || "#"} target="_blank" rel="noreferrer" className="block w-full mt-4">
      <div className="relative w-full aspect-[2200/2200] rounded-md overflow-hidden border border-border/40 shadow-sm transition-transform hover:scale-[1.01]">
        <Image 
          src={ad.imageUrl} 
          alt={ad.title} 
          fill 
          sizes="(max-width: 1024px) 100vw, 300px"
          className="object-cover" 
        />
      </div>
    </a>
  )
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || "1")
  const categories = await getCategories()
  const category = categories.find((c: Category) => c.slug === slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-12 relative isolate">
      {/* ACCENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-[600px] -z-10 pointer-events-none opacity-40 blur-[120px] dark:opacity-50">
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
          alt="Glow Background"
          fill
          sizes="100vw"
          className="object-cover scale-150"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="flex justify-center gap-4 px-4 max-w-[1600px] mx-auto pt-6">
        
        <Suspense fallback={<div className="hidden xl:block w-[160px] h-[600px] bg-muted animate-pulse rounded-md" />}>
          <AdsPanel position="sidebar_left" />
        </Suspense>

        <div className="flex-grow max-w-[1000px] w-full space-y-8">
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold text-primary">{category.name}</h1>
            <p className="text-muted-foreground mt-1 KhmerOS">បង្ហាញអត្ថបទទាំងអស់ក្នុងប្រភេទ "{category.name}"</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_: any, i: number) => <div key={i} className="h-[300px] bg-muted animate-pulse rounded-lg" />)}
                </div>
              }>
               <CategoryPostsGrid slug={slug} categoryName={category.name} page={page} />
              </Suspense>
            </div>

            <aside className="lg:w-1/3">
              <Suspense fallback={
                <div className="space-y-4">
                  <div className="h-8 w-32 bg-muted animate-pulse" />
                  {[...Array(4)].map((_: any, i: number) => <div key={i} className="h-20 w-full bg-muted animate-pulse" />)}
                </div>
              }>
                <PopularNews />
              </Suspense>
            </aside>
          </div>
        </div>

        <Suspense fallback={<div className="hidden xl:block w-[160px] h-[600px] bg-muted animate-pulse rounded-md" />}>
          <AdsPanel position="sidebar_right" />
        </Suspense>

      </div>
    </div>
  )
}
