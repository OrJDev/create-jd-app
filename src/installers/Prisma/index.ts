import { withPackages } from "~helpers/packages";
import type { ICtx, IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/utils/getSchema`,
      type: "exec",
      to: `${ctx.userDir}/prisma/schema.prisma`,
    },
    {
      path: `${__dirname}/files/client.txt`,
      to: `${ctx.userDir}/src/server/db/client.ts`,
    },
    !ctx.installers.includes("tRPC") && !ctx.installers.includes("NextAuth")
      ? {
          path: `${__dirname}/files/api.txt`,
          to: `${ctx.userDir}/src/routes/api/notes.ts`,
        }
      : undefined,
  ],
  scripts: {
    push: "prisma db push",
    postinstall: "prisma generate",
    postbuild: getPb(ctx),
    build:
      ctx.pkgManager === "pnpm"
        ? "solid-start build && pnpm postbuild"
        : "solid-start build",
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
});

export default config;

const getPb = (ctx: ICtx) => {
  const dir =
    ctx.pkgManager === "pnpm"
      ? "node_modules/.pnpm/**/**/prisma/*engine*.node"
      : "node_modules/prisma/*engine*.node";
  const renderFunc = `.vercel/output/functions/render.func/`;
  const apiFunc = `.vercel/output/functions/api.func/`;
  const schema = `prisma/schema.prisma`;
  return `cp ${dir} ${renderFunc} && cp ${schema} ${renderFunc} && cp ${dir} ${apiFunc} && cp ${schema} ${apiFunc}`;
};
