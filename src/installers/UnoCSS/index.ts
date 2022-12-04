import { withPackages } from "~helpers/packages";
import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  pkgs: withPackages({
    dev: "unocss",
  }),
  files: [
    {
      to: `${ctx.userDir}/src/index.css`,
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
