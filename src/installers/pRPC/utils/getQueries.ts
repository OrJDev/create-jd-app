import type { IUtil } from "~types";

const getQueries: IUtil = (ctx) => {
  const usesRateLimit = ctx.installers.includes("Upstash Ratelimit");

  return `import { query$ } from "@prpc/solid";
import { z } from "zod";${
    usesRateLimit
      ? '\nimport { withRateLimit } from "~/server/withRateLimit";'
      : ""
  }
  
export const helloQuery = query$(
  ({ payload }) => {
    return \`server says hello: \${payload.name}\`;
  },
  "hello",
  z.object({ name: z.string() })${usesRateLimit ? ",\n  withRateLimit" : ""}
);
`;
};

export default getQueries;
