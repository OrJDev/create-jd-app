import path from "path";
import fs from "fs-extra";
import { IFile, IHelper } from "~types/Installer";
import { execFiles } from "~utils/files";

const helperFunc: IHelper = async (ctx, plugins) => {
  await _InitAppJson(ctx.userDir, ctx.clientDir, ctx.appName);
  const files: IFile[] = [
    {
      path: `${__dirname}/utils/getCircle`,
      type: "exec",
      to: `${ctx.userDir}${ctx.clientDir}/src/components/Circle/Circle.tsx`,
    },
  ];
  if (ctx.initServer) {
    files.push({
      path: `${__dirname}/files/trpcUtil.txt`,
      to: `${ctx.userDir}${ctx.clientDir}/src/utils/trpc.ts`,
    });
    files.push({
      path: `${__dirname}/utils/getApp`,
      to: `${ctx.userDir}${ctx.clientDir}/src/App.tsx`,
      type: "exec",
    });
  }
  await execFiles(files, ctx);
  if (!ctx.installers.length) return;

  await modifyBabel(ctx.userDir, ctx.clientDir, (data) => {
    if (data.plugins) {
      data.plugins = [...data.plugins, ...plugins];
    } else {
      data.plugins = plugins;
    }
    return data;
  });
};

export default helperFunc;

export async function modifyBabel(
  userDir: string,
  clientDir: string,
  cb: (data: any) => Promise<any>
) {
  const babelFile = path.join(userDir, clientDir, "babel.config.js");
  let data = (await fs.readFile(babelFile)).toString();
  let resp = eval(data)({ cache: (...props: any) => {} });
  let newData = await cb({ ...resp });
  await fs.outputFile(
    babelFile,
    `module.exports = function (api) {
  api.cache(true);
  return ${JSON.stringify(newData, null, 2)}
};`
  );
}

const _InitAppJson = async (
  userDir: string,
  clientDir: string,
  appName: string
) => {
  const appJSONPath = path.join(userDir, clientDir, "app.json");

  await fs.writeJson(
    appJSONPath,
    {
      name: appName,
      slug: appName,
      ...(await fs.readJson(appJSONPath)),
    },
    { spaces: 2 }
  );
};
