#!/usr/bin/env node

import * as project from "./utils/project";
import { formatError } from "./utils/helpers";
import chalk from "chalk";
import runInstallers, { getCtxWithInstallers } from "./helpers/installer";

async function main() {
  const args = process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => arg.slice(2).toLowerCase());
  const appCtx = await project.initApp(args);
  await project.copyTemplate(appCtx);
  const ctx = await getCtxWithInstallers(appCtx, args);
  const [scripts, deps, env, commands] = await runInstallers(ctx);
  await project.modifyProject(ctx, deps, scripts, env);
  await project.installDeps(ctx);
  await project.runCommands(appCtx, commands);
  project.finished(ctx);
}

main().catch((e) => {
  console.log(
    `\n ${chalk.blue("Something went wrong:")} ${chalk.red(formatError(e))}\n`
  );
  process.exit(1);
});
