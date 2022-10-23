import { z } from "zod";
import { procedure, router } from "../utils";

export default router({
  create: procedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.notes.create({ data: input });
    }),
  get: procedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.notes.findUnique({ where: { id: input.id } });
    }),
});
