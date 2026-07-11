require('dotenv').config();
const { PrismaClient } = require('./client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const crypto = require('crypto');

const rawUrl = `${process.env.DATABASE_URL}`;
const connectionString = rawUrl
  .replace(/[?&]sslmode=[^&]*/g, "")
  .replace(/[?&]pgbouncer=[^&]*/g, "");

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const adminPassword = hashPassword('168');
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: adminPassword,
      role: 'admin',
    },
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      name: 'Super Admin',
    },
  });

  console.log('Admin user created/updated:', admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
