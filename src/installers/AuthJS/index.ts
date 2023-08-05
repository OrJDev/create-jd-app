import type { KeyOrKeyArray } from "~helpers/packages";
import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

const config: IInstaller = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const normal: KeyOrKeyArray<"normal"> = [
    "@auth/core",
    "@solid-mediakit/auth",
  ];
  if (usePrisma) {
    normal.push("@next-auth/prisma-adapter");
  }
  return {
    pkgs: withPackages({
      normal,
    }),
    files: [
      {
        path: `${__dirname}/files/${usePrisma ? "prisma-" : ""}config.txt`,
        to: `${ctx.userDir}/src/server/auth.ts`,
      },
      {
        path: `${__dirname}/files/handler.txt`,
        to: `${ctx.userDir}/src/routes/api/auth/[...solidauth].ts`,
      },
      !ctx.installers.includes("tRPC") && !ctx.installers.includes("pRPC")
        ? {
            path: `${__dirname}/files/root.txt`,
            to: `${ctx.userDir}/src/root.tsx`,
          }
        : undefined,
    ],
    env: [
      {
        key: "DISCORD_ID",
        type: "string()",
        kind: "server",
      },
      {
        key: "DISCORD_SECRET",
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
        key: "AUTH_URL",
        defaulValue: "http://localhost:3000",
        type: "string().optional()",
        kind: "server",
      },
    ],
  };
};

export default config;
