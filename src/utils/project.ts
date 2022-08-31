import path from "path";
import fs from "fs-extra";
import ora from "ora";
import { existsOrCreate, overWriteFile, modifyJSON } from "./files";
import { execa, formatError, validateName } from "./helpers";
import { updateEnv, resolveEnv, IResolveEnvResp } from "~helpers/env";
import { IEnv } from "~types/Env";
import { INullAble } from "~types/Static";
import inquirer from "inquirer";
import chalk from "chalk";
import { IAppCtx, ICtx } from "~types/Context";
import { IDeps, installPkgs } from "~helpers/installer";

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
  const framework = (
    await inquirer.prompt<{ framework: string }>({
      type: "list",
      name: "framework",
      message: "What framework do you want to use?",
      choices: await fs.readdir(path.join(__dirname, "../../template/client")),
    })
  ).framework;
  const initServer = (
    await inquirer.prompt<{ initServer: boolean }>({
      name: "initServer",
      type: "confirm",
      message: `Do you want to scaffold a server?`,
    })
  ).initServer;
  return {
    appName,
    userDir,
    framework,
    initServer,
    // if we don't want a server the main dir becomes the client dir, therfore we keep it empty $USERDIR/""
    clientDir: initServer ? "/apps/client" : "",
  };
}

export async function copyTemplate(appContext: IAppCtx) {
  console.log();
  const spinner = ora("Copying template files").start();
  const templateDir = path.join(__dirname, "../..", "template");
  try {
    if (appContext.initServer) {
      await fs.copy(path.join(templateDir, "main"), appContext.userDir);
    }
    await fs.copy(
      path.join(templateDir, "client", appContext.framework),
      path.join(appContext.userDir, appContext.clientDir)
    );
    await modifyJSON(appContext.userDir, (json) => {
      json.name = appContext.appName;
      return json;
    });

    spinner.succeed(`Copied template files to ${appContext.userDir}`);
  } catch (e) {
    spinner.fail(`Couldn't copy template files: ${formatError(e)}`);
    process.exit(1);
  }
}
export async function modifyProject(ctx: ICtx, plugins: string[]) {
  if (ctx.installers.length) {
    const spinner = ora("Modifying project").start();
    try {
      await (await import(`../helpers/${ctx.framework}`)).default(ctx, plugins);
      spinner.succeed("Modified project");
    } catch (e) {
      spinner.fail(`Couldn't modify project: ${formatError(e)}`);
      process.exit(1);
    }
  }
}

export async function installDeps(userDir: string, len: number) {
  len && console.log();
  const spinner = ora("Installing template dependencies").start();
  try {
    await execa("npm install", { cwd: userDir });
    spinner.succeed(`Installed template dependencies`);
  } catch (e) {
    spinner.fail(`Couldn't install template dependencies: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installAddonsDependencies(ctx: ICtx, deps: IDeps) {
  if (Object.keys(deps).length) {
    const spinner = ora("Installing addons dependencies").start();
    try {
      for (const key in deps)
        await installPkgs(ctx.userDir, key, deps[key as keyof typeof deps]);
      spinner.succeed("Installed addons dependencies");
    } catch (e) {
      spinner.fail(`Couldn't install addons dependencies: ${formatError(e)}`);
      process.exit(1);
    }
  }
}

export async function modifyEnv(userDir: string, env: IEnv[][]) {
  let envVariables: INullAble<IResolveEnvResp> = null;
  try {
    envVariables = await resolveEnv(env);
  } catch {}
  if (envVariables && envVariables.newEnv.length) {
    console.log();
    const spinner = ora("Updating environment variables").start();
    try {
      await updateEnv(`${userDir}/packages/env`, envVariables);
      spinner.succeed("Updated environment variables");
    } catch (e) {
      spinner.fail(`Couldn't update environment variables: ${formatError(e)}`);
      process.exit(1);
    }
  }
}

export async function runCommands(ctx: IAppCtx) {
  let commands = [
    async () =>
      await execa("npx prisma generate", {
        cwd: `${ctx.userDir}/packages/db`,
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
  if (ctx.initServer) {
    console.log();
    for (const [idx, app] of ["client", "server"].entries()) {
      console.log(
        `\t${chalk.bold(
          chalk[idx === 0 ? "blue" : "yellow"](`npm run start:${app}`)
        )}`
      );
    }
  } else console.log(`\t${chalk.bold(chalk.blue(`npm start`))}`);
  console.log();
  process.exit(0);
}
