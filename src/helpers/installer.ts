import ora from "ora";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import { IInstaller, ICtx, IAppCtx, IConfig } from "~types";
import { execFiles } from "~utils/files";
import { formatError } from "~utils/helpers";
import chalk from "chalk";
import { IExpectedPackages } from "./packages";

export default async (
  ctx: ICtx
): Promise<[Record<string, string>, IExpectedPackages]> => {
  let normalDeps: IExpectedPackages[0] = {};
  let devModeDeps: IExpectedPackages[1] = {};
  let scripts: Record<string, string> = {};

  const execInstaller = async (cfg: IConfig) => {
    if (cfg.pkgs) {
      normalDeps = { ...normalDeps, ...cfg.pkgs[0] };
      devModeDeps = { ...devModeDeps, ...cfg.pkgs[1] };
    }
    if (cfg.scripts) {
      scripts = { ...scripts, ...cfg.scripts };
    }
    if (cfg.files?.length) {
      await execFiles(cfg.files, ctx);
    }
  };
  const resp = await Promise.all(
    ctx.installers.map((pkg) =>
      import(`../installers/${pkg}/index`).then(
        (installer: { default: IInstaller }) =>
          typeof installer.default === "function"
            ? installer.default(ctx)
            : installer.default
      )
    )
  );

  const spinner = ora("Initializing installers").start();

  if (resp.length) {
    try {
      for (const installer of resp) {
        await execInstaller(installer);
      }
      spinner.succeed(`Initialized ${resp.length} installers`);
    } catch (e) {
      spinner.fail(`Couldn't initialize installers: ${formatError(e)}`);
      process.exit(1);
    }
  } else {
    spinner.succeed("No installers to initialize");
  }
  return [scripts, [normalDeps, devModeDeps]];
};

export async function getCtxWithInstallers(
  ctx: IAppCtx,
  curr: string[]
): Promise<ICtx> {
  let installers: string[] = [];
  let pkgs: string[] = [];
  const skip = curr.includes("skip");
  try {
    installers = await fs.readdir(path.join(__dirname, "../installers"));
  } catch {}
  if (installers.length) {
    const validInstallers = curr.length
      ? installers.filter((i) => curr.some((c) => c === i.toLowerCase()))
      : [];
    if (validInstallers.length) {
      console.log(
        `${chalk.green("√")} Using installers: ${validInstallers
          .map((installer) => chalk.blue(installer))
          .join(", ")}`
      );
    }
    if (!skip) {
      let optInstallers = installers.filter(
        (pkg) => !validInstallers.includes(pkg)
      );
      const opts = ["TailwindCSS", "UnoCSS"];
      for (const opt of opts) {
        if (validInstallers.includes(opt)) {
          optInstallers = optInstallers.filter((pkg) => !opts.includes(pkg));
        }
      }
      console.log();
      const newPkgs = (
        await inquirer.prompt<{ pkgs: string[] }>({
          name: "pkgs",
          type: "checkbox",
          message: "What should we use for this app?",
          choices: optInstallers,
          validate: (ans: string[]) => {
            if (ans.includes("TailwindCSS") && ans.includes("UnoCSS")) {
              return "You can't use both TailwindCSS and UnoCSS at the same time";
            }
            return true;
          },
        })
      ).pkgs;
      pkgs = [...validInstallers, ...newPkgs];
    } else {
      pkgs = validInstallers;
    }
  }
  return {
    ...ctx,
    installers: pkgs,
  };
}
