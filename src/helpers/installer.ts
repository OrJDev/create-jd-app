import ora from "ora";
import path from "path";
import fs from "fs-extra";
import inquirer from "inquirer";
import {
  IInstaller,
  IPkg,
  ICtx,
  IEnv,
  IAppCtx,
  ITRPCVersion,
  IConfig,
} from "~types";
import { execFiles } from "~utils/files";
import { execa, formatError, getUserPackageManager } from "~utils/helpers";
import { packages, vercelEnv } from "~vercel";
import chalk from "chalk";

export default async (
  ctx: ICtx
): Promise<
  [Record<string, string>, [string[], string[]], IEnv[], string[]]
> => {
  let normalDeps: string[] = [];
  let devModeDeps: string[] = [];
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
    const vercelPkgs = sortToDevAndNormal(packages);
    normalDeps = [...normalDeps, ...vercelPkgs[0]];
    devModeDeps = [...devModeDeps, ...vercelPkgs[1]];
    env = [...env, ...vercelEnv];
  }
  let commands: string[] = [];

  const execInstaller = async (cfg: IConfig) => {
    if (cfg.pkgs) {
      if (Array.isArray(cfg.pkgs)) {
        normalDeps = [...normalDeps, ...cfg.pkgs];
      } else {
        let newDeps = sortToDevAndNormal(cfg.pkgs);
        normalDeps = [...normalDeps, ...newDeps[0]];
        devModeDeps = [...devModeDeps, ...newDeps[1]];
      }
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
  const resp = (
    await Promise.all(
      ctx.installers.map((pkg) =>
        import(`../installers/${pkg}/index`).then(
          (installer: { default: IInstaller }) =>
            typeof installer.default === "function"
              ? installer.default(ctx)
              : installer.default
        )
      )
    )
  ).sort((a, b) => {
    if (a.after === b.name) return 1;
    if (b.after === a.name) return -1;
    return 0;
  });

  console.log();
  const spinner = ora("Initializing installers").start();

  if (resp.length) {
    try {
      // await Promise.all(
      //   resp.map(async (cfg) => {
      //     await execInstaller(cfg);
      //   })
      // );
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

const sortToDevAndNormal = (pkgs: IPkg): [string[], string[]] => {
  const normal: string[] = [];
  const devs: string[] = [];
  Object.entries(pkgs).forEach(([key, value]) => {
    const newKey = value.customVersion ? `${key}@${value.customVersion}` : key;
    if (value.devMode) {
      devs.push(newKey);
    } else {
      normal.push(newKey);
    }
  });
  return [normal, devs];
};

export const installPkgs = async (
  pkgManager: ReturnType<typeof getUserPackageManager>,
  cwd: string,
  deps: [string[], string[]]
) => {
  const [normal, devs] = deps;
  const cmd = pkgManager === "yarn" ? "add" : "install";
  if (normal.length) {
    await execa(`${pkgManager} ${cmd} ${normal.join(" ")}`, {
      cwd,
    });
  }
  if (devs.length) {
    await execa(`${pkgManager} ${cmd} ${devs.join(" ")} -D`, {
      cwd,
    });
  }
};

export async function getCtxWithInstallers(ctx: IAppCtx): Promise<ICtx> {
  let installers: string[] = [];
  let pkgs: string[] = [];
  try {
    installers = await fs.readdir(path.join(__dirname, "../installers"));
  } catch {}
  if (installers.length) {
    if (installers.length === 1) {
      const inst = <string>installers.shift();
      if (
        (
          await inquirer.prompt<{ install: boolean }>({
            name: "install",
            type: "confirm",
            message: `Do you want to use ${inst}?`,
          })
        ).install
      ) {
        pkgs = [inst];
      }
    } else {
      pkgs = (
        await inquirer.prompt<{ pkgs: string[] }>({
          name: "pkgs",
          type: "checkbox",
          message: "What should we use for this app?",
          choices: installers,
          validate: (ans) => {
            if (ans.includes("Upstash Ratelimit") && !ans.includes("tRPC")) {
              return "You need to use tRPC to use Upstash Ratelimit";
            }
            return true;
          },
        })
      ).pkgs;
    }
  }
  if (pkgs.includes("Prisma") && !ctx.vercel) {
    console.log(
      `${chalk.red("Make sure to update the")} ${chalk.blue(
        "postbuild"
      )} ${chalk.red("script")}`
    );
  }
  let trpcVersion: ITRPCVersion | undefined;
  if (pkgs.includes("tRPC")) {
    trpcVersion = (
      await inquirer.prompt<{
        trpcVersion: ITRPCVersion;
      }>({
        name: "trpcVersion",
        message: "Please select a version of tRPC",
        type: "list",
        choices: ["V10", "V9"],
      })
    ).trpcVersion;
  }
  return {
    ...ctx,
    installers: pkgs,
    trpcVersion,
  };
}
