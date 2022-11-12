import { IPkg, IEnv } from "~types";

export const config = `import solid from "solid-start/vite";
import dotenv from "dotenv";
import { defineConfig } from "vite";
// @ts-expect-error no typing
import vercel from "solid-start-vercel";

export default defineConfig(() => {
  dotenv.config();
  return {
    plugins: [solid({ ssr: false, adapter: vercel({ edge: false }) })],
  };
});
`;

export const packages: IPkg = {
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
