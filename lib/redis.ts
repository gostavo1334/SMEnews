import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('Upstash Redis environment variables are missing.')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export async function getCachedData<T>(key: string, fetchFn: () => Promise<T>, ttl = 3600): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached) {
      console.log(`[Redis] Cache HIT: ${key}`)
      return cached as T
    }
  } catch (error) {
    console.error('[Redis] Get error:', error)
  }

  console.log(`[Redis] Cache MISS: ${key}`)
  const data = await fetchFn()

  try {
    await redis.set(key, data, { ex: ttl })
  } catch (error) {
    console.error('[Redis] Set error:', error)
  }

  return data
}
