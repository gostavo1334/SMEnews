import { PrismaClient } from "../prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createClient() {
  const client = new PrismaClient({
    adapter,
    log: ["query"],
  });
  console.log("DEBUG: Prisma initialized with models:", Object.keys(client).filter(k => !k.startsWith('_')));
  return client;
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Force fresh client if models are missing (useful for dev HMR)
export function getDb() {
  if (prisma && (prisma as any).book) return prisma;
  return createClient();
}