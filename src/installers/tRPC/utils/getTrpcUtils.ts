import type { IUtil } from "~types";

const getTrpcUtils: IUtil = (ctx) => {
  const useNextAuth = ctx.installers.includes("AuthJS");
  const useUpstash = ctx.installers.includes("Upstash Ratelimit");
  return `import { initTRPC${
    useNextAuth || useUpstash ? ", TRPCError" : ""
  } } from "@trpc/server";
import type { IContext } from "./context";${
    useUpstash
      ? `\nimport { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";`
      : ""
  }

export const t = initTRPC.context<IContext>().create();

export const router = t.router;${
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

export const procedure = t.procedure.use(withRateLimit);`
      : "\nexport const procedure = t.procedure;"
  }${
    useNextAuth
      ? `\nexport const protectedProcedure = t.procedure${
          useUpstash ? ".use(withRateLimit)" : ""
        }.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to access this resource",
      });
    }
    return next({ ctx: { ...ctx, session: { ...ctx.session, user: ctx.session.user }, } });
  })
);`
      : ""
  }
`;
};

export default getTrpcUtils;
