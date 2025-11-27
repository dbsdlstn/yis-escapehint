import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Database configuration
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT configuration
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // Admin configuration
  ADMIN_PASSWORD: z.string().default("admin123"),

  // CORS configuration
  CORS_ORIGIN: z.string().default("*"), // Default to allow all in development, should be configured for production

  // Application configuration
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("info"),
  PORT: z.preprocess(val => parseInt(val as string, 10), z.number().min(1000).max(65535)).default(3000),
});

// Validate and parse environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);

  throw new Error(`Invalid environment variables: ${parsedEnv.error.flatten().fieldErrors}`);
}

// Export validated environment variables
export const env = parsedEnv.data;

// Type for validated environment variables
export type Env = z.infer<typeof envSchema>;
