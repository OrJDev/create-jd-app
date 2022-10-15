import { z } from "zod";
import { router } from "../utils";

export default router()
  .query("hello", {
    input: z.object({ name: z.string() }),
    resolve: ({ input }) => {
      return `Hello ${input.name}`;
    },
  })
  .mutation("random", {
    input: z.object({ num: z.number() }),
    resolve: ({ input }) => {
      return Math.floor(Math.random() * 100) / input.num;
    },
  });
