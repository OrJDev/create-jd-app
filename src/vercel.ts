import { IPkg, IEnv } from "~types";

export const vercelPackages: IPkg = {
  "solid-start-vercel": {
    devMode: true,
  },
};

export const vercelEnv: IEnv[] = [
  {
    key: "ENABLE_VC_BUILD",
    defaulValue: "1",
    type: 'string().default("1").transform((v) => parseInt(v))',
    kind: "server",
  },
];
