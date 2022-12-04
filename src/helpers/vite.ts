import fs from "fs-extra";
import path from "path";
import { ICtx, IUtil } from "~types";

export const getViteConfig: IUtil = (ctx) => {
  const useUno = ctx.installers.includes("UnoCSS");
  return `import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';${
    useUno ? `\nimport UnoCSS from "unocss/vite";` : ""
  }

export default defineConfig({
  plugins: [solidPlugin()${useUno ? ", UnoCSS()" : ""}],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
`;
};

export const modifyConfigIfNeeded = async (ctx: ICtx) => {
  if (
    ctx.installers.includes("UnoCSS") ||
    ctx.installers.includes("tRPC")
  ) {
    await fs.writeFile(
      path.join(ctx.userDir, "vite.config.ts"),
      getViteConfig(ctx)
    );
  }
};
