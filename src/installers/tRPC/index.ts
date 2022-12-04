import { withPackages } from "~helpers/packages";
import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/utils.txt`,
      to: `${ctx.userDir}/src/utils/trpc.ts`,
    },
  ],
  pkgs: withPackages({
    normal: [
      "solid-trpc",
      "@trpc/client",
      "@trpc/server",
      "@tanstack/solid-query",
    ],
  }),
});

export default config;
