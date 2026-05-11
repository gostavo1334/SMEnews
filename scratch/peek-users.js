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
  const users = await prisma.user.findMany({ select: { id: true, username: true, name: true } });
  console.log(users);
}

main().finally(() => process.exit(0));
