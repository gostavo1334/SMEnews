const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function wipeAds() {
  const result = await prisma.advertisement.deleteMany();
  console.log(`--- Ads Wipe ---`);
  console.log(`Deleted ${result.count} ads.`);
  console.log(`----------------`);
}

wipeAds().catch(console.error).finally(() => prisma.$disconnect());
