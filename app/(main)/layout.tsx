import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getAds, getCategories } from "@/app/actions/post-actions";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ads, categories] = await Promise.all([
    getAds(),
    getCategories()
  ]);
  
  const topBannerAd = ads.find(ad => ad.active && ad.position === 'top_banner');

  return (
    <>
      <SiteHeader topBannerAd={topBannerAd} categories={categories} />
      <main className="flex-grow">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
