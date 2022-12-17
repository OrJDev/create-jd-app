import { IUtil } from "~types";

const getMainRouter: IUtil = (ctx) => {
  const useSolidAuth = ctx.installers.includes("SolidAuth");
  const useNextAuth = ctx.installers.includes("NextAuth");
  const useAuth = useSolidAuth || useNextAuth;
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
    return \`This is top secret - \${ctx.${
      useSolidAuth ? "user.displayName" : "session.user.name"
    }}\`;
  }),`
        : ""
    }
});
`;
};

export default getMainRouter;
