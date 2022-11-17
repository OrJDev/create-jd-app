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
    // i don't want to use @next because its not an offical trpc package and i need to update it manually every realase
    "@trpc/client": {
      customVersion: "10.0.0-rc.2",
    },
    "@trpc/server": {
      customVersion: "10.0.0-rc.2",
    },
    "solid-trpc": { customVersion: "next" },
    "solid-start-trpc": {},
    "@tanstack/solid-query": {},
  },
});

export default config;
