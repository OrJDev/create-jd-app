import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => {
  return {
    pkgs: withPackages({
      normal: ["@prpc/solid", "@prpc/vite", "@tanstack/solid-query"],
    }),
    files: [
      {
        path: `${__dirname}/utils/getQueries`,
        type: "exec",
        to: `${ctx.userDir}/src/server/queries.ts`,
      },
      !ctx.installers.includes("AuthJS")
        ? {
            path: `${__dirname}/files/root.txt`,
            to: `${ctx.userDir}/src/root.tsx`,
          }
        : undefined,
      ctx.installers.includes("AuthJS") ||
      ctx.installers.includes("Upstash Ratelimit")
        ? {
            path: `${__dirname}/utils/getMiddleware`,
            type: "exec",
            to: `${ctx.userDir}/src/server/middleware.ts`,
          }
        : undefined,
    ],
  };
};

export default config;
