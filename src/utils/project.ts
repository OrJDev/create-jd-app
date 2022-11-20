import path from "path";
import fs from "fs-extra";
import ora from "ora";
import solidHelper from "~helpers/solid";
import inquirer from "inquirer";
import chalk from "chalk";
import { existsOrCreate, overWriteFile } from "./files";
import {
  execa,
  formatError,
  validateName,
  getUserPackageManager,
  solidUpdateJSON,
} from "./helpers";
import { IAppCtx, ICtx, IEnv } from "~types";
import { installPkgs } from "~helpers/installer";
import { updateEnv } from "~helpers/env";
import { modifyConfigIfNeeded } from "~helpers/vite";

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
  let vercel = false;
  if (args.includes("skip")) {
    vercel = args.includes("vercel");
  } else {
    vercel =
      args.includes("vercel") ||
      (
        await inquirer.prompt<{ vercel: boolean }>({
          name: "vercel",
          type: "confirm",
          message: "Will you deploy this project to vercel?",
        })
      ).vercel;
  }
  return {
    appName,
    userDir,
    vercel,
    templateDir: path.join(__dirname, "../../template"),
  };
}

export async function copyTemplate(appContext: IAppCtx) {
  console.log();
  const spinner = ora("Copying template files").start();
  const templateDir = path.join(__dirname, "../..", "template");
  try {
    await fs.copy(
      path.join(templateDir, "base"),
      path.join(appContext.userDir)
    );
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
  scripts: Record<string, string>,
  env: IEnv[]
) {
  const spinner = ora("Modifying project").start();
  try {
    await Promise.all([
      solidHelper(ctx),
      updateEnv(ctx.userDir, env),
      solidUpdateJSON(ctx, scripts),
      modifyConfigIfNeeded(ctx),
    ]);
    spinner.succeed("Modified project");
  } catch (e) {
    spinner.fail(`Couldn't modify project: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installDeps(
  pkgManager: ReturnType<typeof getUserPackageManager>,
  userDir: string,
  len: boolean
) {
  console.log(
    `\n${chalk.blue("Using")} ${chalk.bold(
      chalk.yellow(pkgManager.toUpperCase())
    )} ${chalk.bold(chalk.blue("as package manager"))}`
  );
  const spinner = ora("Installing template dependencies").start();
  try {
    await execa(`${pkgManager} install`, { cwd: userDir });
    spinner.succeed(`Installed${len ? " template" : ""} dependencies`);
  } catch (e) {
    spinner.fail(`Couldn't install template dependencies: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installAddonsDependencies(
  pkgManager: ReturnType<typeof getUserPackageManager>,
  ctx: ICtx,
  deps: [string[], string[]]
) {
  const spinner = ora("Installing addons dependencies").start();
  if (deps[0].length || deps[1].length) {
    try {
      await installPkgs(pkgManager, ctx.userDir, deps);
      spinner.succeed("Installed addons dependencies");
    } catch (e) {
      spinner.fail(`Couldn't install addons dependencies: ${formatError(e)}`);
      process.exit(1);
    }
  } else {
    spinner.succeed("No addons to install");
  }
}

export async function runCommands(ctx: IAppCtx, commands: string[]) {
  const spinner = ora("Running queued commands").start();
  try {
    for (const cmd of commands) {
      await execa(cmd, {
        cwd: ctx.userDir,
      });
    }
    spinner.succeed("Ran queued commands");
  } catch (e) {
    spinner.fail(`Couldn't run queued commands: ${formatError(e)}`);
    process.exit(1);
  }
}

export function finished(
  pkgManager: ReturnType<typeof getUserPackageManager>,
  ctx: ICtx
) {
  console.log(`\n\t${chalk.green(`cd ${ctx.appName}`)}`);
  ctx.installers.includes("Prisma") &&
    console.log(
      `${chalk.yellow(`\t${pkgManager} run push`)}\t${chalk.gray(
        "// pushes db to Prisma"
      )}`
    );
  console.log(chalk.bold(chalk.blue(`\t${pkgManager} run dev`)));
  console.log();
  process.exit(0);
}
