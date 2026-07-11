import { Suspense } from 'react'
import Image from 'next/image'
import { getPopularPosts, getAds } from '@/app/actions/post-actions'
import { NewsCard } from '@/components/news-card'
import { Advertisement, PostWithRelations } from '@/types/prisma'

async function AdBeforePopular() {
  const ads = await getAds()
  const ad = ads.find((ad: Advertisement) => ad.active && ad.position === 'before_popular')
  
  if (!ad) return (
    <div className="w-full aspect-[2200/2200] bg-muted rounded-md flex items-center justify-center border border-dashed border-muted-foreground/20 mb-4">
      <span className="text-[10px] text-muted-foreground uppercase tracking-widest italic">Sponsored</span>
    </div>
  )

  return (
    <a href={ad.linkUrl || "#"} target="_blank" rel="noreferrer" className="block w-full mb-4">
      <div className="relative w-full aspect-[2200/2200] rounded-md overflow-hidden border border-border/40 shadow-sm transition-transform hover:scale-[1.01]">
        <Image 
          src={ad.imageUrl} 
          alt={ad.title} 
          fill 
          unoptimized
          sizes="(max-width: 1024px) 100vw, 300px"
          className="object-cover" 
        />
        <div className="absolute inset-0 shiny-effect pointer-events-none" />
      </div>
    </a>
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
          unoptimized
          sizes="(max-width: 1024px) 100vw, 300px"
          className="object-cover" 
        />
        <div className="absolute inset-0 shiny-effect pointer-events-none" />
      </div>
    </a>
  )
}

export async function PopularSidebar() {
  const popular = await getPopularPosts()
  
  return (
    <div className="space-y-4 sticky top-24 h-fit">
      <Suspense fallback={<div className="h-[250px] bg-muted animate-pulse rounded-md" />}>
        <AdBeforePopular />
      </Suspense>
      <h2 className="text-xl font-bold border-b pb-2 mb-4">មានពេញនិយម</h2>
      <div className="space-y-3">
        {popular.map((p: PostWithRelations) => (
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
              summary: p.metaDesc ?? undefined,
              content: p.content ?? undefined
            }} 
            variant="small" 
          />
        ))}
      </div>
      <Suspense fallback={<div className="h-[250px] bg-muted animate-pulse rounded-md" />}>
        <AdAfterPopular />
      </Suspense>
    </div>
  )
}
