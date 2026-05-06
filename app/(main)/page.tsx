import { HeroSection } from "@/components/hero-section";
import { getHomePageData, getAds, getPopularPosts } from "@/app/actions/post-actions";
import Image from "next/image";
import { Suspense } from "react";
import { HeroSectionSkeleton } from "@/components/hero-section-skeleton";
import { NewsSectionSkeleton } from "@/components/news-section-skeleton";
import { NewsCard } from "@/components/news-card";
import { Play } from "lucide-react";
import { Pagination } from "@/components/pagination";

export const revalidate = 60; // revalidate every minute

async function AdsPanel({ position }: { position: 'sidebar_left' | 'sidebar_right' }) {
  const ads = await getAds();

  return (
    <div className="hidden xl:flex w-[160px] flex-shrink-0 flex-col gap-4 sticky top-24 h-fit">
      {(() => {
        const sideAds = ads.filter(ad =>
          ad.active && (ad.position === `${position}_1` || ad.position === `${position}_2`)
        ).sort((a, b) => a.position.localeCompare(b.position));

        return sideAds.length > 0 ? (
          sideAds.map(ad => (
            <a key={ad.id} href={ad.linkUrl || "#"} target="_blank" rel="noreferrer" className="block w-full">
              <div className="relative w-full h-[475px] rounded-md overflow-hidden border border-border/40 shadow-sm transition-transform hover:scale-[1.02]">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  priority
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

async function AdAfterArticle() {
  const ads = await getAds()
  const ad = ads.find(ad => ad.active && ad.position === 'after_article')
  
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
  const ad = ads.find(ad => ad.active && ad.position === 'after_popular')

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

async function PopularNewsSidebar() {
  const popularPosts = await getPopularPosts();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold border-b pb-2 mb-4">ព័ត៌មានពេញនិយម</h2>
        <div className="space-y-3">
          {popularPosts.map((post) => (
            <NewsCard
              key={post.id}
              news={{
                id: post.id,
                slug: post.slug,
                title: post.title,
                category: post.category?.name || "General",
                date: new Date(post.createdAt).toLocaleDateString('km-KH'),
                image: post.featuredImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80",
                author: { name: post.author?.name || "អ្នកយកព័ត៌មាន", avatar: post.author?.image || "/avatars/default.jpg" }
              }}
              variant="small"
            />
          ))}
        </div>
      </div>

      {/* AD AFTER POPULAR NEWS */}
      <Suspense fallback={<div className="h-[300px] bg-muted animate-pulse rounded-md" />}>
        <AdAfterPopular />
      </Suspense>

      {/* VIDEO PANEL - STATIC IN SIDEBAR */}
      <div className="bg-card rounded-md border border-border/40 p-4 shadow-sm">
        <h2 className="text-lg font-bold mb-4">វីដេអូ</h2>
        <div className="relative aspect-video rounded-md overflow-hidden group cursor-pointer border border-border/40">
          <Image src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80" alt="Video" fill sizes="300px" className="object-cover group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><Play className="size-8 text-primary fill-current" /></div>
        </div>
      </div>
    </div>
  );
}

async function MainContent({ page }: { page: number }) {
  const { latestPosts, featuredPosts, pagination } = await getHomePageData(page);
  const heroNews = featuredPosts.slice(0, 3);
  const gridNews = featuredPosts.slice(3, 7);

  return (
    <div className="flex-grow max-w-[1000px] w-full space-y-8">
      {page === 1 && <HeroSection heroNews={heroNews} gridNews={gridNews} />}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">
              {page > 1 ? `ព័ត៌មានថ្មីៗ - ទំព័រទី ${page}` : "ព័ត៌មានថ្មីៗ"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestPosts.map((post) => (
              <NewsCard
                key={post.id}
                news={{
                  id: post.id,
                  slug: post.slug,
                  title: post.title,
                  category: post.category?.name || "General",
                  date: new Date(post.createdAt).toLocaleDateString('km-KH'),
                  image: post.featuredImage || "https://images.unsplash.com/photo-1540959733332-e94e270b2d42?w=800&q=80",
                  author: { name: post.author?.name || "Anonymous", avatar: post.author?.image || "/avatars/default.jpg" },
                  summary: post.metaDesc ?? undefined
                }}
              />
            ))}
          </div>

          <Pagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            baseUrl="/" 
          />

          {/* AD AFTER GRID */}
          <Suspense fallback={<div className="h-24 w-full bg-muted animate-pulse rounded-md mt-8" />}>
            <AdAfterArticle />
          </Suspense>
        </div>

        <div className="lg:w-1/3">
          <Suspense fallback={<div className="space-y-4"><div className="h-8 w-32 bg-muted animate-pulse" />{[...Array(5)].map((_, i) => <div key={i} className="h-20 w-full bg-muted animate-pulse" />)}</div>}>
            <PopularNewsSidebar />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = parseInt(params.page || "1")

  return (
    <div className="min-h-screen bg-background pb-12 relative">
      <div className="flex justify-center gap-4 px-4 max-w-[1600px] mx-auto pt-4">
        
        <Suspense fallback={<div className="hidden xl:block w-[160px] h-[600px] bg-muted animate-pulse rounded-md" />}>
          <AdsPanel position="sidebar_left" />
        </Suspense>

        <Suspense fallback={
          <div className="flex-grow max-w-[1000px] w-full space-y-8">
            <HeroSectionSkeleton />
            <NewsSectionSkeleton />
          </div>
        }>
          <MainContent page={page} />
        </Suspense>

        <Suspense fallback={<div className="hidden xl:block w-[160px] h-[600px] bg-muted animate-pulse rounded-md" />}>
          <AdsPanel position="sidebar_right" />
        </Suspense>

      </div>
    </div>
  );
}
