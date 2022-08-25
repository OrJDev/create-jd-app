import { IFile, IHelper } from "~types/Installer";
import { execFiles } from "~utils/files";

const helperFunc: IHelper = async (userDir, _appName, installers) => {
  const files: IFile[] = [];
  if (installers.length) {
    files.push({
      type: "exec",
      path: `${__dirname}/utils/getHomePage`,
      to: `${userDir}/packages/client/src/pages/Home/Home.tsx`,
    });
  }
  await execFiles(files, installers);
};

export default helperFunc;
