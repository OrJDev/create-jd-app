import path from "path";
import fs from "fs-extra";
import ora from "ora";
import inquirer from "inquirer";
import chalk from "chalk";
import { existsOrCreate, overWriteFile } from "./files";
import solidHelper from "~helpers/solid";
import {
  execa,
  formatError,
  validateName,
  getUserPackageManager,
  solidUpdateJSON,
} from "./helpers";
import { IAppCtx, ICtx } from "~types";
import { modifyConfigIfNeeded } from "~helpers/vite";
import { IExpectedPackages } from "~helpers/packages";

export async function initApp(args: string[]): Promise<IAppCtx> {
  console.log();
  let pName = args
    .find((o) => o.startsWith("pname="))
    ?.split("pname=")
    .pop();
  if (pName && !validateName(pName)) {
    pName = undefined;
  }
  const appName =
    pName ||
    (
      await inquirer.prompt<{ appName: string }>({
        name: "appName",
        type: "input",
        message: "What is the name of the app?",
        validate: validateName,
        default: "my-app",
      })
    ).appName;
  const userDir = path.resolve(process.cwd(), appName);
  let exists = await existsOrCreate(userDir);
  if (exists) {
    if (
      (
        await inquirer.prompt<{ overWrite: boolean }>({
          name: "overWrite",
          type: "confirm",
          message: `Do you want to overwrite this directory?`,
        })
      ).overWrite
    ) {
      await overWriteFile(userDir);
    } else {
      console.log(chalk.red("Aborting..."));
      process.exit(1);
    }
  }
  const pkgManager = getUserPackageManager();
  return {
    appName,
    userDir,
    pkgManager,
  };
}

export async function copyTemplate(appContext: IAppCtx) {
  const spinner = ora("Copying template files").start();
  const templateDir = path.join(__dirname, "../..", "template");
  try {
    await fs.copy(templateDir, path.join(appContext.userDir));
    await Promise.all([
      fs.rename(
        path.join(appContext.userDir, "_gitignore"),
        path.join(appContext.userDir, ".gitignore")
      ),
    ]);
    spinner.succeed(`Copied template files to ${appContext.userDir}`);
  } catch (e) {
    spinner.fail(`Couldn't copy template files: ${formatError(e)}`);
    process.exit(1);
  }
}
export async function modifyProject(
  ctx: ICtx,
  pkgs: IExpectedPackages,
  scripts: Record<string, string>
) {
  const spinner = ora("Modifying project").start();
  try {
    await Promise.all([
      solidHelper(ctx),
      solidUpdateJSON(ctx, scripts, pkgs),
      modifyConfigIfNeeded(ctx),
    ]);
    spinner.succeed("Modified project");
  } catch (e) {
    spinner.fail(`Couldn't modify project: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installDeps(ctx: ICtx) {
  console.log(
    `\n${chalk.blue("Using")} ${chalk.bold(
      chalk.yellow(ctx.pkgManager.toUpperCase())
    )} ${chalk.bold(chalk.blue("as package manager"))}`
  );
  const spinner = ora("Installing dependencies").start();
  try {
    await execa(`${ctx.pkgManager} install`, { cwd: ctx.userDir });
    spinner.succeed("Installed dependencies");
  } catch (e) {
    spinner.fail(`Couldn't install template dependencies: ${formatError(e)}`);
    process.exit(1);
  }
}

export function finished(ctx: ICtx) {
  console.log(`\n\t${chalk.green(`cd ${ctx.appName}`)}`);
  console.log(chalk.bold(chalk.blue(`\t${ctx.pkgManager} run dev`)));
  console.log();
  process.exit(0);
}
