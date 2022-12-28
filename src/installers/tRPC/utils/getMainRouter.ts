import { IUtil } from "~types";

const getMainRouter: IUtil = (ctx) => {
  const useNextAuth = ctx.installers.includes("NextAuth");
  return `import { z } from "zod";
import { procedure, router${
    useNextAuth ? ", protectedProcedure" : ""
  } } from "../utils";

export default router({
  hello: procedure.input(z.object({ name: z.string() })).query(({ input }) => {
    return \`Hello \${input.name}\`;
  }),
  random: procedure
    .input(z.object({ num: z.number() }))
    .mutation(({ input }) => {
      return Math.floor(Math.random() * 100) / input.num;
    }),${
      useNextAuth
        ? `\n  secret: protectedProcedure.query(({ ctx }) => {
    return \`This is top secret - \${ctx.session.user.name}\`;
  }),`
        : ""
    }
});
`;
};

export default getMainRouter;
