import { IEnv, IPkg, ISyntax } from "~types";
import { getTRPCVersion } from "~utils/helpers";

export const trpcPkg = (syntax: ISyntax): IPkg => {
  const customVersion = getTRPCVersion(syntax);
  return {
    "@trpc/client": {
      customVersion,
    },
    "@trpc/server": {
      customVersion,
    },
    "@trpc/next": {
      customVersion,
    },
    "solid-trpc": syntax === "v10" ? { customVersion: "next" } : {},
    "@tanstack/solid-query": {},
    // dep of @trpc/next
    "@types/react": {
      devMode: true,
    },
    "@types/react-dom": {
      devMode: true,
    },
  };
};

export const prismaPkgs: IPkg = {
  prisma: {
    devMode: true,
  },
  "@prisma/client": {},
};

export const prismaScripts: Record<string, string> = {
  // postinstall: "prisma generate",
  push: "prisma db push",
  generate: "prisma generate",
};

export const prismaEnv: IEnv[] = [
  {
    key: "DATABASE_URL",
    type: "string()",
    defaulValue: "file:./db.sqlite",
  },
];

export const ServerStartCMD = "vercel dev --local-config ./vercel-dev.json";
