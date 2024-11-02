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
        path: `${__dirname}/files/hello.txt`,
        to: `${ctx.userDir}/src/server/hello/hello.queries.ts`,
      },
      {
        path: `${__dirname}/utils/getBuilder`,
        to: `${ctx.userDir}/src/server/prpc.ts`,
        type: "exec",
      },
      useAuth
        ? {
            path: `${__dirname}/files/user.txt`,
            to: `${ctx.userDir}/src/server/user/user.queries.ts`,
          }
        : undefined,
    ],
  };
};

export default config;
