const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.log('Posts:', await prisma.post.count());
  console.log('Categories:', await prisma.category.count());
}
main().finally(() => prisma.$disconnect());
