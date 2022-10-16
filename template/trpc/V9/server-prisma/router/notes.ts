import { z } from "zod";
import { router } from "../utils";

export default router()
  .mutation("create", {
    input: z.object({ text: z.string() }),
    resolve: async ({ input, ctx }) => {
      return await ctx.prisma.notes.create({ data: input });
    },
  })
  .query("get", {
    input: z.object({ id: z.string() }),
    resolve: async ({ input, ctx }) => {
      return await ctx.prisma.notes.findUnique({ where: { id: input.id } });
    },
  });
