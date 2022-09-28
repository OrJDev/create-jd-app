import path from "path";
import fs from "fs-extra";
import ora from "ora";
import { existsOrCreate, overWriteFile } from "./files";
import { execa, formatError, validateName, modifyJSON } from "./helpers";
import { IAppCtx, ICtx, IEnv } from "~types";
import inquirer from "inquirer";
import chalk from "chalk";
import { installPkgs } from "~helpers/installer";
import SolidHelper from "~helpers/solid";
import { prismaEnv } from "~constants";
import { resolveEnv, updateEnv } from "~helpers/env";

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
  const initServer = (
    await inquirer.prompt<{ initServer: boolean }>({
      name: "initServer",
      type: "confirm",
      message: `Do you want to use tRPC?`,
    })
  ).initServer;
  return {
    appName,
    userDir,
    initServer,
  };
}

export async function copyTemplate(appContext: IAppCtx) {
  console.log();
  const spinner = ora("Copying template files").start();
  const templateDir = path.join(__dirname, "../..", "template");
  try {
    if (appContext.initServer) {
      await Promise.all([
        fs.copy(
          path.join(templateDir, "client"),
          path.join(appContext.userDir)
        ),
        fs.copy(path.join(templateDir, "server"), appContext.userDir),
      ]);
    } else {
      await fs.copy(
        path.join(templateDir, "client"),
        path.join(appContext.userDir)
      );
    }
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
    if (ctx.initServer) {
      await Promise.all([
        SolidHelper(ctx),
        resolveEnv(env).then((modifiedENV) =>
          updateEnv(ctx.userDir, modifiedENV)
        ),
        fs.copy(
          path.join(__dirname, "../..", "template", "config"),
          path.join(ctx.userDir)
        ),
        fs.copy(
          path.join(__dirname, "../..", "template", "serverConfig.json"),
          path.join(ctx.userDir, "tsconfig.json")
        ),
      ]);
    } else {
      await SolidHelper(ctx);
    }
    await modifyJSON(ctx.userDir, (json) => {
      json.name = ctx.appName;
      if (ctx.initServer) {
        json.prisna = { scheme: "../prisma/schema.prisma" };
        json.scripts.dev = "vercel dev --local-config ./vercel-dev.json";
      }
      json.scripts = { ...json.scripts, ...scripts };
      return json;
    });
    spinner.succeed("Modified project");
  } catch (e) {
    spinner.fail(`Couldn't modify project: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installDeps(userDir: string, len: boolean) {
  console.log();
  const spinner = ora("Installing template dependencies").start();
  try {
    await execa("npm install", { cwd: userDir });
    spinner.succeed(`Installed${len ? " template" : ""} dependencies`);
  } catch (e) {
    spinner.fail(`Couldn't install template dependencies: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installAddonsDependencies(
  ctx: ICtx,
  deps: [string[], string[]]
) {
  const spinner = ora("Installing addons dependencies").start();
  if (deps[0].length || deps[1].length) {
    try {
      await installPkgs(ctx.userDir, deps);
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
  const spinner = ora("Generating prisma Types").start();
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
  ctx.initServer &&
    console.log(
      `${chalk.yellow("\tnpm run push")}\t${chalk.gray(
        "// pushes db to Prisma"
      )}`
    );
  console.log(chalk.bold(chalk.blue("\tnpm run dev")));
  console.log();
  process.exit(0);
}
