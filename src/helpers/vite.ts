import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";

export const getViteConfig: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const usePrpc = ctx.installers.includes("pRPC");
  const withPrpc = usePrpc ? "prpc(), " : "";
  const getPlugins = () => {
    if (ctx.vercel) {
      return `[${withPrpc}solid({ ssr: ${ctx.ssr}, adapter: vercel({ edge: false }) })]`;
    } else {
      return `[${withPrpc}solid({ ssr: ${ctx.ssr} })]`;
    }
  };
  const plugins = getPlugins();
  return `import solid from "solid-start/vite";
import { defineConfig } from "vite";${
    ctx.vercel ? `\nimport vercel from "solid-start-vercel";` : ""
  }${usePrpc ? `\nimport prpc from "@prpc/vite";` : ""}
  
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
    !ctx.ssr ||
    ctx.installers.includes("Prisma") ||
    ctx.installers.includes("pRPC")
  ) {
    await fs.writeFile(
      path.join(ctx.userDir, "vite.config.ts"),
      getViteConfig(ctx)
    );
  }
};
