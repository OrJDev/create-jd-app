import { execFiles } from "~utils/files";
import { ICtx, IFile } from "~types";

const helperFunc = async (ctx: ICtx) => {
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getHomePage`,
      type: "exec",
      to: `${ctx.userDir}/src/pages/Home/Home.tsx`,
    },
  ];
  if (ctx.initServer) {
    files.push({
      path: `${__dirname}/files/trpcUtil.txt`,
      to: `${ctx.userDir}/src/utils/trpc.ts`,
    });
  }
  await execFiles(files, ctx);
};

export default helperFunc;
