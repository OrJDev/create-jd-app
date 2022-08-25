#!/usr/bin/env node
import * as project from "./utils/project";
import { formatError, getInstallers } from "./utils/helpers";
import chalk from "chalk";

async function main() {
  const [appName, userDir] = await project.initApp();
  await project.copyTemplate(userDir, appName);
  const pkgs = await getInstallers();
  await project.modifyProject(appName, userDir, pkgs);
  await project.installDeps(userDir);
  const [env, commands] = await project.execInstallers(userDir, pkgs);
  await project.modifyEnv(userDir, env);
  await project.runCommands(commands);
  project.finished(appName, pkgs);
}

main().catch((e) => {
  console.log(
    `\n ${chalk.blue("Something went wrong:")} ${chalk.red(formatError(e))}\n`
  );
  process.exit(1);
});
