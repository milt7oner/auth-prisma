import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url().optional(),
  API_KEY: z.string().optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  EMAIL_SECRET: z.string().min(1, "EMAIL_SECRET is required"),
  EMAIL_RECOBERY: z.string().email("EMAIL_RECOBERY must be a valid email"),
  JWT_SECRET_RECOVERY: z.string().min(1, "JWT_SECRET_RECOVERY is required"),
});

const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  isProd: env.NODE_ENV === "production",
  port: parseInt(env.PORT, 10),
  dbUrl: env.DATABASE_URL,
  apiKey: env.API_KEY,
  jwtSecret: env.JWT_SECRET,
  emailSecret: env.EMAIL_SECRET,
  emailRecobery: env.EMAIL_RECOBERY,
  jwtSecretRecovery: env.JWT_SECRET_RECOVERY,
};
