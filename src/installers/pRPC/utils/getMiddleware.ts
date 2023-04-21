import type { IUtil } from "~types";

const getMiddleware: IUtil = (ctx) => {
  const useAuth = ctx.installers.includes("AuthJS");
  const useUpstash = ctx.installers.includes("Upstash Ratelimit");
  return `import { middleware$, error$ } from "@prpc/solid";${
    useAuth
      ? `\nimport { getSession } from "@solid-auth/base";
import { authOptions } from "../auth";\n`
      : ""
  }${
    useUpstash
      ? `\nimport { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(20, "10 s"),
});

export const rateLimitMW = middleware$(async ({ request$ }) => {
  const ip = request$.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, pending, reset } = await ratelimit.limit(\`mw_\${ip}\`);
  await pending;

  if (!success) {
     return error$(
      \`Rate limit exceeded, retry in \${new Date(reset).getDate()} seconds\`,
      { status: 429 }
    );
  }
});
`
      : ""
  }${
    useAuth
      ? `\nexport const authMw = middleware$(async ({ request$ }) => {
  const session = await getSession(request$, authOptions);
  if (!session || !session.user) {
    return error$("You can't do that!");
  }
  return {
    session: {
      ...session,
      user: session.user,
    },
  };
});
`
      : ""
  }  
`;
};

export default getMiddleware;
