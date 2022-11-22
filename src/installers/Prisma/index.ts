import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  name: "Prisma",
  files: [
    {
      path: `${__dirname}/files/${
        ctx.installers.includes("SolidAuth") ? "auth-schema" : "schema"
      }.txt`,
      to: `${ctx.userDir}/prisma/schema.prisma`,
    },
    {
      path: `${__dirname}/files/client.txt`,
      to: `${ctx.userDir}/src/server/db/client.ts`,
    },
    !ctx.installers.includes("tRPC") &&
      !ctx.installers.includes("SolidAuth") && {
        path: `${__dirname}/files/api.txt`,
        to: `${ctx.userDir}/src/routes/api/notes.ts`,
      },
  ],
  scripts: {
    push: "prisma db push",
    generate: "prisma generate",
    postbuild: `cp ${
      ctx.pkgManager === "pnpm"
        ? "node_modules/.pnpm/**/@prisma/engines/*query*"
        : "node_modules/@prisma/engines/*query*"
    } .vercel/output/functions/render.func/ && cp prisma/schema.prisma .vercel/output/functions/render.func/`,
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
  commands: "npx prisma db push",
});

export default config;
