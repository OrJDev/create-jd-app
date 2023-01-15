import { withPackages } from "~helpers/packages";
import type { IInstaller } from "~types";

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
    {
      to: `${ctx.userDir}/src/routes/index.module.css`,
      type: "delete",
    },
  ],
  pkgs: withPackages({
    dev: ["tailwindcss", "postcss", "autoprefixer"],
  }),
});

export default config;
