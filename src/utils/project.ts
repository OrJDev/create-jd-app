import path from "path";
import fs from "fs-extra";
import ora from "ora";
import runInstallers from "~helpers/installer";
import { existsOrCreate, overWriteFile, modifyJSON } from "./files";
import { execa, formatError, validateName } from "./helpers";
import { updateEnv, resolveEnv, IResolveEnvResp } from "~helpers/env";
import { IEnv } from "~types/Env";
import { INullAble } from "~types/Static";
import inquirer from "inquirer";
import chalk from "chalk";

export async function initApp(): Promise<[string, string]> {
  console.log();
  const appName = (
    await inquirer.prompt<{ appName: string }>({
      name: "appName",
      type: "input",
      message: "What is the name of the app?",
      validate: validateName,
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
  return [appName, userDir];
}

export async function copyTemplate(userDir: string, appName: string) {
  const spinner = ora("Copying template files").start();
  try {
    await fs.copy(path.join(__dirname, "../..", "template"), userDir);
    await Promise.all([
      fs.rename(
        path.join(userDir, "packages", "server", "_gitignore"),
        path.join(userDir, "packages", "server", ".gitignore")
      ),
      fs.rename(
        path.join(userDir, "packages", "client", "_gitignore"),
        path.join(userDir, "packages", "client", ".gitignore")
      ),
      fs.rename(
        path.join(userDir, "_gitignore"),
        path.join(userDir, ".gitignore")
      ),
      modifyJSON(userDir, (json) => {
        json.name = appName;
        return json;
      }),
    ]);
    spinner.succeed(`Copied template files to ${userDir}`);
  } catch (e) {
    spinner.fail(`Couldn't copy template files: ${formatError(e)}`);
    process.exit(1);
  }
}

export async function installDeps(userDir: string) {
  console.log();
  const spinner = ora("Installing template dependencies").start();
  try {
    await execa(`npm install`, { cwd: userDir });
    spinner.succeed(`Installed template dependencies`);
  } catch (e) {
    spinner.fail(`Couldn't Install template dependencies: ${formatError(e)}`);
  }
}

export async function execInstallers(
  userDir: string,
  pkgs: string[]
): Promise<
  ReturnType<typeof runInstallers> extends Promise<infer U>
    ? U extends Array<infer _A>
      ? U
      : never
    : never
> {
  const data = await runInstallers(userDir, pkgs);
  return data;
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
      await updateEnv(`${userDir}/packages/server`, envVariables);
      spinner.succeed("Updated environment variables");
    } catch (e) {
      spinner.fail(`Couldn't update environment variables: ${formatError(e)}`);
      process.exit(1);
    }
  }
}

export async function runCommands(commands: Array<() => Promise<void>>) {
  const len = commands.length;
  const end = len > 1 ? "s" : "";
  if (
    (
      await inquirer.prompt<{ run: boolean }>({
        name: "run",
        type: "confirm",
        message: `Do you want to run ${len} queued command${end}?`,
      })
    ).run
  ) {
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

export function finished(appName: string, pkgs: string[]) {
  console.log(`\n\t${chalk.green(`cd ${appName}`)}`);
  pkgs.includes("prisma") &&
    console.log(
      `\t${chalk.yellow(`cd packages/server && npx prisma db push`)}`
    );
  console.log(`\t${chalk.bold(chalk.blue("npm run start"))}`);
  console.log();
  process.exit(0);
}
