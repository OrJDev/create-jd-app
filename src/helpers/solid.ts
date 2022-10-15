import { execFiles } from "~utils/files";
import { ICtx, IFile } from "~types";

const helperFunc = async (ctx: ICtx) => {
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getIndexPage`,
      type: "exec",
      to: `${ctx.userDir}/src/routes/index.tsx`,
    },
  ];
  await execFiles(files, ctx);
};

export default helperFunc;
