import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z
    .coerce
    .number()
    .int()
    .positive()
    .default(5000),

  FRONTEND_URL: z
    .url()
    .default("http://localhost:5173"),

  VISION_ML_URL: z
    .url()
    .default("http://127.0.0.1:8000"),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.issues);
  process.exit(1);
}

export const env = parsedEnv.data;

console.log("FASHNOVA FRONTEND_URL:", env.FRONTEND_URL);
console.log("FASHNOVA VISION_ML_URL:", env.VISION_ML_URL);