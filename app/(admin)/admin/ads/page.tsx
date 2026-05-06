import { getAds } from '@/app/actions/post-actions'
import AdsClient from './ads-client'

export default async function AdsPage() {
  const ads = await getAds()
  return <AdsClient initialAds={ads} />
}
