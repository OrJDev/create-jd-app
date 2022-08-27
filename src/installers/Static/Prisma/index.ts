import { IInstaller } from "~types/Installer";
import { execa } from "~utils/helpers";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/schema.txt`,
      to: `${ctx.userDir}/packages/api/prisma/schema.prisma`,
    },
    {
      path: `${__dirname}/files/client.txt`,
      to: `${ctx.userDir}/packages/api/src/db.ts`,
    },
    {
      path: `${__dirname}/files/router.txt`,
      to: `${ctx.userDir}/packages/api/src/router/example.ts`,
    },
    {
      path: `${__dirname}/files/context.txt`,
      to: `${ctx.userDir}/packages/api/src/context.ts`,
    },
    {
      path: `${__dirname}/files/db.sqlite`,
      to: `${ctx.userDir}/packages/api/prisma/db.sqlite`,
    },
  ],
  pkgs: {
    prisma: {
      type: "packages/api",
      devMode: true,
    },
    "@prisma/client": {
      type: "packages/api",
    },
  },
  scripts: {
    postinstall: "prisma generate",
  },
  env: [
    {
      key: "DATABASE_URL",
      type: "string().url()",
      defaulValue: "file:./db.sqlite",
    },
    {
      key: "NODE_ENV",
      type: 'enum(["development", "test", "production"]).default("development")',
      ignore: true,
    },
  ],
  onFinish: async () => {
    await execa("npx prisma generate", {
      cwd: `${ctx.userDir}/packages/api`,
    });
  },
});

export default config;
