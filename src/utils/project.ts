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
import type { IAppCtx, ICtx, IEnv, IVercelOpt } from "~types";
import { updateEnv } from "~helpers/env";
import { modifyConfigIfNeeded } from "~helpers/vite";
import type { IExpectedPackages } from "~helpers/packages";

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
  const exists = await existsOrCreate(userDir);
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
  const getTempVercel = (): IVercelOpt | undefined | null => {
    const temp = args
      .find((o) => o.startsWith("vercel="))
      ?.split("vercel=")
      .pop()
      ?.toLowerCase();
    const ve = temp
      ? temp === "Cli" || temp === "Dashboard"
        ? temp
        : temp === "none"
        ? null
        : "Cli"
      : undefined;
    if (ve) {
      console.log(`Using Vercel ${chalk.blue(ve)} for deployment`);
    }

    return ve;
  };
  let vercel: IVercelOpt | undefined;
  if (args.includes("skip")) {
    const temp = getTempVercel();
    vercel = temp ?? undefined;
  } else {
    const temp = getTempVercel();
    if (temp !== undefined) {
      vercel = temp ?? undefined;
    } else {
      const temp = (
        await inquirer.prompt<{ vercel: IVercelOpt | "None" }>({
          name: "vercel",
          type: "list",
          choices: ["Cli", "Dashboard", "None"],
          message: "Will you deploy this project to vercel? If so, how",
        })
      ).vercel;
      vercel = temp === "None" ? undefined : temp;
    }
  }
  const pkgManager = getUserPackageManager();
  return {
    appName,
    userDir,
    vercel,
    pkgManager,
    templateDir: path.join(__dirname, "../../template"),
    ssr: true,
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
  pkgs: IExpectedPackages,
  scripts: Record<string, string>,
  env: IEnv[]
) {
  const spinner = ora("Modifying project").start();
  try {
    await Promise.all([
      solidHelper(ctx),
      updateEnv(ctx.userDir, env),
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

export function finished(ctx: ICtx) {
  console.log(`\n\t${chalk.green(`cd ${ctx.appName}`)}`);
  const withRun = ctx.pkgManager === "pnpm" ? "" : " run";
  ctx.installers.includes("Prisma") &&
    console.log(
      `${chalk.yellow(`\t${ctx.pkgManager}${withRun} push`)}\t${chalk.gray(
        "// pushes db to Prisma"
      )}`
    );
  console.log(chalk.bold(chalk.blue(`\t${ctx.pkgManager}${withRun} dev`)));
  console.log();
  process.exit(0);
}
