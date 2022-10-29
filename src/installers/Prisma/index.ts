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
    postbuild:
      "cp node_modules/@prisma/engines/*query* .vercel/output/functions/render.func/ && cp prisma/schema.prisma .vercel/output/functions/render.func/",
  },
  env: [
    {
      key: "DATABASE_URL",
      type: "string()",
      defaulValue: "file:./db.sqlite",
      kind: "server",
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
