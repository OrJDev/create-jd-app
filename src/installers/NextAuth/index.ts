import type { KeyOrKeyArray } from "~helpers/packages";
import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const normal: KeyOrKeyArray<"normal"> = ["@auth/core", "@auth/solid-start"];
  if (usePrisma) {
    normal.push("@next-auth/prisma-adapter");
  }
  return {
    pkgs: withPackages({
      normal,
    }),
    files: [
      {
        path: `${__dirname}/files/${usePrisma ? "prisma-" : ""}handler.txt`,
        to: `${ctx.userDir}/src/routes/api/auth/[...solidauth].ts`,
      },
      {
        path: `${__dirname}/files/types.txt`,
        to: `${ctx.userDir}/auth.d.ts`,
      },
      {
        path: `${__dirname}/files/tsconfig.txt`,
        to: `${ctx.userDir}/tsconfig.json`,
      },
    ],
    env: [
      {
        key: "GITHUB_ID",
        type: "string()",
        kind: "server",
      },
      {
        key: "GITHUB_SECRET",
        type: "string()",
        kind: "server",
      },
      {
        key: "AUTH_SECRET",
        type: "string()",
        defaulValue: "b198e07a64406260b98f06e21c457b84",
        kind: "server",
      },
      {
        key: "AUTH_TRUST_HOST",
        type: "string().optional()",
        kind: "server",
        defaulValue: "true",
      },
      {
        key: "NEXTAUTH_URL",
        defaulValue: "http://localhost:5173",
        type: "string().optional()",
        kind: "server",
      },
    ],
  };
};

export default config;
