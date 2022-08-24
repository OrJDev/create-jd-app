import fs from "fs/promises";
import path from "path";
import { IPkg, IPkgInfo } from "~types/Installer";
import { IKeyValue, INullAble } from "~types/Static";
import { execa } from "./helpers";

export const isPkgInfo = (pkg: boolean | IPkgInfo): pkg is IPkgInfo =>
  typeof pkg !== "boolean" && "customVersion" in pkg;

export async function updateNode(
  userDir: string,
  pkgs: IPkg,
  scripts: IKeyValue
) {
  await modifyJSON(userDir, async (json) => {
    if(Object.keys(pkgs).length){
    await Promise.all(
      Object.keys(pkgs).map(async (pkg) => {
        let item = pkgs[pkg];
      const version = item.customVersion ? item.customVersion :  
      (await execa(`npm show ${pkg} version`)).stdout?.trim();
          json[item.devMode ? "devDependencies" : "dependencies"][pkg] = version;
      })
    );
    }
    json.scripts = { ...json.scripts, ...scripts };
    return json;
  });
}

export async function modifyJSON(
  userDir: string,
  cb: (json: any) => Promise<any>
) {
  const json = JSON.parse(
    await fs.readFile(path.join(userDir, "package.json"), "utf8")
  );
  const newJson = await cb({ ...json });
  await fs.writeFile(
    path.join(userDir, "package.json"),
    JSON.stringify(newJson, null, 2)
  );
  return newJson;
}
