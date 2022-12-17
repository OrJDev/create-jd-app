import { IUtil } from "~types";

const getTrpcUtils: IUtil = (ctx) => {
  const useSolidAuth = ctx.installers.includes("SolidAuth");
  const useNextAuth = ctx.installers.includes("NextAuth");
  const useAuth = useSolidAuth || useNextAuth;
  const useUpstash = ctx.installers.includes("Upstash Ratelimit");
  return `import { initTRPC${
    useAuth || useUpstash ? ", TRPCError" : ""
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
    useAuth
      ? `\nexport const protectedProcedure = t.procedure${
          useUpstash ? ".use(withRateLimit)" : ""
        }.use(
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.${useSolidAuth ? "user" : "session"}${
          useNextAuth ? " || !ctx.session.user" : ""
        }) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to access this resource",
      });
    }
    return next({ ctx: { ...ctx, ${
      useNextAuth
        ? "session: { ...ctx.session, user: ctx.session.user },"
        : "user: ctx.user,"
    } } });
  })
);`
      : ""
  }
`;
};

export default getTrpcUtils;
