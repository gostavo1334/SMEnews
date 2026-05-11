import { prisma } from '../lib/prisma';
async function main() {
  const cats = await prisma.category.findMany({ include: { _count: { select: { posts: true } } } });
  cats.forEach(c => console.log(`${c.id}: ${c.name} (${c.slug}) - ${c._count.posts} posts`));
}
main().finally(() => prisma.$disconnect());
