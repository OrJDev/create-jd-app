import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/config.txt`,
      to: `${ctx.userDir}/vite.config.ts`,
    },
    {
      to: `${ctx.userDir}/src/root.css`,
      type: "delete",
    },
  ],
  pkgs: ["solid-styled"],
  reject: "TailwindCSS",
});

export default config;
