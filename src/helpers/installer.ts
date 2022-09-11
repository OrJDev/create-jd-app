import ora from "ora";
import { IInstaller, IPkg, IPkgInfo } from "~types/Installer";
import { execFiles } from "~utils/files";
import { execa, formatError } from "~utils/helpers";
import { ICtx } from "~types/Context";
import { updateNode } from "./node";
import path from "path";
import { defaultEnv, trpcDefaultPkg, trpcExpoPkg } from "~constants";
import { IEnv } from "~types/Config";

export default async (ctx: ICtx): Promise<[IEnv[][], string[], IDeps]> => {
  let env: IEnv[][] = [];
  let plugins: string[] = [];
  let deps: IDeps = {};
  if (ctx.initServer) {
    await updateNode(path.join(ctx.userDir, ctx.clientDir), {
      ...trpcDefaultPkg,
      ...(ctx.framework === "Expo" ? trpcExpoPkg : {}),
    });
  }
  const resp = await Promise.all(
    ctx.installers.map((pkg) =>
      import(`../installers/${ctx.framework}/${pkg}/index`).then(
        (installer: { default: IInstaller }) => installer.default(ctx)
      )
    )
  );
  if (ctx.initServer) {
    env.push(defaultEnv);
  }

  if (resp.length) {
    console.log();
    const spinner = ora("Initializing installers").start();
    try {
      await Promise.all(
        resp.map(async (cfg) => {
          if (cfg.env && ctx.initServer) {
            env.push(cfg.env);
          }
          if (cfg.pkgs) {
            let newDeps = await sortToDevAndNormal(cfg.pkgs);
            deps = mergeDeps(deps, newDeps);
          }
          if (cfg.plugins) {
            plugins = [...plugins, ...cfg.plugins];
          }
          if (cfg.files.length) {
            await execFiles(cfg.files, ctx);
          }
        })
      );
      spinner.succeed(`Initialized ${resp.length} installers`);
    } catch (e) {
      spinner.fail(`Couldn't initialize installers: ${formatError(e)}`);
      process.exit(1);
    }
  }
  return [env, plugins, deps];
};

export type IDeps = { [key: string]: [string[], string[]] };
const sortToDevAndNormal = (pkgs: IPkg): Promise<IDeps> =>
  new Promise((resolve) => {
    const data = Object.entries(pkgs).reduce((current, [name, value]) => {
      let newName = value.customVersion
        ? `${name}@${value.customVersion}`
        : name;
      const type = value.type === "" ? "_" : value.type;
      const [normal, devs] = Object.hasOwnProperty.call(current, type)
        ? current[type as keyof typeof current]
        : [[], []];
      if (value.devMode) {
        devs.push(newName);
      } else {
        normal.push(newName);
      }
      return {
        ...current,
        [type]: [normal, devs] as [string[], string[]],
      };
    }, {} as IDeps);
    return resolve(data);
  });

export const installPkgs = async (
  userDir: string,
  type: IPkgInfo["type"],
  deps: IDeps[keyof IDeps]
) => {
  const [normal, devs] = deps;
  const newType = type === "_" ? "" : type;
  if (normal.length) {
    await execa(`npm install ${normal.join(" ")}`, {
      cwd: `${userDir}${newType}`,
    });
  }
  if (devs.length) {
    await execa(`npm install ${devs.join(" ")} -D`, {
      cwd: `${userDir}${newType}`,
    });
  }
};

const mergeDeps = (deps: IDeps, newDeps: IDeps): IDeps => {
  for (const key in newDeps) {
    if (Object.hasOwnProperty.call(deps, key)) {
      const [normal, devs] = deps[key];
      const [newNormal, newDevs] = newDeps[key];
      deps[key] = [
        [...normal, ...newNormal],
        [...devs, ...newDevs],
      ];
    } else {
      deps[key] = newDeps[key];
    }
  }
  return deps;
};
