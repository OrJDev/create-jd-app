import { execFiles } from "~utils/files";
import type { ICtx, IFile } from "~types";

const helperFunc = async (ctx: ICtx) => {
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getIndexPage`,
      type: "exec",
      to: `${ctx.userDir}/src/routes/index.tsx`,
    },
    {
      path: `${__dirname}/utils/getReadMe`,
      type: "exec",
      to: `${ctx.userDir}/README.MD`,
    },
  ];
  await execFiles(files, ctx);
};

export default helperFunc;
