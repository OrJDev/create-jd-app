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
  return { appName, userDir, framework };
}

export async function copyTemplate(appContext: IAppCtx) {
  const spinner = ora("Copying template files").start();
  try {
    const APPS_DIR = path.join(appContext.userDir, "apps");
    await fs.copy(
      path.join(__dirname, "../..", "template", "main"),
      appContext.userDir
    );
    await fs.copy(
      path.join(__dirname, "../..", "template", "client", appContext.framework),
      path.join(APPS_DIR, "client")
    );
    await Promise.all([
      fs.rename(
        path.join(APPS_DIR, "server", "_gitignore"),
        path.join(APPS_DIR, "server", ".gitignore")
      ),
      fs.rename(
        path.join(APPS_DIR, "client", "_gitignore"),
        path.join(APPS_DIR, "client", ".gitignore")
      ),
      fs.rename(
        path.join(appContext.userDir, "_gitignore"),
        path.join(appContext.userDir, ".gitignore")
      ),
      modifyJSON(appContext.userDir, (json) => {
        json.name = appContext.appName;
        return json;
      }),
    ]);
    spinner.succeed(`Copied template files to ${appContext.userDir}`);
  } catch (e) {
    spinner.fail(`Couldn't copy template files: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installDeps(userDir: string) {
  const spinner = ora("Installing template dependencies").start();
  try {
    await execa(`npm install`, { cwd: userDir });
    spinner.succeed(`Installed template dependencies`);
  } catch (e) {
    spinner.fail(`Couldn't Install template dependencies: ${formatError(e)}`);
  }
}
export async function modifyProject(ctx: ICtx, plugins: string[]) {
  if (ctx.installers.length) {
    const spinner = ora("Modifying project").start();
    try {
      await (await import(`../helpers/${ctx.framework}`)).default(ctx, plugins);
    } catch {}
    spinner.succeed("Modified project");
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
      await updateEnv(`${userDir}/apps/server`, envVariables);
      spinner.succeed("Updated environment variables");
    } catch (e) {
      spinner.fail(`Couldn't update environment variables: ${formatError(e)}`);
      process.exit(1);
    }
  }
}

export async function runCommands(commands: Array<() => Promise<void>>) {
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

const APPS_ARR = ["client", "server"];

export function finished(ctx: ICtx) {
  console.log(`\n\t${chalk.green(`cd ${ctx.appName}`)}`);
  ctx.installers.includes("Static/Prisma") &&
    console.log(`\t${chalk.yellow(`cd apps/server && npx prisma db push`)}\n`);

  for (const [index, name] of APPS_ARR.entries()) {
    console.log(`\t${chalk.bold(chalk.cyan(`npm run start:${name}`))}`);
    console.log(`     ${chalk.gray("#or")}`);
    console.log(
      `\t${chalk.bold(chalk.blueBright(`cd apps/${name} && npm start`))}`
    );
    index !== APPS_ARR.length - 1 && console.log();
  }
  console.log();
  process.exit(0);
}
