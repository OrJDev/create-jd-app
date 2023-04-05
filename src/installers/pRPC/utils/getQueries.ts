import type { IUtil } from "~types";

const getQueries: IUtil = (ctx) => {
  const usesRateLimit = ctx.installers.includes("Upstash Ratelimit");
  const useAuth = ctx.installers.includes("AuthJS");
  return `import { query$ } from "@prpc/solid";
import { z } from "zod";${
    useAuth || usesRateLimit
      ? `\nimport { ${
          useAuth && usesRateLimit
            ? "authMw, rateLimitMW"
            : useAuth
            ? "authMw"
            : "rateLimitMW"
        } } from "./middleware";`
      : ""
  }
  
export const helloQuery = query$(
  ({ payload }) => {
    return \`server says hello: \${payload.name}\`;
  },
  "hello",
  z.object({ name: z.string() })
);${
    useAuth
      ? `\n\nexport const protectedQuery = query$(
  ({ ctx$ }) => {
    return \`server says hello: \${ctx$.session.user.name}\`;
  },
  "protected-1",
  undefined,
  authMw
);`
      : ""
  }${
    usesRateLimit
      ? `\n\nexport const rateLimitedQuery = query$(
  () => {
    return \`server says hello\`;
  },
  "limited-1",
  undefined,
  rateLimitMW
);`
      : ""
  }
`;
};

export default getQueries;
