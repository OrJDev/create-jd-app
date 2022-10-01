import { t } from "../utils";
import { z } from "zod";

export default t.router({
  test: t.procedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => `hey ${input.name}`),
  mTest: t.procedure
    .input(z.object({ number: z.number() }))
    .mutation(({ input }) => input.number / 2 + 1.5),
  prisma: t.procedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.example.create({ data: { text: "hello" } });
  }),
});
