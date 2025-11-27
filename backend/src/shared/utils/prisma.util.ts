// src/shared/utils/prisma.util.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../../config/env.config";

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Prisma adapter
const adapter = new PrismaPg(pool);

// Prisma client instance (singleton)
export const prisma = new PrismaClient({ adapter });
