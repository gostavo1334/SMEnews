import { prisma } from '../lib/prisma';
async function main() {
  console.log('Posts:', await prisma.post.count());
  console.log('Categories:', await prisma.category.count());
}
main().finally(() => prisma.$disconnect());
