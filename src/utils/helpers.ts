import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import type { ICtx } from "~types";
import type { IExpectedPackages } from "~helpers/packages";

export const execa = promisify(exec);

const DEFAULT_ERR = "Something Went Wrong";

const errCheck = (message?: string): string =>
  message?.length ? message : DEFAULT_ERR;

export const formatError = (err: unknown): string => {
  if (typeof err === "string") return errCheck(err);
  else if (typeof err === "object") {
    if (Array.isArray(err)) {
      if (err.length) {
        return formatError(err.shift());
      } else return errCheck();
    } else if (err && "message" in err) {
      return formatError(err.message);
    } else if (err && "stack" in err) {
      return formatError(err.stack);
    }
  }
  return errCheck();
};

export const validateName = (name: string) => {
  if (!name.length) return false;
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?([a-z0-9-~][a-z0-9-._~]*)$|(^\.$)/.test(name)
    ? true
    : "This is not a valid name";
};

export async function modifyJSON(
  userDir: string,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  cb: (json: any) => Promise<any>
) {
  const json = await fs.readJSON(path.join(userDir, "package.json"));
  const newJson = await cb({ ...json });
  await fs.writeFile(
    path.join(userDir, "package.json"),
    JSON.stringify(newJson, null, 2)
  );
  return newJson;
}

export const getUserPackageManager = () => {
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent?.startsWith("yarn")) return "yarn";
  if (userAgent?.startsWith("pnpm")) return "pnpm";
  return "npm";
};

export const solidUpdateJSON = async (
  ctx: ICtx,
  scripts: Record<string, string>,
  pkgs: IExpectedPackages
) => {
  const [normalDeps, devModeDeps] = pkgs;
  await modifyJSON(ctx.userDir, (json) => {
    json.name = ctx.appName;
    json.scripts = { ...json.scripts, ...scripts };
    json.dependencies = { ...json.dependencies, ...normalDeps };
    json.devDependencies = { ...json.devDependencies, ...devModeDeps };
    return json;
  });
};
