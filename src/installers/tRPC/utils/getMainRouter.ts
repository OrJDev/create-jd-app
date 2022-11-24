import { IUtil } from "~types";

const getMainRouter: IUtil = (ctx) => {
  const useAuth = ctx.installers.includes("SolidAuth");
  return `import { z } from "zod";
import { procedure, router${
    useAuth ? ", protectedProcedure" : ""
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
      useAuth
        ? `\n  secret: protectedProcedure.query(({ ctx }) => {
    return \`This is top secret - \${ctx.user.displayName}\`;
  }),`
        : ""
    }
});
`;
};

export default getMainRouter;
