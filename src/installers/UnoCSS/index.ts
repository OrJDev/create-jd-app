import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  pkgs: {
    unocss: {
      devMode: true,
    },
  },
  name: "UnoCSS",
  files: [
    {
      path: `${__dirname}/files/root.txt`,
      to: `${ctx.userDir}/src/root.tsx`,
    },
    {
      to: `${ctx.userDir}/src/root.css`,
      content: "/* feel free to modify uno in here */",
      type: "write",
    },
    {
      path: `${__dirname}/files/config.txt`,
      to: `${ctx.userDir}/unocss.config.ts`,
    },
  ],
});

export default config;
