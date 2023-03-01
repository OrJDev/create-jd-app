import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  pkgs: withPackages({
    normal: ["@upstash/ratelimit", "@upstash/redis"],
  }),
  files: ctx.installers.includes("pRPC")
    ? undefined
    : [
        {
          path: `${__dirname}/files/api.txt`,
          to: `${ctx.userDir}/src/routes/api/limit.ts`,
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
