import { IUtil } from "~types";

const getTrpcUtils: IUtil = (ctx) => {
  const useAuth = ctx.installers.includes("SolidAuth");
  const useUpstash = ctx.installers.includes("Upstash Ratelimit");
  return `import { initTRPC${
    useAuth ? ", TRPCError" : ""
  } } from "@trpc/server";
import superjson from "superjson";
import type { IContext } from "./context";${
    useAuth ? `\nimport { authenticator } from "../auth";` : ""
  }${
    useUpstash
      ? `\nimport { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";`
      : ""
  }

export const t = initTRPC.context<IContext>().create({
  transformer: superjson,
});

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
  }${
    useUpstash
      ? `\nconst ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(20, "10 s"),
});

const withRateLimit = t.middleware(async ({ ctx, next }) => {
  const ip = ctx.req.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    \`mw_\${ip}\`
  );
  await pending;
  ctx.res.headers["X-RateLimit-Limit"] = limit.toString();
  ctx.res.headers["X-RateLimit-Remaining"] = remaining.toString();
  ctx.res.headers["X-RateLimit-Reset"] = reset.toString();
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: \`Rate limit exceeded, retry in \${new Date(
        reset
      ).getDate()} seconds\`,
    });
  }
  return next({ ctx });
});

export const limitedProcedure = t.procedure.use(withRateLimit);`
      : ""
  }
`;
};

export default getTrpcUtils;
