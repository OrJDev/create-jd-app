import { execFiles } from "~utils/files";
import { ICtx, IFile } from "~types";

const helperFunc = async (ctx: ICtx) => {
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getHomePage`,
      type: "exec",
      to: `${ctx.userDir}/src/pages/Home/Home.tsx`,
    },
    {
      path: `${__dirname}/utils/getTsConfig`,
      type: "exec",
      to: `${ctx.userDir}/tsconfig.json`,
    },
  ];
  if (ctx.trpc) {
    files.push({
      path: `${__dirname}/files/trpcUtil-${ctx.trpc.syntax}.txt`,
      to: `${ctx.userDir}/src/utils/trpc.ts`,
    });
  }
  if (ctx.trpc || ctx.installers.includes("Router")) {
    files.push({
      path: `${__dirname}/utils/getApp`,
      to: `${ctx.userDir}/src/App.tsx`,
      type: "exec",
    });
  }
  await execFiles(files, ctx);
};

export default helperFunc;
