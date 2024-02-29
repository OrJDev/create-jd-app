import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = () => ({
  pkgs: withPackages({
    normal: ["@upstash/ratelimit", "@upstash/redis"],
  }),
  files: [],
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
