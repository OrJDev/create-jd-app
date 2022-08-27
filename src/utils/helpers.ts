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

export async function getCtxWithInstallers(ctx: IAppCtx): Promise<ICtx> {
  let installers: string[] = [];
  let pkgs: string[] = [];
  const INSTALLERS_DIR = path.join(__dirname, "../installers");
  installers = (await fs.readdir(path.join(INSTALLERS_DIR, "static"))).map(
    (item) => `Static/${item}`
  );
  try {
    installers = [
      ...installers,
      ...(await fs.readdir(path.join(INSTALLERS_DIR, ctx.framework))).map(
        (item) => `${ctx.framework}/${item}`
      ),
    ];
  } catch {}  
    console.log();
    pkgs = (
      await inquirer.prompt<{ pkgs: string[] }>({
        name: "pkgs",
        type: "checkbox",
        message: "What should we use for this app?",
        choices: installers,
      })
    ).pkgs;
  return { ...ctx, installers: pkgs };
}
