import { IPkg } from "~types/Installer";
import { IKeyValue } from "~types/Static";

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
};

export const prismaPkgs: IPkg = {
  prisma: {
    devMode: true,
  },
  "@prisma/client": {},
};

export const prismaScripts: IKeyValue<string> = {
  postinstall: "prisma generate",
  push: "prisma db push",
  generate: "prisma generate",
};
