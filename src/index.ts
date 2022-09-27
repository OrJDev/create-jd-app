#!/usr/bin/env node

import * as project from "./utils/project";
import { formatError, getCtxWithInstallers } from "./utils/helpers";
import chalk from "chalk";
import runInstallers from "./helpers/installer";

async function main() {
  const appCtx = await project.initApp();
  await project.copyTemplate(appCtx);
  const ctx = await getCtxWithInstallers(appCtx);
  const [scripts, deps, env] = await runInstallers(ctx);
  await project.modifyProject(ctx, scripts, env);
  await project.installDeps(ctx.userDir);
  await project.installAddonsDependencies(ctx, deps);
  appCtx.initServer && (await project.runServerCommands(appCtx));
  project.finished(ctx);
}

main().catch((e) => {
  console.log(
    `\n ${chalk.blue("Something went wrong:")} ${chalk.red(formatError(e))}\n`
  );
  process.exit(1);
});
