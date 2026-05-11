import { redis } from '../lib/redis';

async function main() {
  await redis.flushdb();
  console.log('Redis cache flushed.');
}

main().finally(() => process.exit(0));
