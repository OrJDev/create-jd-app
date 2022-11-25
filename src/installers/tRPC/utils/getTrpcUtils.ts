import { IUtil } from "~types";

const getTrpcUtils: IUtil = (ctx) => {
  const useAuth = ctx.installers.includes("SolidAuth");
  return `import { initTRPC${useAuth ? ", TRPCError":""} } from "@trpc/server";
import type { IContext } from "./context";${
    useAuth ? `\nimport { authenticator } from "../auth";` : ""
  }

export const t = initTRPC.context<IContext>().create();

export const router = t.router;
export const procedure = t.procedure;${
    useAuth
      ? `\nexport const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    const user = await authenticator.isAuthenticated(ctx.req);
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to access this resource",
      });
    }
    return next({ ctx: { ...ctx, user } });
  })
);`
      : ""
  }
`;
};

export default getTrpcUtils;
