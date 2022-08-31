import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { IPkg } from "../types/Installer";

export const execa = promisify(exec);

export async function updateNode(userDir: string, pkgs: IPkg) {
  await modifyJSON(userDir, async (json) => {
    await Promise.all(
      Object.keys(pkgs).map(async (pkg) => {
        let item = pkgs[pkg];
        let isDev = item.devMode;
        let version =
          item.customVersion ??
          (await execa(`npm show ${pkg} version`)).stdout?.trim();
        json[isDev ? "devDependencies" : "dependencies"][pkg] = version;
      })
    );
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
