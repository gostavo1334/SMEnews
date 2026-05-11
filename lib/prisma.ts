import { PrismaClient } from "@prisma/client";

// FORCING A HARD RESET TO CLEAR STALE "WARM" FUNCTIONS ON VERCEL
// We are intentionally NOT reusing the global object for this deployment 
// to ensure the old DriverAdapter client is completely purged.

export const prisma = new PrismaClient({
  log: ["query"],
});

// Purging global cache
const globalForPrisma = global as unknown as { prisma: any };
globalForPrisma.prisma = undefined;