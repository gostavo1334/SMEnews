import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ path: '.env', override: false });

import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function analyze() {
  // Just check a sample + count base64
  const sample = await prisma.post.findMany({
    select: { id: true, title: true, content: true },
    take: 100,
    orderBy: { id: 'desc' }
  });

  let base64Count = 0;
  let base64Size = 0;
  let totalSize = 0;

  for (const post of sample) {
    const size = Buffer.byteLength(post.content, 'utf8');
    totalSize += size;
    if (post.content.includes('data:image')) {
      base64Count++;
      const matches = post.content.match(/data:image[^"']*/g);
      if (matches) matches.forEach(m => base64Size += m.length);
    }
  }

  console.log(`\nSample: ${sample.length} posts`);
  console.log(`Sample content size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Avg per post: ${(totalSize / sample.length / 1024).toFixed(1)} KB`);
  console.log(`Estimated total (5000 posts): ${(totalSize / sample.length * 5000 / 1024 / 1024).toFixed(0)} MB`);
  console.log(`Posts with base64: ${base64Count} / ${sample.length}`);
  console.log(`Base64 size in sample: ${(base64Size / 1024 / 1024).toFixed(1)} MB`);

  // Show biggest
  const sorted = sample.map(p => ({
    id: p.id, 
    title: p.title.substring(0, 40), 
    sizeKB: (Buffer.byteLength(p.content, 'utf8') / 1024).toFixed(0),
    hasBase64: p.content.includes('data:image')
  })).sort((a, b) => parseInt(b.sizeKB) - parseInt(a.sizeKB));

  console.log('\nTop 10 biggest:');
  sorted.slice(0, 10).forEach(p => console.log(`  #${p.id}: ${p.sizeKB}KB ${p.hasBase64 ? '🖼️BASE64' : ''} ${p.title}`));

  await prisma.$disconnect();
  await pool.end();
}

analyze().catch(console.error);
