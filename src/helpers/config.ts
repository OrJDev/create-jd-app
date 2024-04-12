import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";

export const getAppConfig: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const usePRPC = ctx.installers.includes("pRPC");
  const useTailwindCSS = ctx.installers.includes("TailwindCSS");
  return `import { defineConfig } from "@solidjs/start/config";${
    usePRPC ? `\nimport { prpcVite } from "@solid-mediakit/prpc-plugin";` : ""
  }${
    useTailwindCSS
      ? `\n// @ts-ignore\nimport tailwindcss from "@tailwindcss/vite";`
      : ""
  }
  
export default defineConfig({
  ssr: true,${
    usePrisma || usePRPC || useTailwindCSS
      ? `\n  vite: {
    ${
      usePrisma
        ? `ssr: {
      external: ["@prisma/client"],
    },`
        : ""
    }${
          usePRPC || useTailwindCSS
            ? `${usePrisma ? "\n" : ""}   plugins: [${
                usePRPC ? "prpcVite(), " : ""
              }${useTailwindCSS ? "tailwindcss()" : ""}],`
            : ""
        }
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
  if (
    ctx.vercel ||
    ctx.installers.includes("pRPC") ||
    ctx.installers.includes("Prisma") ||
    ctx.installers.includes("TailwindCSS")
  ) {
    await fs.writeFile(
      path.join(ctx.userDir, "app.config.ts"),
      getAppConfig(ctx)
    );
  }
};
