import { createRouter } from "../_utils";
import { z } from "zod";

export default createRouter()
  .query("test", {
    input: z.object({ name: z.string() }),
    resolve({ input }) {
      return `hey ${input.name}`;
    },
  })
  .mutation("mTest", {
    input: z.object({ number: z.number() }),
    resolve({ input }) {
      return input.number / 2 + 1.5;
    },
  })
  .mutation("prisma", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.create({ data: { text: "hello" } });
    },
  });
