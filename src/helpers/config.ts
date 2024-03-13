import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";

export const getAppConfig: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  return `import { defineConfig } from '@solidjs/start/config'
  
export default defineConfig({
  ssr: true,${usePrisma ? `\n  ssr: { external: ["@prisma/client"] },` : ""}${
    ctx.vercel
      ? `\n  server: {
    preset: 'vercel',
  },`
      : ""
  }
});
  `;
};

export const modifyConfigIfNeeded = async (ctx: ICtx) => {
  if (ctx.vercel || ctx.installers.includes("Prisma")) {
    await fs.writeFile(
      path.join(ctx.userDir, "app.config.ts"),
      getAppConfig(ctx)
    );
  }
};
