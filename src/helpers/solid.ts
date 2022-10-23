import { execFiles } from "~utils/files";
import { ICtx, IFile } from "~types";

const helperFunc = async (ctx: ICtx) => {
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getIndexPage`,
      type: "exec",
      to: `${ctx.userDir}/src/routes/index.tsx`,
    },
    {
      path: `${__dirname}/utils/getRootPage`,
      type: "exec",
      to: `${ctx.userDir}/src/root.tsx`,
    },
  ];
  await execFiles(files, ctx);
};

export default helperFunc;
