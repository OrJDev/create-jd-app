import { execFiles } from "~utils/files";
import type { ICtx, IEnv, IFile } from "~types";
import getIndexLocation from "./utils/getIndexLocation";
import getRootLocation from "./utils/getRootLocation";

const helperFunc = async (ctx: ICtx, env: IEnv[]) => {
  const indexLocation = getIndexLocation(ctx);
  const rootLocation = getRootLocation(ctx);
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
  if (rootLocation) {
    files.push({
      path: rootLocation,
      type: "copy",
      to: `${ctx.userDir}/src/root.tsx`,
    });
  }
  await execFiles(files, ctx);
};

export default helperFunc;
