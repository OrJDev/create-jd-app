import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${ctx.templateDir}/trpc/server`,
      to: `${ctx.userDir}/src/server/trpc`,
      sep: true,
    },
    {
      path: `${__dirname}/files/ssr-utils.txt`,
      to: `${ctx.userDir}/src/utils/trpc.ts`,
    },
    {
      path: `${ctx.templateDir}/trpc/api`,
      to: `${ctx.userDir}/src/routes/api/trpc`,
    },
    {
      path: `${__dirname}/utils/getTrpcUtils`,
      to: `${ctx.userDir}/src/server/trpc/utils.ts`,
      type: "exec",
    },
    {
      path: `${__dirname}/utils/getTrpcContext`,
      to: `${ctx.userDir}/src/server/trpc/context.ts`,
      type: "exec",
    },
    {
      path: `${__dirname}/utils/getMainRouter`,
      to: `${ctx.userDir}/src/server/trpc/router/example.ts`,
      type: "exec",
    },
  ],
  pkgs: withPackages({
    normal: [
      "@solid-mediakit/trpc",
      "@tanstack/solid-query",
      "@trpc/client",
      "@trpc/server",
    ],
  }),
});

export default config;
