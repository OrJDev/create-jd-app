import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/utils/getSchema`,
      type: "exec",
      to: `${ctx.userDir}/prisma/schema.prisma`,
    },
    {
      path: `${__dirname}/files/client.txt`,
      to: `${ctx.userDir}/src/server/db.ts`,
    },
    !ctx.installers.includes("AuthJS")
      ? {
          path: `${__dirname}/files/api.txt`,
          to: `${ctx.userDir}/src/routes/api/notes.ts`,
        }
      : undefined,
  ],
  scripts: {
    push: "prisma db push",
    postinstall: "prisma generate",
  },
  env: [
    {
      key: "DATABASE_URL",
      type: "string()",
      defaulValue: "file:./db.sqlite",
      kind: "server",
    },
  ],
  pkgs: withPackages({
    dev: "prisma",
    normal: "@prisma/client",
  }),
  commands: `${ctx.pkgManager === "npm" ? "npx" : "pnpm"} prisma db push`,
  ignorePrettier: true
});

export default config;
