import ora from "ora";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import { IInstaller, ICtx, IEnv, IAppCtx, IConfig } from "~types";
import { execFiles } from "~utils/files";
import { formatError } from "~utils/helpers";
import { vercelPackages, vercelEnv } from "~vercel";
import chalk from "chalk";
import { IExpectedPackages } from "./packages";
import { TInstallers } from "~types";

export default async (
  ctx: ICtx
): Promise<[Record<string, string>, IExpectedPackages, IEnv[], string[]]> => {
  let normalDeps: IExpectedPackages[0] = {};
  let devModeDeps: IExpectedPackages[1] = {};
  let scripts: Record<string, string> = {};
  let env: IEnv[] = [
    {
      key: "NODE_ENV",
      type: "enum(['development', 'production', 'test']).default('development')",
      ignore: true,
      kind: "server",
    },
    {
      key: "MODE",
      type: "enum(['development', 'production', 'test']).default('development')",
      ignore: true,
      kind: "client",
    },
  ];
  if (ctx.vercel) {
    normalDeps = { ...normalDeps, ...vercelPackages[0] };
    devModeDeps = { ...devModeDeps, ...vercelPackages[1] };
    env = [...env, ...vercelEnv];
  }
  let commands: string[] = [];

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
    if (cfg.commands) {
      if (Array.isArray(cfg.commands)) {
        commands = [...cfg.commands, ...commands];
      } else {
        commands.unshift(cfg.commands);
      }
    }
    if (cfg.env?.length) {
      env = [...env, ...cfg.env];
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

  console.log();
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
  return [scripts, [normalDeps, devModeDeps], env, commands];
};

export async function getCtxWithInstallers(
  ctx: IAppCtx,
  curr: string[]
): Promise<ICtx> {
  let installers: string[] = [];
  let pkgs: TInstallers[] = [];
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
      const opts = [["TailwindCSS", "UnoCSS"]];
      for (const opt of opts) {
        for (const op of opt) {
          if (validInstallers.includes(op)) {
            optInstallers = optInstallers.filter((pkg) => !opt.includes(pkg));
          }
        }
      }
      const newPkgs = (
        await inquirer.prompt<{ pkgs: TInstallers[] }>({
          name: "pkgs",
          type: "checkbox",
          message: "What should we use for this app?",
          choices: optInstallers,
          validate: (ans: string[]) => {
            for (const opt of opts) {
              if (opt.every((o) => ans.includes(o))) {
                return `You can't use both ${opt
                  .map((o) => chalk.blue(o))
                  .join(" and ")} at the same time`;
              }
            }
            return true;
          },
        })
      ).pkgs;
      pkgs = [...validInstallers, ...newPkgs] as TInstallers[];
    } else {
      pkgs = validInstallers as TInstallers[];
    }
  }
  if (pkgs.includes("Prisma") && !ctx.vercel) {
    console.log(
      `${chalk.red("Make sure to update the")} ${chalk.blue(
        "postbuild"
      )} ${chalk.red("script")}`
    );
  }
  let ssr = true;
  if (pkgs.includes("tRPC")) {
    ssr = (
      await inquirer.prompt<{ ssr: boolean }>({
        name: "ssr",
        type: "confirm",
        message: "Do you want to use SSR with tRPC?",
        default: true,
      })
    ).ssr;
  }
  return {
    ...ctx,
    installers: pkgs,
    ssr,
  };
}
