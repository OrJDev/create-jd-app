import { IInstaller } from "~types/Installer";

const config: IInstaller = (ctx) => {
  return {
    pkgs: {
      nativewind: { type: ctx.clientDir },
      tailwindcss: { devMode: true, type: ctx.clientDir },
    },
    files: [
      {
        path: `${__dirname}/files/HomePage.txt`,
        to: `${ctx.userDir}${ctx.clientDir}/src/screens/Home/Home.tsx`,
      },
      {
        path: `${__dirname}/files/config.txt`,
        to: `${ctx.userDir}${ctx.clientDir}/tailwind.config.js`,
      },
      {
        path: `${__dirname}/files/types.txt`,
        to: `${ctx.userDir}${ctx.clientDir}/tailwind.d.ts`,
      },
      {
        to: `${ctx.userDir}${ctx.clientDir}/src/screens/Home/styles.ts`,
        type: "delete",
      },
      {
        to: `${ctx.userDir}${ctx.clientDir}/src/components/Circle/styles.ts`,
        type: "delete",
      },
    ],
    plugins: ["nativewind/babel"],
  };
};

export default config;
