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

export async function initApp(): Promise<IAppCtx> {
  console.log();
  const appName = (
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
  const syntax = (
    await inquirer.prompt<{
      trpcVersion: "v9" | "v10" | "I Don't Want To Use tRPC";
    }>({
      name: "trpcVersion",
      type: "list",
      message: "Choose tRPC version",
      choices: ["v9", "v10", "I Don't Want To Use tRPC"],
    })
  ).trpcVersion;
  return {
    appName,
    userDir,
    trpc: syntax === "I Don't Want To Use tRPC" ? undefined : { syntax },
  };
}

export async function copyTemplate(appContext: IAppCtx) {
  console.log();
  const spinner = ora("Copying template files").start();
  const templateDir = path.join(__dirname, "../..", "template");
  try {
    await Promise.all([
      fs.copy(path.join(templateDir, "client"), path.join(appContext.userDir)),
      appContext.trpc &&
        fs.copy(path.join(templateDir, "server"), appContext.userDir),
      appContext.trpc &&
        fs.copy(
          path.join(templateDir, "trpc", appContext.trpc.syntax),
          path.join(appContext.userDir, "api", "src")
        ),
    ]);
    await fs.rename(
      path.join(appContext.userDir, "_gitignore"),
      path.join(appContext.userDir, ".gitignore")
    );
    spinner.succeed(`Copied template files to ${appContext.userDir}`);
  } catch (e) {
    spinner.fail(`Couldn't copy template files: ${formatError(e)}`);
    process.exit(1);
  }
}
export async function modifyProject(
  ctx: ICtx,
  scripts: Record<string, string>,
  env: IEnv[][]
) {
  const spinner = ora("Modifying project").start();
  try {
    await Promise.all([
      solidHelper(ctx),
      ctx.trpc && updateEnv(ctx.userDir, env),
      ctx.trpc &&
        fs.copy(
          path.join(__dirname, "../..", "template", "config"),
          path.join(ctx.userDir)
        ),
      solidUpdateJSON(ctx, scripts),
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

export async function runServerCommands(ctx: IAppCtx) {
  const spinner = ora("Generating prisma types").start();
  try {
    await execa("npx prisma generate", {
      cwd: ctx.userDir,
    });
    spinner.succeed("Generated prisma types");
  } catch (e) {
    spinner.fail(`Couldn't generate prisma types: ${formatError(e)}`);
    process.exit(1);
  }
}

export function finished(ctx: ICtx) {
  console.log(`\n\t${chalk.green(`cd ${ctx.appName}`)}`);
  ctx.trpc &&
    console.log(
      `${chalk.yellow("\tnpm run push")}\t${chalk.gray(
        "// pushes db to Prisma"
      )}`
    );
  console.log(chalk.bold(chalk.blue(`\tnpm run ${ctx.trpc ? "vdev" : "dev"}`)));
  console.log();
  process.exit(0);
}
