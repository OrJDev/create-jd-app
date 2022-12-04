#!/usr/bin/env node

import * as project from "./utils/project";
import { formatError } from "./utils/helpers";
import chalk from "chalk";
import runInstallers, { getCtxWithInstallers } from "./helpers/installer";

async function main() {
  console.log(
    chalk.yellow(
      "Warning: This is the vanila create jd app, this will create a SolidJS app and not SolidStart"
    )
  );
  const args = process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => arg.slice(2).toLowerCase());
  const appCtx = await project.initApp(args);
  await project.copyTemplate(appCtx);
  const ctx = await getCtxWithInstallers(appCtx, args);
  const [scripts, deps] = await runInstallers(ctx);
  await project.modifyProject(ctx, deps, scripts);
  await project.installDeps(ctx);
  project.finished(ctx);
}

main().catch((e) => {
  console.log(
    `\n ${chalk.blue("Something went wrong:")} ${chalk.red(formatError(e))}\n`
  );
  process.exit(1);
});
