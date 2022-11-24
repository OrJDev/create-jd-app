import { IExpectedPackages } from "~helpers/packages";
import { getUserPackageManager } from "~utils/helpers";

export type IAppCtx = {
  userDir: string;
  appName: string;
  templateDir: string;
  vercel: boolean;
  pkgManager: ReturnType<typeof getUserPackageManager>;
};

export type INullAble<T> = T | null;

export type IPromiseOrType<T> = Promise<T> | T;

export type ICtxWith<T> = IAppCtx & T;

export type ICtx = ICtxWith<{
  installers: string[];
}>;

export type IConfig = {
  files?: Array<IFile | undefined>;
  pkgs?: IExpectedPackages;
  scripts?: Record<string, string>;
  env?: IEnv[];
  commands?: string | string[];
};

type IInstallerCB = (ctx: ICtx) => IPromiseOrType<IConfig>;
export type IInstaller = IConfig | IInstallerCB;

export type IFile = {
  to: string;
  content?: string;
  type?: "copy" | "exec" | "delete" | "write" | "append";
  path?: string;
  sep?: boolean;
};

export type IEnv = {
  type: string;
  key: string;
  defaulValue?: any;
  ignore?: boolean;
  kind: "server" | "client";
};

export type IUtil = (ctx: ICtx) => string;
