import { withPackages } from "~helpers/packages";
import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${ctx.templateDir}/trpc/server`,
      to: `${ctx.userDir}/src/server/trpc`,
      sep: true,
    },
    {
      path: `${__dirname}/utils/getClientUtils`,
      to: `${ctx.userDir}/src/utils/trpc.ts`,
      type: "exec",
    },
    {
      path: `${__dirname}/files/root.txt`,
      to: `${ctx.userDir}/src/root.tsx`,
    },
    {
      path: `${ctx.templateDir}/trpc/api`,
      to: `${ctx.userDir}/src/routes/api`,
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
      ctx.ssr ? "solid-trpc->ssr" : "solid-trpc",
      ctx.ssr ? "@adeora/solid-query" : "@tanstack/solid-query",
      "solid-start-trpc",
      "@trpc/client",
      "@trpc/server",
    ],
  }),
});

export default config;
