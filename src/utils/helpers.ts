import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import { IAppCtx, ICtx } from "~types/Context";

export const execa = promisify(exec);

const DEFAULT_ERR = "Something Went Wrong";

const errCheck = (message?: string): string =>
  message?.length ? message : DEFAULT_ERR;

export const formatError = (err: any): string => {
  if (typeof err === "string") return errCheck(err);
  else if (typeof err === "object") {
    if (Array.isArray(err)) {
      if (err.length) {
        return formatError(err.shift());
      } else return errCheck();
    } else if ("message" in err) {
      return formatError(err.message);
    } else if ("stack" in err) {
      return formatError(err.stack);
    }
  }
  return errCheck();
};

export const validateName = (name: string) => {
  if (!name.length) return false;
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
    ? true
    : "This is not a valid name";
};

const STATIC_DIR = "Static";
const INSTALLERS_DIR = path.join(__dirname, "../installers");

export async function getCtxWithInstallers(ctx: IAppCtx): Promise<ICtx> {
  let frameworkInstallers: string[] = [];
  let staticInstallers: string[] = [];
  let pkgs: string[] = [];
  staticInstallers = await fs.readdir(path.join(INSTALLERS_DIR, STATIC_DIR));
  try {
    frameworkInstallers = await fs.readdir(
      path.join(INSTALLERS_DIR, ctx.framework)
    );
  } catch {}
  console.log();
  pkgs = (
    await inquirer.prompt<{ pkgs: string[] }>({
      name: "pkgs",
      type: "checkbox",
      message: "What should we use for this app?",
      choices: [...staticInstallers, ...frameworkInstallers],
    })
  ).pkgs.map(
    (pkg) =>
      `${frameworkInstallers.includes(pkg) ? ctx.framework : STATIC_DIR}/${pkg}`
  );
  return { ...ctx, installers: pkgs };
}
