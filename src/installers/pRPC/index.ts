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
        : {
            path: `${__dirname}/files/middleware.txt`,
            to: `${ctx.userDir}/src/server/middleware.ts`,
          },
    ],
  };
};

export default config;
