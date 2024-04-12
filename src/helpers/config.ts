import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";
import prettier from "prettier";

export const getAppConfig: IUtil = async (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const usePRPC = ctx.installers.includes("pRPC");
  const useTailwindCSS = ctx.installers.includes("TailwindCSS");
  const useAuth = ctx.installers.includes("AuthJS");
  return await prettier.format(
    `import { defineConfig } from "@solidjs/start/config";${
      usePRPC ? `\nimport { prpcVite } from "@solid-mediakit/prpc-plugin";` : ""
    }${
      useAuth ? `\nimport { authVite } from "@solid-mediakit/auth-plugin";` : ""
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
              }${useTailwindCSS ? "tailwindcss()," : ""}${
                useAuth
                  ? `authVite({ 
                    authOpts:{
                  name: "authOptions",
                  dir: "~/server/auth"
                },
                redirectTo: "/"
              })`
                  : ""
              }],`
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
  `,
    {
      parser: "typescript",
    }
  );
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
      await getAppConfig(ctx)
    );
  }
};
