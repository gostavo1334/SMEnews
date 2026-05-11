const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function checkAds() {
  const ads = await prisma.advertisement.findMany();

  console.log('--- Database Ads Check ---');
  console.log(`Total Ads in DB: ${ads.length}`);
  ads.forEach(ad => {
    console.log(`ID: ${ad.id} | Title: ${ad.title} | Pos: ${ad.position} | Active: ${ad.active}`);
  });
  console.log('-------------------------');
}

checkAds().catch(console.error).finally(() => prisma.$disconnect());
