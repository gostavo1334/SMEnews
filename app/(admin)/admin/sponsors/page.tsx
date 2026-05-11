import { getAds } from '@/app/actions/post-actions'
import SponsorsClient from './sponsors-client'

export default async function SponsorsPage() {
  const ads = await getAds()
  const sponsorAds = ads.filter((ad: any) => ad.position === 'sponsor_cube')
  return <SponsorsClient initialAds={sponsorAds} />
}
