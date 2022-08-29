import { IInstaller } from "~types/Installer";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/styles.txt`,
      to: `${ctx.userDir}/apps/client/src/index.css`,
    },
    {
      path: `${__dirname}/files/postcss.config.txt`,
      to: `${ctx.userDir}/apps/client/postcss.config.cjs`,
    },
    {
      path: `${__dirname}/files/tailwind.config.txt`,
      to: `${ctx.userDir}/apps/client/tailwind.config.cjs`,
    },
    {
      path: `${__dirname}/files/home.txt`,
      to: `${ctx.userDir}/apps/client/src/pages/Home/Home.tsx`,
    },
  ],
  pkgs: {
    tailwindcss: { devMode: true, type: "apps/client" },
    postcss: { devMode: true, type: "apps/client" },
    autoprefixer: { devMode: true, type: "apps/client" },
  },
});

export default config;
