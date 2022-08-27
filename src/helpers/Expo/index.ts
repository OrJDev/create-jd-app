import path from "path";
import fs from "fs-extra";
import { IHelper } from "~types/Installer";

const helperFunc: IHelper = async (ctx, plugins: string[]) => {
  await _InitAppJson(ctx.userDir, ctx.appName);
  if (!ctx.installers.length) return;

  await modifyBabel(ctx.userDir, (data) => {
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
  cb: (data: any) => Promise<any>
) {
  const babelFile = path.join(userDir, "apps", "client", "babel.config.js");
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

const _InitAppJson = async (userDir: string, appName: string) => {
  const appJSONPath = path.join(userDir, "apps", "client", "app.json");

  await fs.writeJson(appJSONPath, {
    name: appName,
    slug: appName,
    ...(await fs.readJson(appJSONPath)),
  });
};
