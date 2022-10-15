import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${ctx.templateDir}/prisma`,
      to: `${ctx.userDir}/prisma`,
    },
    {
      path: `${__dirname}/files/client.txt`,
      to: `${ctx.userDir}/src/server/db/client.ts`,
    },
  ],
  scripts: {
    push: "prisma db push",
    generate: "prisma generate",
  },
  env: [
    {
      key: "DATABASE_URL",
      type: "string()",
      defaulValue: "file:./db.sqlite",
    },
  ],
  pkgs: {
    prisma: {
      devMode: true,
    },
    "@prisma/client": {},
  },
  commands: "npx prisma generate",
});

export default config;
