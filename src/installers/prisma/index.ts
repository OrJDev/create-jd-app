import { IConfigCallBack } from "~types/Config";
import { execa } from "~utils/helpers";

const config: IConfigCallBack = (userDir, _installers) => ({
  files: [
    {
      path: `${__dirname}/files/schema.txt`,
      to: `${userDir}/packages/server/prisma/schema.prisma`,
    },
    {
      path: `${__dirname}/files/client.txt`,
      to: `${userDir}/packages/server/src/db.ts`,
    },
    {
      path: `${__dirname}/files/router.txt`,
      to: `${userDir}/packages/server/src/router/example.ts`,
    },
  ],
  pkgs: {
    prisma: {
      type: "server",
    },
    "@prisma/client": {
      type: "server",
    },
  },
  scripts: {
    postinstall: "prisma generate",
  },
  env: [
    {
      key: "DATABASE_URL",
      type: "string().url()",
      defaulValue: "mysql://root:root@localhost:3306/db",
    },
    {
      key: "NODE_ENV",
      type: 'enum(["development", "test", "production"]).default("development")',
      ignore: true,
    },
  ],
  onFinish: async () => {
    await execa("npx prisma generate", { cwd: `${userDir}/packages/server` });
  },
});

export default config;
