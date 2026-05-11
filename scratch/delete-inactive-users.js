const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ 
  connectionString,
  ssl: connectionString.includes('neon') ? { rejectUnauthorized: true } : undefined
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const usersToDelete = await prisma.user.findMany({
    where: {
      role: { not: 'admin' },
      posts: { none: {} }
    }
  });

  console.log(`Found ${usersToDelete.length} users with 0 posts and not admin.`);
  
  const result = await prisma.user.deleteMany({
    where: {
      role: { not: 'admin' },
      posts: { none: {} }
    }
  });
  console.log(`Deleted ${result.count} users.`);
}

main().finally(() => process.exit(0));
