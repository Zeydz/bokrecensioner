import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/* I found it here: 
https://www.prisma.io/docs/guides/frameworks/nextjs
*/

/* This file is used to create a single instance of the Prisma Client that can be reused across the application. It also ensures that the Prisma Client is not recreated on every request in development mode, which can lead to performance issues and connection issues. */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
