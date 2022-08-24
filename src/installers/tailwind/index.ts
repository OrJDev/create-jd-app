import { IConfigCallBack } from "~types/Config";

const config: IConfigCallBack = (userDir, _installers) => ({
  files: [
    {
      path: `${__dirname}/files/globals.txt`,
      to: `${userDir}/packages/client/src/index.css`,
    },
    {
      path: `${__dirname}/files/home.txt`,
      to: `${userDir}/packages/client/src/pages/Home/Home.tsx`,
    },
    {
      path: `${__dirname}/files/postcss.config.txt`,
      to: `${userDir}/packages/client/postcss.config.cjs`,
    },
    {
      path: `${__dirname}/files/tailwind.config.txt`,
      to: `${userDir}/packages/client/tailwind.config.cjs`,
    },
  ],
  pkgs: {
    tailwindcss: { devMode: true, type: "client" },
    postcss: { devMode: true, type: "client" },
    autoprefixer: { devMode: true, type: "client" },
  },
});

export default config;
