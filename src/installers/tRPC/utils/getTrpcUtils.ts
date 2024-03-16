import type { IUtil } from "~types";

const getTrpcUtils: IUtil = (ctx) => {
  const useNextAuth = ctx.installers.includes("AuthJS");
  return `import { initTRPC${
    useNextAuth ? ", TRPCError" : ""
  } } from "@trpc/server";
import type { IContext } from "./context";

export const t = initTRPC.context<IContext>().create();

export const router = t.router;
export const procedure = t.procedure;${
    useNextAuth
      ? `\n\nexport const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to access this resource",
      });
    }
    return next({
      ctx: { ...ctx, session: { ...ctx.session, user: ctx.session.user } },
    });
  })
);`
      : ""
  }
`;
};

export default getTrpcUtils;
