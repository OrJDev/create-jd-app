import { IUtil } from "~types";

const getTrpcUtils: IUtil = (ctx) => {
  const useAuth = ctx.installers.includes("SolidAuth");
  const useRateLimit = ctx.installers.includes("Upstash Ratelimit");

  // import statements
  const trpcServerImport = `import { initTRPC${
    useAuth ? ", TRPCError" : ""
  } } from "@trpc/server";`;
  const rateLimitImports = `import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";\n`;
  const contextImport = `import type { IContext } from "./context";`;
  const authImport = useAuth ? `import { authenticator } from "../auth";` : "";

  return `${trpcServerImport}
${useRateLimit ? rateLimitImports : ""}
${contextImport}
${authImport}
${
  useRateLimit
    ? `\nconst ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(20, "10 s"),
});`
    : ""
}

export const t = initTRPC.context<IContext>().create();

${
  useRateLimit
    ? `const withRateLimit = t.middleware(async ({ ctx, next }) => {
  const ip = ctx.req.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    "mw_" + ip
  );
  await pending;
  ctx.res.headers["X-RateLimit-Limit"] = limit.toString();
  ctx.res.headers["X-RateLimit-Remaining"] = remaining.toString();
  ctx.res.headers["X-RateLimit-Reset"] = reset.toString();
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message:
        "Rate limit exceeded, retry in " +
        new Date(reset).getDate() +
        " seconds",
    });
  }
  return next({ ctx });
});`
    : ""
}

export const router = t.router;
export const procedure = t.procedure${
    useRateLimit ? ".use(withRateLimit)" : ""
  };${
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
