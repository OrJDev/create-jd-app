import type { IUtil } from "~types";

const getQueries: IUtil = (ctx) => {
  const usesRateLimit = ctx.installers.includes("Upstash Ratelimit");

  return `import { query$ } from "@prpc/solid";
import { z } from "zod";${
    usesRateLimit
      ? '\nimport { withRateLimit } from "~/server/withRateLimit";'
      : ""
  }${
    ctx.installers.includes("AuthJS")
      ? `\nimport { authMw } from "./middleware";`
      : ""
  }
  
export const helloQuery = query$(
  ({ payload }) => {
    return \`server says hello: \${payload.name}\`;
  },
  "hello",
  z.object({ name: z.string() })${usesRateLimit ? ",\n  withRateLimit" : ""}
);${
    ctx.installers.includes("AuthJS")
      ? `\n\nexport const protectedQuery = query$(
  ({ ctx$ }) => {
    return \`server says hello: \${ctx$.session.user.name}\`;
  },
  "protected-1",
  undefined,
  authMw
);`
      : ""
  }
`;
};

export default getQueries;
