import { withPackages } from "~helpers/packages";
import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  pkgs: withPackages({
    normal: ["@solid-auth/core", "@solid-auth/socials"],
  }),
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
      path: `${__dirname}/utils/getProtectedLayout`,
      to: `${ctx.userDir}/src/layouts/Protected.tsx`,
      type: "exec",
    },
    {
      path: `${__dirname}/utils/getHandler`,
      to: `${ctx.userDir}/src/routes/api/auth/[...solidauth].ts`,
      type: "exec",
    },
    {
      path: `${__dirname}/files/protected.txt`,
      to: `${ctx.userDir}/src/routes/protected.tsx`,
    },
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
