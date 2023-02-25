import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  pkgs: withPackages({
    normal: ["@upstash/ratelimit", "@upstash/redis"],
  }),
  files: ctx.installers.includes("tRPC")
    ? undefined
    : [
        {
          path: `${__dirname}/files/api.txt`,
          to: `${ctx.userDir}/src/utils/withRateLimit.ts`,
        },
        {
          path: `${__dirname}/files/entry-server.txt`,
          to: `${ctx.userDir}/src/entry-server.tsx`,
        },
      ],
  env: [
    {
      key: "UPSTASH_REDIS_REST_URL",
      type: "string()",
      kind: "server",
    },
    {
      key: "UPSTASH_REDIS_REST_TOKEN",
      type: "string()",
      kind: "server",
    },
  ],
});

export default config;
