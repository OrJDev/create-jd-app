import { IEnv } from "~types/Config";
import { IPkg } from "~types/Installer";

export const trpcDefaultPkg: IPkg = {
  "@trpc/client": {
    customVersion: "9.27.2",
    type: "client",
  },
  api: {
    customVersion: "*",
    type: "client",
  },
  "@trpc/server": {
    customVersion: "9.27.2",
    type: "client",
  },
};
export const trpcExpoPkg: IPkg = {
  "@trpc/react": {
    customVersion: "9.27.2",
    type: "client",
  },
  "react-query": {
    customVersion: "3.37.0",
    type: "client",
  },
};

export const defaultEnv: IEnv[] = [
  {
    key: "NODE_ENV",
    type: 'enum(["development", "test", "production"]).default("development")',
    ignore: true,
  },
];
