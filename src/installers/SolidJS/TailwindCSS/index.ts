import { IInstaller } from "~types/Installer";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/styles.txt`,
      to: `${ctx.userDir}${ctx.clientDir}/src/index.css`,
    },
    {
      path: `${__dirname}/files/postcss.config.txt`,
      to: `${ctx.userDir}${ctx.clientDir}/postcss.config.cjs`,
    },
    {
      path: `${__dirname}/files/tailwind.config.txt`,
      to: `${ctx.userDir}${ctx.clientDir}/tailwind.config.cjs`,
    }
  ],
  pkgs: {
    tailwindcss: { devMode: true, type: ctx.clientDir },
    postcss: { devMode: true, type: ctx.clientDir },
    autoprefixer: { devMode: true, type: ctx.clientDir },
  },
});

export default config;
