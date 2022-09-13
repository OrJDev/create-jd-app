import { IInstaller } from "~types/Installer";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/app.txt`,
      to: `${ctx.userDir}/src/App.tsx`,
    },
  ],
  pkgs: {
    "@solidjs/router": {},
  },
});

export default config;
