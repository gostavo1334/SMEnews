import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });
dotenv.config({ path: '.env', override: false });

import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { v2 as cloudinary } from 'cloudinary';

// Setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzlc5aa9p',
  api_key: process.env.CLOUDINARY_API_KEY || '927441656839916',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'HCCi_kt1IXs-F-3MtpmzQiM8-D0',
});

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function uploadBase64ToCloudinary(base64Data: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'smenews/inline',
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (err: any) {
    console.error('  ❌ Upload failed:', err.message?.substring(0, 80));
    return null;
  }
}

async function cleanPost(post: { id: number; title: string; content: string }) {
  // Find all base64 images
  const regex = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g;
  const matches = post.content.match(regex);
  
  if (!matches || matches.length === 0) return false;

  console.log(`  Post #${post.id}: ${matches.length} base64 image(s) (${(Buffer.byteLength(post.content, 'utf8') / 1024).toFixed(0)}KB)`);

  let newContent = post.content;
  let replaced = 0;

  for (let i = 0; i < matches.length; i++) {
    const base64 = matches[i];
    console.log(`    Uploading image ${i + 1}/${matches.length} (${(base64.length / 1024).toFixed(0)}KB)...`);
    
    const cloudUrl = await uploadBase64ToCloudinary(base64);
    if (cloudUrl) {
      newContent = newContent.replace(base64, cloudUrl);
      replaced++;
      console.log(`    ✅ → ${cloudUrl}`);
    } else {
      // If upload fails, remove the broken image entirely
      newContent = newContent.replace(base64, '');
      console.log(`    ⚠️ Removed (upload failed)`);
    }
  }

  // Update post
  await prisma.post.update({
    where: { id: post.id },
    data: { content: newContent },
  });

  const savedKB = ((Buffer.byteLength(post.content, 'utf8') - Buffer.byteLength(newContent, 'utf8')) / 1024).toFixed(0);
  console.log(`  ✅ Done! Replaced ${replaced}/${matches.length}, saved ~${savedKB}KB\n`);
  return true;
}

async function main() {
  console.log('🔍 Scanning posts for base64 images...\n');

  let totalSaved = 0;
  let totalCleaned = 0;
  const batchSize = 20;
  let skip = 0;

  while (true) {
    const posts = await prisma.post.findMany({
      select: { id: true, title: true, content: true },
      where: { content: { contains: 'data:image' } },
      take: batchSize,
      skip,
      orderBy: { id: 'asc' },
    });

    if (posts.length === 0) break;

    console.log(`--- Batch: ${posts.length} posts with base64 ---`);

    for (const post of posts) {
      const beforeSize = Buffer.byteLength(post.content, 'utf8');
      const cleaned = await cleanPost(post);
      if (cleaned) {
        // Re-fetch to get new size
        const updated = await prisma.post.findUnique({ 
          where: { id: post.id }, 
          select: { content: true } 
        });
        if (updated) {
          totalSaved += beforeSize - Buffer.byteLength(updated.content, 'utf8');
        }
        totalCleaned++;
      }
    }

    skip += batchSize;
  }

  console.log(`\n🎉 DONE!`);
  console.log(`Posts cleaned: ${totalCleaned}`);
  console.log(`Total saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MB`);
  console.log(`\nRun VACUUM FULL on Supabase SQL Editor to reclaim disk space.`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
