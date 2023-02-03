import { withPackages } from "~helpers/packages";
import type { IEnv } from "~types";

export const vercelPackages = withPackages({
  dev: "solid-start-vercel",
});

export const vercelEnv: IEnv[] = [
  {
    key: "ENABLE_VC_BUILD",
    ignore: true,
    defaulValue: "1",
    type: 'string().default("1").transform((v) => parseInt(v))',
    kind: "server",
  },
];
