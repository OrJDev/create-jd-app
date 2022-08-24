import fs from "fs-extra";
import ora from "ora";
import { IFile } from "~types/Installer";
import { formatError } from "./helpers";

export async function execFiles(files: IFile[], installers: string[]) {
  await Promise.all(
    files.map(async (file) => {
      if (file.type && file.type !== "copy") {
        if (file.type === "exec") {
          if (!file.path) {
            throw new Error("this will never be called");
          }
          const method = await import(file.path);
          await fs.outputFile(file.to, method.default(installers));
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
