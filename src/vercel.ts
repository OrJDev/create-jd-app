import { withPackages } from "~helpers/packages";
import { IEnv } from "~types";

export const vercelPackages = withPackages({
  dev: "solid-start-vercel",
});

export const vercelEnv: IEnv[] = [
  {
    key: "ENABLE_VC_BUILD",
    defaulValue: "1",
    type: 'string().default("1").transform((v) => parseInt(v))',
    kind: "server",
  },
];
