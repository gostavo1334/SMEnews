import { prisma } from '../lib/prisma';

async function fixSlugs() {
  console.log('Fetching posts to fix slugs...');
  const posts = await prisma.post.findMany({
    select: { id: true, slug: true }
  });

  console.log(`Found ${posts.length} posts. Updating...`);
  
  let updatedCount = 0;
  for (const post of posts) {
    const newSlug = `post-${post.id}`;
    if (post.slug !== newSlug) {
      try {
        await prisma.post.update({
          where: { id: post.id },
          data: { slug: newSlug }
        });
        updatedCount++;
        if (updatedCount % 500 === 0) {
          console.log(`Updated ${updatedCount} posts...`);
        }
      } catch (e) {
        console.error(`Failed to update post ${post.id}:`, e.message);
      }
    }
  }

  console.log(`Finished updating ${updatedCount} post slugs.`);
}

fixSlugs()
  .catch(console.error)
  .finally(() => process.exit(0));
