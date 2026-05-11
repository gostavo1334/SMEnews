import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function fixPublishedAt() {
  // Get all posts where publishedAt was never explicitly set
  // (they all got today's date from migration)
  const posts = await prisma.post.findMany({
    select: { id: true, createdAt: true, publishedAt: true }
  });

  let fixed = 0;
  for (const post of posts) {
    // If publishedAt and createdAt differ significantly, publishedAt was set by default
    // Fix: set publishedAt = createdAt for old migrated posts
    const diff = Math.abs(post.publishedAt.getTime() - post.createdAt.getTime());
    if (diff > 86400000) { // more than 1 day apart = migrated post
      await prisma.post.update({
        where: { id: post.id },
        data: { publishedAt: post.createdAt }
      });
      fixed++;
    }
  }

  console.log(`Fixed ${fixed} posts. publishedAt now matches createdAt.`);
}

fixPublishedAt()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
