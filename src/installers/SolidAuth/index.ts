import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  name: "SolidAuth",
  pkgs: {
    "solidjs-auth": {},
  },
  files: [
    {
      path: `${__dirname}/files/${
        ctx.installers.includes("Prisma") ? "prisma-server" : "server"
      }.txt`,
      to: `${ctx.userDir}/src/server/auth.ts`,
    },
    {
      path: `${__dirname}/files/authUtils.txt`,
      to: `${ctx.userDir}/src/utils/auth.ts`,
    },
    {
      path: `${__dirname}/files/${
        ctx.installers.includes("Prisma") ? "prisma-handler" : "handler"
      }.txt`,
      to: `${ctx.userDir}/src/routes/api/auth/[...solidauth].ts`,
    },
    ...(ctx.installers.includes("tRPC")
      ? [
          {
            path: `${__dirname}/files/trpc-utils.txt`,
            to: `${ctx.userDir}/src/server/trpc/utils.ts`,
          },
          {
            path: `${__dirname}/files/trpc-router.txt`,
            to: `${ctx.userDir}/src/server/trpc/router/example.ts`,
          },
        ]
      : []),
  ],
  env: [
    {
      key: "VITE_SESSION_SECRET",
      type: "string()",
      kind: "client",
      defaulValue: "randomStringHey?Asf",
    },
    {
      key: "SITE_URL",
      type: "string()",
      kind: "server",
      defaulValue: "http://localhost:3000",
    },
    {
      key: "DISCORD_CLIENT_ID",
      type: "string()",
      kind: "server",
    },
    {
      key: "DISCORD_CLIENT_SECRET",
      type: "string()",
      kind: "server",
    },
  ],
});

export default config;
