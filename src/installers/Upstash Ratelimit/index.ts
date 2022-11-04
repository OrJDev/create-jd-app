import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  name: "Upstash Ratelimit",
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
  files: [
    {
      path: `${__dirname}/files/${ctx.trpcVersion}.txt`,
      to: `${ctx.userDir}/src/server/trpc/utils.ts`,
      after: "trpc",
    },
  ],
  pkgs: {
    "@upstash/ratelimit": {},
    "@upstash/redis": {},
  },
  after: "tRPC",
});

export default config;
