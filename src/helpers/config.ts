import fs from "fs-extra";
import path from "path";
import type { ICtx, IUtil } from "~types";
import prettier from "prettier";

export const getAppConfig: IUtil = async (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const useAuthPC = ctx.installers.includes("AuthPC");
  const useAuth = ctx.installers.includes("AuthJS");
  if (useAuthPC) {
    return await prettier.format(
      `import { withAuthPC } from "@solid-mediakit/authpc-plugin";

const config = withAuthPC(
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

declare module "@solid-mediakit/authpc" {
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
    ctx.installers.includes("AuthPC") ||
    ctx.installers.includes("Prisma")
  ) {
    await fs.writeFile(
      path.join(ctx.userDir, "app.config.ts"),
      await getAppConfig(ctx),
    );
  }
};
