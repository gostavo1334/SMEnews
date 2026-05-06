import React, { Suspense } from 'react'
import Image from 'next/image'
import { Clock, Share2, User, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NewsCard } from "@/components/news-card"
import { getPostBySlug, getHomePageData, getAds, getPopularPosts, getPosts } from '@/app/actions/post-actions'
import { notFound } from 'next/navigation'
import { NewsCardSkeleton } from '@/components/news-card-skeleton'
import { ShareDialog } from '@/components/share-dialog'

export const revalidate = 3600 // revalidate every hour

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.slice(0, 20).map((post) => ({
    slug: post.slug,
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function AdsPanel({ position }: { position: 'sidebar_left' | 'sidebar_right' }) {
  const ads = await getAds()
  
  return (
    <div className="hidden xl:flex w-[160px] flex-shrink-0 flex-col gap-4 sticky top-24 h-fit">
      {(() => {
        const sideAds = ads.filter((ad: any) => 
          ad.active && (ad.position === `${position}_1` || ad.position === `${position}_2`)
        ).sort((a: any, b: any) => a.position.localeCompare(b.position));

        return sideAds.length > 0 ? (
          sideAds.map((ad: any) => (
            <a key={ad.id} href={ad.linkUrl || "#"} target="_blank" rel="noreferrer" className="block w-full">
              <div className="relative w-full h-[475px] rounded-md overflow-hidden border border-border/40 shadow-sm transition-transform hover:scale-[1.02]">
                <Image 
                  src={ad.imageUrl} 
                  alt={ad.title} 
                  fill 
                  unoptimized
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

async function RelatedNews() {
  const related = await getPopularPosts()
  
  return (
    <div className="space-y-6 pt-8 border-t border-border/40">
      <h2 className="text-xl font-bold border-l-4 border-primary pl-3">អត្តបទទាក់ទង</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {related.map((p) => (
          <NewsCard 
            key={p.id} 
            news={{
              id: p.id,
              slug: p.slug,
              title: p.title,
              category: p.category?.name || "General",
              categorySlug: p.category?.slug,
              date: new Date(p.createdAt).toLocaleDateString('km-KH'),
              image: p.featuredImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80",
              summary: p.metaDesc ?? undefined
            }} 
            variant="horizontal" 
            className="min-w-[280px] snap-start" 
          />
        ))}
      </div>
    </div>
  )
}

async function PopularNews() {
  const popular = await getPopularPosts()
  
  return (
    <div className="space-y-4 sticky top-24 h-fit">
      <h2 className="text-xl font-bold border-b pb-2 mb-4">ព័ត៌មានពេញនិយម</h2>
      <div className="space-y-3">
        {popular.map((p) => (
          <NewsCard 
            key={p.id} 
            news={{
              id: p.id,
              slug: p.slug,
              title: p.title,
              category: p.category?.name || "General",
              categorySlug: p.category?.slug,
              date: new Date(p.createdAt).toLocaleDateString('km-KH'),
              image: p.featuredImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80",
              summary: p.metaDesc ?? undefined
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

async function AdAfterArticle() {
  const ads = await getAds()
  const ad = ads.find((ad: any) => ad.active && ad.position === 'after_article')
  
  if (!ad) return (
    <div className="w-full aspect-[1920/200] bg-muted rounded-md flex items-center justify-center border border-dashed border-muted-foreground/20 mt-8">
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest italic">Sponsored</span>
    </div>
  )

  return (
    <a href={ad.linkUrl || "#"} target="_blank" rel="noreferrer" className="block w-full mt-8">
      <div className="relative w-full aspect-[1920/200] rounded-md overflow-hidden border border-border/40 shadow-sm transition-transform hover:scale-[1.005]">
        <Image 
          src={ad.imageUrl} 
          alt={ad.title} 
          fill 
          unoptimized
          sizes="(max-width: 1000px) 100vw, 1000px"
          className="object-cover" 
        />
      </div>
    </a>
  )
}

async function AdAfterPopular() {
  const ads = await getAds()
  const ad = ads.find((ad: any) => ad.active && ad.position === 'after_popular')
  
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
          unoptimized
          sizes="(max-width: 1024px) 100vw, 300px"
          className="object-cover" 
        />
      </div>
    </a>
  )
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('km-KH', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen pb-12 relative isolate">
      {/* ACCENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-[500px] -z-10 pointer-events-none opacity-40 blur-[100px] dark:opacity-30">
        <Image
          src={post.featuredImage || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80"}
          alt="Blur Background"
          fill
          sizes="100vw"
          className="object-cover scale-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="flex justify-center gap-4 px-4 max-w-[1600px] mx-auto pt-6">
        
        <Suspense fallback={<div className="hidden xl:block w-[160px] h-[600px] bg-muted animate-pulse rounded-md" />}>
          <AdsPanel position="sidebar_left" />
        </Suspense>

        <div className="flex-grow max-w-[1000px] w-full">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* ARTICLE CONTENT */}
            <article className="lg:w-2/3 space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary bg-primary/10 border-none hover:bg-primary/20">
                  {post.category?.name || "General"}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-medium leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex items-center justify-between py-2 border-y border-border/40">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      <span suppressHydrationWarning>{formattedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShareDialog title={post.title} />
                    <Button variant="ghost" size="icon" className="size-8 rounded-full"><Bookmark className="size-4" /></Button>
                  </div>
                </div>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border/40 shadow-sm">
                <Image
                  src={post.featuredImage || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80"}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1000px) 100vw, 1000px"
                  priority
                  className="object-cover"
                />
              </div>

              <div 
                className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-4 text-foreground/90 leading-relaxed KhmerOS"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-4 py-3 flex items-center gap-4 border-t border-border/40">
                <Avatar className="size-14 border border-border/40">
                  <AvatarImage src={post.author?.image || ""} />
                  <AvatarFallback>{post.author?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-base font-bold text-foreground">{post.author?.name || "អ្នកយកព័ត៌មាន"}</h3>
                  <p className="text-xs text-muted-foreground">អ្នកយកព័ត៌មានផ្នែកសេដ្ឋកិច្ច និងអាជីវកម្ម</p>
                </div>
              </div>

              {/* AD AFTER ARTICLE */}
              <Suspense fallback={<div className="h-24 w-full bg-muted animate-pulse rounded-md" />}>
                <AdAfterArticle />
              </Suspense>

              {/* RELATED NEWS SUSPENSE */}
              <Suspense fallback={<div className="h-40 w-full bg-muted animate-pulse rounded-md" />}>
                <RelatedNews />
              </Suspense>
            </article>

            {/* SIDEBAR SUSPENSE */}
            <aside className="lg:w-1/3 space-y-8">
              <Suspense fallback={
                <div className="space-y-4">
                  <div className="h-8 w-32 bg-muted animate-pulse rounded-md" />
                  {[...Array(4)].map((_, i) => <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-md" />)}
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
