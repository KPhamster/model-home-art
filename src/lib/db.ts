import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set!");
}

// Create the Prisma adapter for Neon with connection string
const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
