import { withPackages } from "~helpers/packages";
import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/styles.txt`,
      to: `${ctx.userDir}/src/root.css`,
    },
    {
      path: `${__dirname}/files/postcss.config.txt`,
      to: `${ctx.userDir}/postcss.config.cjs`,
    },
    {
      path: `${__dirname}/files/tailwind.config.txt`,
      to: `${ctx.userDir}/tailwind.config.cjs`,
    },
  ],
  pkgs: withPackages({
    dev: ["tailwindcss", "postcss", "autoprefixer"],
  }),
});

export default config;
