import { HeroSection } from "@/components/hero-section";
import { getHomePageData } from "@/app/actions/post-actions";
import Image from "next/image";
import { Suspense } from "react";
import { Metadata } from "next";
import { HeroSectionSkeleton } from "@/components/hero-section-skeleton";
import { NewsCard } from "@/components/news-card";
import { Pagination } from "@/components/pagination";
import { PostWithRelations } from '@/types/prisma'

export const revalidate = 0; 

export const metadata: Metadata = {
  title: "SME NEWS - ព័ត៌មានអាជីវកម្ម និងសេដ្ឋកិច្ច",
  description: "ប្រភពព័ត៌មានអាជីវកម្ម នវានុវត្តន៍ និងបច្គេកវិទ្យាឈានមុខគេនៅក្នុងប្រទេសកម្ពុជា",
  openGraph: {
    title: "SME NEWS - ព័ត៌មានអាជីវកម្ម និងសេដ្ឋកិច្ច",
    description: "ប្រភពព័ត៌មានអាជីវកម្ម នវានុវត្តន៍ និងបច្ចេកវិទ្យាឈានមុខគេនៅក្នុងប្រទេសកម្ពុជា",
    images: ["/Logo/logo.png"],
  }
};

async function MainContent({ page }: { page: number }) {
  const { latestPosts, pagination } = await getHomePageData(page);
  
  const heroNews = page === 1 ? latestPosts.slice(0, 3) : [];
  const gridNews = page === 1 ? latestPosts.slice(3, 7) : [];
  const listPosts = page === 1 ? latestPosts.slice(0, 6) : latestPosts;

  return (
    <>
      {page === 1 && heroNews.length > 0 && (
        <div className="lg:col-span-3">
          <HeroSection heroNews={heroNews} gridNews={gridNews} />
        </div>
      )}
      
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold border-l-4 border-primary pl-3">
          {page > 1 ? `ព័ត៌មានថ្មីៗ - ទំព័រទី ${page}` : "ព័ត៌មានថ្មីៗ"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listPosts.length > 0 ? (
            listPosts.map((post: PostWithRelations) => (
              <NewsCard
                key={post.id}
                news={{
                  id: post.id,
                  slug: post.slug,
                  title: post.title,
                  category: post.category?.name || "General",
                  categorySlug: post.category?.slug,
                  date: new Date(post.publishedAt).toLocaleDateString('km-KH'),
                  image: post.featuredImage || "https://images.unsplash.com/photo-1540959733332-e94e270b2d42?w=800&q=80",
                  author: { name: post.author?.name || "Anonymous", avatar: post.author?.image || "/avatars/default.jpg" },
                  summary: post.metaDesc ?? undefined
                }}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground dark:text-white font-medium">
              មិនមានព័ត៌មាននៅឡើយទេ
            </div>
          )}
        </div>

        {pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} baseUrl="/" />
        )}
      </div>
    </>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const page = parseInt(params.page || "1")

  return (
    <>
      {/* ACCENT BACKGROUND GLOW - uses col-span-3 to not be squashed if direct child of grid */}
      <div className="lg:col-span-3 absolute top-0 left-0 w-full h-[600px] -z-10 pointer-events-none opacity-50 overflow-hidden">
        <div className="absolute inset-0 blur-[80px] scale-150">
          <Image src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80" alt="Glow" fill sizes="100vw" className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <Suspense fallback={<div className="lg:col-span-3"><HeroSectionSkeleton /></div>}>
        <MainContent page={page} />
      </Suspense>
    </>
  );
}
