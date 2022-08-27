import { IInstaller } from "~types/Installer";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/app.txt`,
      to: `${ctx.userDir}/apps/client/src/App.tsx`,
    },
  ],
  pkgs: {
    "@solidjs/router": { devMode: false, type: "apps/client" },
  },
});

export default config;
