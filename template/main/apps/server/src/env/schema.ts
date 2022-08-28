import { z } from "zod";

export default z.object({
  PORT: z.string().transform((port) => parseInt(port) ?? 4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});
