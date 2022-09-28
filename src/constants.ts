import { IEnv, IPkg } from "~types";

export const trpcPkg: IPkg = {
  "@trpc/client": {
    customVersion: "9.27.2",
  },
  "@trpc/server": {
    customVersion: "9.27.2",
  },
  "@trpc/next": {
    customVersion: "9.27.2",
  },
  "solid-trpc": {},
  "@tanstack/solid-query": {},
  // dep of @trpc/next
  "@types/react": {
    devMode: true,
  },
  "@types/react-dom": {
    devMode: true,
  },
};

export const prismaPkgs: IPkg = {
  prisma: {
    devMode: true,
  },
  "@prisma/client": {},
};

export const prismaScripts: Record<string, string> = {
  postinstall: "prisma generate",
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