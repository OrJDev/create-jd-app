import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/utils.txt`,
      to: `${ctx.userDir}/src/utils/trpc.ts`,
    },
    {
      path: `${__dirname}/files/root.txt`,
      to: `${ctx.userDir}/src/root.tsx`,
    },
    {
      path: `${ctx.templateDir}/trpc/server${
        ctx.installers.includes("Prisma") ? "-prisma" : ""
      }`,
      to: `${ctx.userDir}/src/server/trpc`,
    },
    {
      path: `${ctx.templateDir}/trpc/api`,
      to: `${ctx.userDir}/src/routes/api`,
    },
  ],
  pkgs: {
    "@trpc/client": {
      customVersion: "9.27.2",
    },
    "@trpc/server": {
      customVersion: "9.27.2",
    },
    "solid-trpc": {},
    "solid-start-trpc": {},
    "@tanstack/solid-query": {},
  },
});

export default config;
