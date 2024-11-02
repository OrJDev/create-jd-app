import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";
import prettier from "prettier";

export const getAppConfig: IUtil = async (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const usePRPC = ctx.installers.includes("pRPC");
  const useAuth = ctx.installers.includes("AuthJS");
  if (usePRPC) {
    return await prettier.format(
      `import { withPRPC } from "@solid-mediakit/prpc-plugin";

const config = withPRPC(
  {
    ssr: true,${useAuth ? "\n    middleware: './src/middleware.ts'," : ""}${
      usePrisma
        ? `\n    vite: {
      ssr: {
        external: ["@prisma/client"],
      },
    },`
        : ""
    }${
      ctx.vercel
        ? `\n  server: {
    preset: 'vercel',
  },`
        : ""
    }
  },${
    useAuth
      ? `\n  {
    auth: "authjs",
    authCfg: {
      configName: "authOptions",
      source: "~/server/auth",
    },
  }`
      : ""
  }
);

export default config;

declare module "@solid-mediakit/prpc" {
  interface Settings {
    config: typeof config;
  }
}
`,
      {
        parser: "typescript",
      },
    );
  }
  return await prettier.format(
    `import { defineConfig } from "@solidjs/start/config";${
      useAuth ? `\nimport { authVite } from "@solid-mediakit/auth-plugin";` : ""
    }
  
export default defineConfig({
  ssr: true,${
    usePrisma
      ? `\n  vite: {
    ${
      usePrisma
        ? `ssr: {
      external: ["@prisma/client"],
    },`
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
    },
  );
};

export const modifyConfigIfNeeded = async (ctx: ICtx) => {
  if (
    ctx.vercel ||
    ctx.installers.includes("pRPC") ||
    ctx.installers.includes("Prisma")
  ) {
    await fs.writeFile(
      path.join(ctx.userDir, "app.config.ts"),
      await getAppConfig(ctx),
    );
  }
};
