import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";

export const getAppConfig: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const usePRPC = ctx.installers.includes("pRPC");
  return `import { defineConfig } from "@solidjs/start/config";${
    usePRPC ? `\nimport { prpcVite } from "@solid-mediakit/prpc-plugin";` : ""
  }
  
export default defineConfig({
  ssr: true,${
    usePrisma || usePRPC
      ? `\n  vite: {
    ${
      usePrisma
        ? `ssr: {
      external: ["@prisma/client"],
    },`
        : ""
    }${usePRPC ? `\n    plugins: [prpcVite()],` : ""}
  },`
      : ""
  }${
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
