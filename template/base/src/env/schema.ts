import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const serverScheme = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const clientScheme = z.object({
  MODE: z.enum(["development", "production", "test"]).default("development"),
});
