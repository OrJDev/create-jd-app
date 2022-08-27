import { IInstaller } from "~types/Installer";

const config: IInstaller = (ctx) => {
  return {
    pkgs: {
      nativewind: { type: "apps/client" },
      tailwindcss: { devMode: true, type: "apps/client" },
    },
    files: [
      {
        path: `${__dirname}/files/HomePage.txt`,
        to: `${ctx.userDir}/apps/client/src/screens/Home/Home.tsx`,
      },
      {
        path: `${__dirname}/files/CircleComp.txt`,
        to: `${ctx.userDir}/apps/client/src/components/Circle/Circle.tsx`,
      },
      {
        path: `${__dirname}/files/config.txt`,
        to: `${ctx.userDir}/apps/client/tailwind.config.js`,
      },
      {
        path: `${__dirname}/files/types.txt`,
        to: `${ctx.userDir}/apps/client/tailwind.d.ts`,
      },
      {
        to: `${ctx.userDir}/apps/client/src/screens/Home/styles.ts`,
        type: "delete",
      },
      {
        to: `${ctx.userDir}/apps/client/src/components/Circle/styles.ts`,
        type: "delete",
      },
    ],
    plugins: ["nativewind/babel"],
  };
};

export default config;
