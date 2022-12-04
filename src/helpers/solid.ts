import { execFiles } from "~utils/files";
import { ICtx, IFile } from "~types";

const helperFunc = async (ctx: ICtx) => {
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getBasePage`,
      type: "exec",
      to: `${ctx.userDir}/src/index.tsx`,
    },
    {
      path: `${__dirname}/utils/getStartPage`,
      type: "exec",
      to: `${ctx.userDir}/src/App.tsx`,
    },
  ];
  await execFiles(files, ctx);
};

export default helperFunc;
