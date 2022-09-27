import { z } from "zod";

export default z.object({
  DATABASE_URL: z.string(),
});
