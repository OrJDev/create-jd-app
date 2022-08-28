import { IFile, IHelper } from "~types/Installer";
import { execFiles } from "~utils/files";

const helperFunc: IHelper = async (ctx) => {
  const files: IFile[] = [];
  if (!ctx.installers.length) return;

  // this might be updated soon so i keep it as an array
  files.push({
    type: "exec",
    path: `${__dirname}/utils/getHomePage`,
    to: `${ctx.userDir}/apps/client/src/pages/Home/Home.tsx`,
  });

  await execFiles(files, ctx.installers);
};

export default helperFunc;
