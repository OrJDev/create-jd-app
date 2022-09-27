import ora from "ora";
import { IInstaller, IPkg, ICtx, IEnv } from "~types";
import { execFiles } from "~utils/files";
import { execa, formatError } from "~utils/helpers";
import { trpcPkg, prismaScripts, prismaPkgs, prismaEnv } from "~constants";

export default async (
  ctx: ICtx
): Promise<[Record<string, string>, [string[], string[]], IEnv[][]]> => {
  let normalDeps: string[] = [];
  let devModeDeps: string[] = [];
  let scripts: Record<string, string> = {};
  let env: IEnv[][] = [];

  if (ctx.initServer) {
    const newDeps = sortToDevAndNormal({ ...trpcPkg, ...prismaPkgs });
    normalDeps = [...normalDeps, ...newDeps[0]];
    devModeDeps = [...devModeDeps, ...newDeps[1]];
    scripts = {
      ...scripts,
      ...prismaScripts,
    };
    env.push(prismaEnv);
  }

  const resp = await Promise.all(
    ctx.installers.map((pkg) =>
      import(`../installers/${pkg.split(" ").join("-")}/index`).then(
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
          if (cfg.files?.length) {
            await execFiles(cfg.files, ctx);
          }
          if (cfg.env?.length) {
            env.push(cfg.env);
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
  return [scripts, [normalDeps, devModeDeps], env];
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
