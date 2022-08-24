import ora from "ora";
import { IInstaller, IPkg, IPkgInfo } from "~types/Installer";
import { execFiles, modifyJSON } from "~utils/files";
import { execa, formatError } from "~utils/helpers";
import { IEnv } from "~types/Env";
import { IKeyValue } from "~types/Static";

export default async (
  userDir: string,
  pkgs: string[]
): Promise<[IEnv[][], Array<() => Promise<void>>]> => {
  let env: IEnv[][] = [];
  let scripts: IKeyValue = {};
  const commands: Array<() => Promise<void>> = [];

  const resp = await Promise.all(
    pkgs.map((pkg) =>
      import(`../installers/${pkg}/index`).then(
        (installer: { default: IInstaller }) => installer.default(userDir, pkgs)
      )
    )
  );

  const DEFAULT_ENV: IEnv = {
    type: "string().transform((port) => parseInt(port) ?? 4000)",
    key: "PORT",
    defaulValue: 4000,
  };
  env.push([DEFAULT_ENV]);

  if (resp.length) {
    const spinner = ora("Initializing installers").start();
    try {
      let deps: IDeps = { server: [[], []], client: [[], []] };
      await Promise.all(
        resp.map(async (cfg) => {
          if (cfg.env) {
            env.push(cfg.env);
          }
          if (cfg.scripts) {
            scripts = { ...scripts, ...cfg.scripts };
          }
          if (cfg.pkgs) {
            let newDeps = await sortToDevAndNormal(cfg.pkgs);
            deps = mergeDeps(deps, newDeps);
          }
          if (cfg.files.length) {
            await execFiles(cfg.files, pkgs);
          }
          if (cfg.onFinish) {
            commands.push(cfg.onFinish);
          }
        })
      );
      for (const key in deps)
        await installPkgs(
          userDir,
          key as IPkgInfo["type"],
          deps[key as IPkgInfo["type"]]
        );
      await modifyJSON(userDir, (json) => {
        json.scripts = { ...json.scripts, ...scripts };
        return json;
      });
      spinner.succeed(`Initialized ${resp.length} installers`);
    } catch (e) {
      spinner.fail(`Couldn't initialize installers: ${formatError(e)}`);
      process.exit(1);
    }
  }
  return [env, commands];
};

type IDeps = { server: [string[], string[]]; client: [string[], string[]] };
const sortToDevAndNormal = (pkgs: IPkg): Promise<IDeps> =>
  new Promise((resolve) => {
    const data = Object.entries(pkgs).reduce(
      (current, [name, value]) => {
        let newName = value.customVersion
          ? `${name}@${value.customVersion}`
          : name;
        const [normal, devs] = current[value.type];
        let newValues = value.devMode
          ? [normal, [...devs, newName]]
          : [[...normal, newName], devs];
        return {
          ...current,
          [value.type]: newValues,
        };
      },
      {
        server: [[], []] as [string[], string[]],
        client: [[], []] as [string[], string[]],
      }
    );
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
      cwd: `${userDir}/packages/${type}`,
    });
  }
  if (devs.length) {
    await execa(`npm install ${devs.join(" ")}`, {
      cwd: `${userDir}/packages/${type}`,
    });
  }
};

const mergeDeps = (current: IDeps, next: IDeps): IDeps => {
  return {
    server: [
      [...current.server[0], ...next.server[0]],
      [...current.server[1], ...next.server[1]],
    ],
    client: [
      [...current.client[0], ...next.client[0]],
      [...current.client[1], ...next.client[1]],
    ],
  };
};
