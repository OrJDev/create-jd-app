import { IInstaller } from "~types/Installer";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/app.txt`,
      to: `${ctx.userDir}${ctx.clientDir}/src/App.tsx`,
    },
  ],
  pkgs: {
    "@solidjs/router": { devMode: false, type: ctx.clientDir },
  },
});

export default config;
