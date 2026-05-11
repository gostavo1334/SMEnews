import { prisma } from '../lib/prisma';
async function main() {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Category", "Post" RESTART IDENTITY CASCADE;');
  console.log('Truncated Category and Post tables.');
}
main().finally(() => prisma.$disconnect());
