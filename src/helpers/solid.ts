import { execFiles } from "~utils/files";
import type { ICtx, IEnv, IFile } from "~types";
import getIndexLocation from "./utils/getIndexLocation";

const helperFunc = async (ctx: ICtx, env: IEnv[]) => {
  const indexLocation = getIndexLocation(ctx);
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getReadMe`,
      type: "exec",
      to: `${ctx.userDir}/README.MD`,
      pass: env,
    },
  ];
  if (indexLocation) {
    files.push({
      path: indexLocation,
      type: "copy",
      to: `${ctx.userDir}/src/routes/index.tsx`,
    });
  }
  await execFiles(files, ctx);
};

export default helperFunc;
