const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function checkPosts() {
  const posts = await prisma.post.findMany({
    take: 20,
    select: {
      id: true,
      title: true,
      content: true,
      metaDesc: true,
      publishedAt: true
    },
    orderBy: {
      publishedAt: 'desc'
    }
  });

  console.log('--- Top 20 Latest Posts Content Check ---');
  posts.forEach(p => {
    const hasSummary = !!p.metaDesc;
    const hasContent = !!p.content && p.content.trim().length > 0;
    const plainContent = p.content?.replace(/<[^>]*>/g, ' ').trim() || "";
    
    console.log(`ID: ${p.id} | Date: ${p.publishedAt}`);
    console.log(`Title: ${p.title}`);
    console.log(`Summary: ${hasSummary ? 'YES' : 'NO'} | Content: ${hasContent ? 'YES' : 'NO'} | Plain Len: ${plainContent.length}`);
    if (plainContent.length > 0) {
      console.log(`Snippet: ${plainContent.substring(0, 50)}...`);
    }
    console.log('-----------------------------------------');
  });
}

checkPosts().catch(console.error).finally(() => prisma.$disconnect());
