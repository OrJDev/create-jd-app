import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  name: "tRPC",
  files: [
    {
      path: `${__dirname}/files/utils.txt`,
      to: `${ctx.userDir}/src/utils/trpc.ts`,
    },
    {
      path: `${__dirname}/files/entryClient.txt`,
      to: `${ctx.userDir}/src/entry-client.tsx`,
    },
    {
      path: `${ctx.templateDir}/trpc/inner/server${
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
      customVersion: "latest",
    },
    "@trpc/server": {
      customVersion: "latest",
    },
    "solid-trpc": { customVersion: "next" },
    "solid-start-trpc": {},
    "@tanstack/solid-query": {},
  },
});

export default config;
