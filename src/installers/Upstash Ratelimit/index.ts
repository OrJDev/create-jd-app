import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  pkgs: withPackages({
    normal: ["@upstash/ratelimit", "@upstash/redis"],
  }),
  files: (() => {
    // tRPC ratelimit is handled in it's own installer as t.middleware
    if (ctx.installers.includes("tRPC")) return [];

    if (ctx.installers.includes("pRPC"))
      return [
        {
          path: `${__dirname}/files/prpc-middleware.txt`,
          to: `${ctx.userDir}/src/server/withRateLimit.ts`,
        },
      ];

    return [
      {
        path: `${__dirname}/files/solidjs-middleware.txt`,
        to: `${ctx.userDir}/src/utils/withRateLimit.ts`,
      },
      {
        path: `${__dirname}/files/entry-server.txt`,
        to: `${ctx.userDir}/src/entry-server.tsx`,
      },
    ];
  })(),
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
