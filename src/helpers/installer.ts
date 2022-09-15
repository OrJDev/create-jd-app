import ora from "ora";
import { IInstaller, IPkg, ICtx } from "~types";
import { execFiles } from "~utils/files";
import { execa, formatError } from "~utils/helpers";
import { trpcPkg, prismaScripts, prismaPkgs } from "~constants";

export default async (
  ctx: ICtx
): Promise<[Record<string, string>, [string[], string[]]]> => {
  let normalDeps: string[] = [];
  let devModeDeps: string[] = [];
  let scripts: Record<string, string> = {};

  if (ctx.initServer) {
    const newDeps = sortToDevAndNormal({ ...trpcPkg, ...prismaPkgs });
    normalDeps = [...normalDeps, ...newDeps[0]];
    devModeDeps = [...devModeDeps, ...newDeps[1]];
    scripts = {
      ...scripts,
      ...prismaScripts,
    };
  }

  const resp = await Promise.all(
    ctx.installers.map((pkg) =>
      import(`../installers/${pkg}/index`).then(
        (installer: { default: IInstaller }) => installer.default(ctx)
      )
    )
  );

  console.log();
  const spinner = ora("Initializing installers").start();

  if (resp.length) {
    try {
      await Promise.all(
        resp.map(async (cfg) => {
          if (cfg.pkgs) {
            let newDeps = sortToDevAndNormal(cfg.pkgs);
            normalDeps = [...normalDeps, ...newDeps[0]];
            devModeDeps = [...devModeDeps, ...newDeps[1]];
          }
          if (cfg.scripts) {
            scripts = { ...scripts, ...cfg.scripts };
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
  } else {
    spinner.succeed("No installers to initialize");
  }
  return [scripts, [normalDeps, devModeDeps]];
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

export const installPkgs = async (cwd: string, deps: [string[], string[]]) => {
  const [normal, devs] = deps;
  if (normal.length) {
    await execa(`npm install ${normal.join(" ")}`, {
      cwd,
    });
  }
  if (devs.length) {
    await execa(`npm install ${devs.join(" ")} -D`, {
      cwd,
    });
  }
};
