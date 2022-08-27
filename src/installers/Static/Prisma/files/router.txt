import { createRouter } from "../utils";
import { z } from "zod";

export default createRouter()
  .query("test", {
    input: z.object({ name: z.string() }),
    resolve({ input }) {
      return `hello ${input.name}`;
    },
  })
  .mutation("mTest", {
    input: z.object({ number: z.number() }),
    resolve({ input }) {
      return input.number / 2 + 1;
    },
  })
  .mutation("prisma", {
    input: z.object({ text: z.string() }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.example.create({ data: input });
    },
  });
