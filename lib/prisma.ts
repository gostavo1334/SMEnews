import { PrismaClient } from "@/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// pg 8.x treats `sslmode=require` in the URL as `verify-full` and overrides any
// `ssl: { rejectUnauthorized: false }` we pass to the pool. Supabase's pooler
// presents a certificate chain that fails strict verification, so strip the
// `sslmode` query param and let the pool's ssl config take effect.
const rawUrl = `${process.env.DATABASE_URL}`;
const connectionString = rawUrl
  .replace(/[?&]sslmode=[^&]*/g, "")
  .replace(/[?&]pgbouncer=[^&]*/g, "");

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