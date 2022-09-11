// @ts-check
import { z } from "zod";

export default z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
});

