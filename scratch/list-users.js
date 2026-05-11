const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function listUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      role: true
    }
  });

  console.log('--- Site Users ---');
  users.forEach(u => {
    console.log(`ID: ${u.id} | User: ${u.username} | Name: ${u.name} | Role: ${u.role}`);
  });
}

listUsers().catch(console.error).finally(() => prisma.$disconnect());
