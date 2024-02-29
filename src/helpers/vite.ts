import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";

export const getViteConfig: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  return `import { defineConfig } from '@solidjs/start/config'${
    ctx.vercel ? `\nimport vercel from "solid-start-vercel";` : ""
  }
  
export default defineConfig({
  start: {
    ssr: true,${
      usePrisma ? `\n    ssr: { external: ["@prisma/client"] },` : ""
    }${
    ctx.vercel
      ? `\n    server: {
      preset: 'vercel',
    },`
      : ""
  }
  },
})
  `;
};

export const modifyConfigIfNeeded = async (ctx: ICtx) => {
  if (ctx.vercel || ctx.installers.includes("Prisma")) {
    await fs.writeFile(
      path.join(ctx.userDir, "vite.config.ts"),
      getViteConfig(ctx)
    );
  }
};
