import { prisma } from '../lib/prisma';
async function main() {
  await prisma.post.deleteMany({where: {categoryId: 9}});
  await prisma.category.delete({where: {id: 9}});
  console.log('Deleted category 9');
}
main().finally(() => prisma.$disconnect());
