import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { ICtx } from "~types/Context";
import { IFile } from "~types/Installer";
import { formatError } from "./helpers";

export async function execFiles(files: IFile[], ctx: ICtx) {
  await Promise.all(
    files.map(async (file) => {
      if (file.type && file.type !== "copy") {
        if (file.type === "exec") {
          if (!file.path) {
            // shouldn't happen as paths will always be mentioned for the type exec
            throw new Error("Missing path for a file with type exec");
          }
          const method = await import(file.path);
          await fs.outputFile(file.to, method.default(ctx));
        } else if (file.type === "delete") {
          await fs.remove(file.to);
        }
      } else {
        if (!file.path) {
          throw new Error("this will never be called");
        }
        return fs.copy(file.path, file.to);
      }
    })
  );
}

export async function existsOrCreate(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    await fs.mkdir(path);
  }
  return false;
}

export async function overWriteFile(userDir: string) {
  const spinner = ora("Emptying directory").start();
  try {
    await fs.emptyDir(userDir);
    spinner.succeed("Emptied directory");
  } catch (e) {
    spinner.fail(`Couldn't empty directory: ${formatError(e)}`);
  }
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
