const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function resetAdmin() {
  const username = 'webmaster';
  const password = 'admin123';
  const hashedPassword = hashPassword(password);

  const user = await prisma.user.upsert({
    where: { username: username },
    update: {
      password: hashedPassword,
      role: 'admin',
      name: 'Webmaster Admin'
    },
    create: {
      username: username,
      password: hashedPassword,
      role: 'admin',
      name: 'Webmaster Admin'
    }
  });

  console.log(`--- Admin Reset ---`);
  console.log(`User: ${user.username}`);
  console.log(`Password: ${password}`);
  console.log(`Role: ${user.role}`);
  console.log(`-------------------`);
}

resetAdmin().catch(console.error).finally(() => prisma.$disconnect());
