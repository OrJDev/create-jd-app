import path from "path";
import fs from "fs-extra";
import ora from "ora";
import { existsOrCreate, overWriteFile } from "./files";
import { execa, formatError, validateName, modifyJSON } from "./helpers";
import { IAppCtx, ICtx } from "~types";
import inquirer from "inquirer";
import chalk from "chalk";
import { installPkgs } from "~helpers/installer";
import SolidHelper from "~helpers/solid";
import { prismaEnv } from "~constants";

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
    await fs.copy(
      path.join(templateDir, "client"),
      path.join(appContext.userDir)
    );
    await fs.rename(
      path.join(appContext.userDir, "_gitignore"),
      path.join(appContext.userDir, ".gitignore")
    );
    if (appContext.initServer) {
      const trpcTemplateDir = path.join(templateDir, "server");
      const trpcFiles = await fs.readdir(trpcTemplateDir);
      await Promise.all(
        trpcFiles.map(
          async (file) =>
            await fs.copy(
              path.join(trpcTemplateDir, file),
              path.join(appContext.userDir, file)
            )
        )
      );
    }
    spinner.succeed(`Copied template files to ${appContext.userDir}`);
  } catch (e) {
    spinner.fail(`Couldn't copy template files: ${formatError(e)}`);
    process.exit(1);
  }
}
export async function modifyProject(
  ctx: ICtx,
  scripts: Record<string, string>
) {
  const spinner = ora("Modifying project").start();
  try {
    await SolidHelper(ctx);
    if (ctx.initServer) {
      await Promise.all([
        fs.writeFile(path.join(ctx.userDir, ".env"), prismaEnv),
        fs.copy(
          path.join(__dirname, "../..", "template", "config"),
          path.join(ctx.userDir)
        ),
      ]);
    }
    const len = Object.keys(scripts).length;
    if (len || ctx.initServer) {
      await modifyJSON(ctx.userDir, (json) => {
        json.name = ctx.appName;
        if (ctx.initServer) {
          json.prisna = { scheme: "../prisma/schema.prisma" };
          json.scripts.vdev = "vercel dev --local-config ./vercel-dev.json";
          const devCmd = json.scripts.dev;
          delete json.scripts.dev;
          json.scripts.client = devCmd;
        }
        if (len) {
          json.scripts = { ...json.scripts, ...scripts };
        }
        return json;
      });
    }
    spinner.succeed("Modified project");
  } catch (e) {
    spinner.fail(`Couldn't modify project: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installDeps(userDir: string) {
  console.log();
  const spinner = ora("Installing template dependencies").start();
  try {
    await execa("npm install", { cwd: userDir });
    spinner.succeed(`Installed template dependencies`);
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
  if (Object.keys(deps).length) {
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
  let commands = [
    async () =>
      await execa("npx prisma generate", {
        cwd: ctx.userDir,
      }),
  ];
  const len = commands.length;
  if (len) {
    const end = len > 1 ? "s" : "";
    const spinner = ora(`Running ${len} Queued Command${end}`).start();
    try {
      for (const command of commands) await command();
      spinner.succeed(`Ran ${len} Queued Command${end}`);
    } catch (e) {
      spinner.fail(`Couldn't Run Queued Commands: ${formatError(e)}`);
      process.exit(1);
    }
  }
}

export function finished(ctx: ICtx) {
  console.log(`\n\t${chalk.green(`cd ${ctx.appName}`)}`);
  ctx.initServer && console.log(chalk.yellow("\tnpm run push"));
  console.log(
    chalk.bold(chalk.blue(`\tnpm run ${ctx.initServer ? "vdev" : "dev"}`))
  );
  console.log();
  process.exit(0);
}
