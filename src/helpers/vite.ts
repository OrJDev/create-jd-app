import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";

export const getViteConfig: IUtil = (ctx) => {
  const useUno = ctx.installers.includes("UnoCSS");
  const usePrisma = ctx.installers.includes("Prisma");
  const getPlugins = () => {
    if (useUno && ctx.vercel) {
      return `[
          solid({ ssr: ${ctx.ssr}, adapter: vercel({ edge: false }) }),
          UnoCSS(),
        ]`;
    } else if (useUno) {
      return `[solid({ ssr: ${ctx.ssr} }), UnoCSS()]`;
    } else if (ctx.vercel) {
      return `[solid({ ssr: ${ctx.ssr}, adapter: vercel({ edge: false }) })]`;
    } else {
      return `[solid({ ssr: ${ctx.ssr} })]`;
    }
  };
  const plugins = getPlugins();
  return `import solid from "solid-start/vite";${
    useUno ? `\nimport UnoCSS from "unocss/vite";` : ""
  }
import { defineConfig } from "vite";${
    ctx.vercel
      ? `\n// @ts-expect-error no typing
import vercel from "solid-start-vercel";`
      : ""
  }
  
export default defineConfig(() => {
  return {
    plugins: ${plugins},${
    usePrisma ? `\n    ssr: { external: ["@prisma/client"] },` : ""
  }
  };
});
  `;
};

export const modifyConfigIfNeeded = async (ctx: ICtx) => {
  if (
    ctx.vercel ||
    ctx.installers.includes("UnoCSS") ||
    !ctx.ssr ||
    ctx.installers.includes("Prisma")
  ) {
    await fs.writeFile(
      path.join(ctx.userDir, "vite.config.ts"),
      getViteConfig(ctx)
    );
  }
};
