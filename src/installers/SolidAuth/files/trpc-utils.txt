import { initTRPC, TRPCError } from "@trpc/server";
import { authenticator } from "../auth";
import type { IContext } from "./context";

export const t = initTRPC.context<IContext>().create();

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(
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
);
