import fs from "fs-extra";
import ora from "ora";
import type { ICtx, IFile } from "~types";
import { formatError } from "./helpers";

export async function execFiles(files: (IFile | undefined)[], ctx: ICtx) {
  const actualFiles = files.filter((f) => f !== undefined) as IFile[];
  // `sep` files are parent files, so they should be executed first ro resolve conflicts
  for (const file of actualFiles.filter((e) => e.sep)) {
    await execFile(file, ctx);
  }
  await Promise.all(
    actualFiles
      .filter((e) => !e.sep)
      .map(async (file) => {
        await execFile(file, ctx);
      })
  );
}

async function execFile(file: IFile, ctx: ICtx) {
  if (file.type && file.type !== "copy") {
    if (file.type === "exec") {
      if (!file.path) {
        return;
      }
      const method = await import(file.path);
      await fs.outputFile(file.to, method.default(ctx, file.pass));
    } else if (file.type === "delete") {
      await fs.remove(file.to);
    } else if (file.type === "write") {
      await fs.outputFile(file.to, file.content);
    } else if (file.type === "append") {
      await fs.appendFile(file.to, file.content);
    }
  } else {
    if (!file.path) {
      return;
    }
    await fs.copy(file.path, file.to);
  }
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
