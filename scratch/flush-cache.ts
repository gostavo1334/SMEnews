import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ path: '.env', override: false });

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

async function flushCache() {
  for (let i = 1; i <= 100; i++) {
    await redis.del(`home_page_data:p${i}`);
  }
  await redis.del('popular_posts');
  await redis.del('dashboard_data');
  await redis.del('all_categories');
  await redis.del('all_authors');
  console.log('All cache flushed!');
}

flushCache().catch(console.error);
