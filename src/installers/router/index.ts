import { IConfigCallBack } from "~types/Config";

const config: IConfigCallBack = (userDir, _installers) => ({
  files: [
    {
      path: `${__dirname}/files/app.txt`,
      to: `${userDir}/packages/client/src/App.tsx`,
    },
  ],
  pkgs: {
    "@solidjs/router": { devMode: false, type: "client" },
  },
});

export default config;
