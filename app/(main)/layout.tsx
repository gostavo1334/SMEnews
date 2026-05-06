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
  
  const topBannerAd = ads.find((ad: any) => ad.active && ad.position === 'top_banner');
  const sponsorAds = ads.filter((ad: any) => ad.active && ad.position === 'sponsor_cube');

  return (
    <>
      <SiteHeader topBannerAd={topBannerAd} sponsorAds={sponsorAds} categories={categories} />
      <main className="flex-grow">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
