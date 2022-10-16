import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/utils-${ctx.trpcVersion}.txt`,
      to: `${ctx.userDir}/src/utils/trpc.ts`,
    },
    {
      path: `${__dirname}/files/root.txt`,
      to: `${ctx.userDir}/src/root.tsx`,
    },
    {
      path: `${ctx.templateDir}/trpc/${ctx.trpcVersion}/server${
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
      customVersion:
        ctx.trpcVersion === "V9" ? "9.27.2" : "10.0.0-proxy-beta.21",
    },
    "@trpc/server": {
      customVersion:
        ctx.trpcVersion === "V9" ? "9.27.2" : "10.0.0-proxy-beta.21",
    },
    "solid-trpc": ctx.trpcVersion === "V9" ? {} : { customVersion: "next" },
    "solid-start-trpc": {},
    "@tanstack/solid-query": {},
  },
});

export default config;
