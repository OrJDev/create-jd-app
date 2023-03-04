import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => {
  return {
    pkgs: withPackages({
      normal: ["@prpc/solid", "@prpc/vite", "@adeora/solid-query"],
    }),
    files: [
      {
        path: `${__dirname}/utils/getQueries`,
        type: "exec",
        to: `${ctx.userDir}/src/server/queries.ts`,
      },
      {
        path: `${__dirname}/utils/getRoot`,
        type: "exec",
        to: `${ctx.userDir}/src/root.tsx`,
      },
    ],
  };
};

export default config;
