import { IFile, IHelper } from "~types/Installer";
import { execFiles } from "~utils/files";

const helperFunc: IHelper = async (ctx) => {
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getHomePage`,
      type: "exec",
      to: `${ctx.userDir}${ctx.clientDir}/src/pages/Home/Home.tsx`,
    },
  ];
  if (ctx.initServer) {
    files.push({
      path: `${__dirname}/files/trpcUtil.txt`,
      to: `${ctx.userDir}${ctx.clientDir}/src/utils/trpc.ts`,
    });
  }
  await execFiles(files, ctx);
};

export default helperFunc;
