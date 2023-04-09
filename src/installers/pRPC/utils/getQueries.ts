import type { IUtil } from "~types";

const getQueries: IUtil = (ctx) => {
  const usesRateLimit = ctx.installers.includes("Upstash Ratelimit");
  const useAuth = ctx.installers.includes("AuthJS");
  return `import { query$ } from "@prpc/solid";
import { z } from "zod";${
    useAuth || usesRateLimit
      ? `\nimport { ${
          useAuth && usesRateLimit
            ? "protectedProcedure, rateLimitProcedure"
            : useAuth
            ? "protectedProcedure"
            : "rateLimitProcedure"
        } } from "./middleware";`
      : ""
  }${
    useAuth
      ? `\nimport { getSession } from "@solid-auth/base";
import { authOptions } from "../auth";`
      : ""
  }
  
export const helloQuery = query$({
  queryFn: ({ payload }) => {
    return \`server says hello: \${payload.name}\`;
  },
  key: "hello",
  schema: z.object({ name: z.string() }),
});${
    useAuth
      ? `\n\nexport const protectedQuery = protectedProcedure.query$({
  queryFn: ({ ctx$ }) => {
    return \`protected -\${ctx$.session.user.name}\`;
  },
  key: "protected-1"
});

export const meQuery = query$({
  queryFn: async ({ request$ }) => {
    return {
      info: await getSession(request$, authOptions),
    };
  },
  key: "me",
});`
      : ""
  }${
    usesRateLimit
      ? `\n\nexport const rateLimitedQuery = rateLimitProcedure.query$({
  queryFn: () => {
    return "You are not limited, yay!";
  },
  key: "limited",
});`
      : ""
  }
`;
};

export default getQueries;
