import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => {
  const useAuth = ctx.installers.includes("AuthJS");
  return {
    pkgs: withPackages({
      normal: [
        "@solid-mediakit/prpc",
        "@solid-mediakit/prpc-plugin",
        "@tanstack/solid-query",
      ],
    }),
    files: [
      {
        path: `${__dirname}/utils/getQueries`,
        to: `${ctx.userDir}/src/server/queries.ts`,
        type: "exec",
      },
      useAuth
        ? {
            path: `${__dirname}/files/authMw.txt`,
            to: `${ctx.userDir}/src/server/middleware.ts`,
          }
        : undefined,
    ],
  };
};

export default config;
