import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAds } from "@/app/actions/post-actions";
import { getCategories } from "@/app/actions/category-actions";
import { Suspense } from "react";
import { AdsSidebar } from "@/components/sidebars/ads-sidebar";
import { PopularSidebar } from "@/components/sidebars/popular-sidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ads, categories] = await Promise.all([
    getAds(),
    getCategories()
  ]);
  
  const topBannerAd = ads.find((ad: any) => ad.active && ad.position === 'top_banner');
  const sponsorAds = ads.filter((ad: any) => ad.active && ad.position === 'sponsor_cube');

  return (
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-green-900 text-green-900 dark:text-gray-100">
      <SiteHeader topBannerAd={topBannerAd} sponsorAds={sponsorAds} categories={categories} />
      
      <div className="flex justify-center gap-4 px-4 max-w-[1600px] mx-auto pt-8 flex-grow w-full">
        {/* LEFT ADS */}
        <Suspense fallback={<div className="hidden xl:block w-[160px] h-[600px] bg-muted animate-pulse rounded-md" />}>
          <AdsSidebar position="sidebar_left" />
        </Suspense>

        {/* MIDDLE CONTENT AREA */}
        <main className="flex-grow max-w-[1000px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* children uses display: contents to allow Hero to span all 3 columns */}
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 lg:contents">
              {children}
            </div>

            {/* STATIC SIDEBAR - NO RELOAD */}
            <aside className="lg:col-span-1">
              <Suspense fallback={null}>
                <PopularSidebar />
              </Suspense>
            </aside>
          </div>
        </main>

        {/* RIGHT ADS */}
        <Suspense fallback={<div className="hidden xl:block w-[160px] h-[600px] bg-muted animate-pulse rounded-md" />}>
          <AdsSidebar position="sidebar_right" />
        </Suspense>
      </div>

      <SiteFooter />
    </div>
  );
}
