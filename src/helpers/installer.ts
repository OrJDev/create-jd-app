import ora from "ora";
import { IInstaller, IPkg, IPkgInfo } from "~types/Installer";
import { execFiles, modifyJSON } from "~utils/files";
import { execa, formatError } from "~utils/helpers";
import { IEnv } from "~types/Env";
import { ICtx } from "~types/Context";

export default async (ctx: ICtx): Promise<[IEnv[][], string[]]> => {
  let env: IEnv[][] = [];
  let plugins: string[] = [];

  const resp = await Promise.all(
    ctx.installers.map((pkg) =>
      import(`../installers/${ctx.framework}/${pkg}/index`).then(
        (installer: { default: IInstaller }) => installer.default(ctx)
      )
    )
  );

  env.push([
    {
      type: "string().transform((port) => parseInt(port) ?? 4000)",
      key: "PORT",
      defaulValue: 4000,
    },
    {
      key: "NODE_ENV",
      type: 'enum(["development", "test", "production"]).default("development")',
      ignore: true,
    },
  ]);

  if (resp.length) {
    console.log();
    const spinner = ora("Initializing installers").start();
    try {
      let deps: IDeps = {};
      await Promise.all(
        resp.map(async (cfg) => {
          if (cfg.env) {
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
            await execFiles(cfg.files, ctx.installers);
          }
        })
      );
      for (const key in deps)
        await installPkgs(ctx.userDir, key, deps[key as keyof typeof deps]);
      spinner.succeed(`Initialized ${resp.length} installers`);
    } catch (e) {
      spinner.fail(`Couldn't initialize installers: ${formatError(e)}`);
      process.exit(1);
    }
  }
  return [env, plugins];
};

type IDeps = { [key: string]: [string[], string[]] };
const sortToDevAndNormal = (pkgs: IPkg): Promise<IDeps> =>
  new Promise((resolve) => {
    const data = Object.entries(pkgs).reduce((current, [name, value]) => {
      let newName = value.customVersion
        ? `${name}@${value.customVersion}`
        : name;
      const [normal, devs] = Object.hasOwnProperty.call(current, value.type)
        ? current[value.type as keyof typeof current]
        : [[], []];
      return {
        ...current,
        [value.type]: (value.devMode
          ? [normal, [...devs, newName]]
          : [[...normal, newName], devs]) as [string[], string[]],
      };
    }, {} as IDeps);
    return resolve(data);
  });

const installPkgs = async (
  userDir: string,
  type: IPkgInfo["type"],
  deps: IDeps["client"]
) => {
  const [normal, devs] = deps;
  if (normal.length) {
    await execa(`npm install ${normal.join(" ")}`, {
      cwd: `${userDir}/${type}`,
    });
  }
  if (devs.length) {
    await execa(`npm install ${devs.join(" ")}`, {
      cwd: `${userDir}/${type}`,
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
