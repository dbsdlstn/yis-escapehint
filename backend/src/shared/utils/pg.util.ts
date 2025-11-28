// src/shared/utils/pg.util.ts
import { Pool } from "pg";
import { env } from "../../config/env.config";

// PostgreSQL connection pool
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
