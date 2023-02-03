import type { IExpectedPackages } from "~helpers/packages";
import type { getUserPackageManager } from "~utils/helpers";

export type IAppCtx = {
  userDir: string;
  appName: string;
  templateDir: string;
  vercel?: IVercelOpt;
  pkgManager: ReturnType<typeof getUserPackageManager>;
  ssr: boolean;
};

export type IVercelOpt = "Cli" | "Dashboard";

export type INullAble<T> = T | null;

export type IPromiseOrType<T> = Promise<T> | T;

export type ICtxWith<T> = IAppCtx & T;

export type ICtx = ICtxWith<{
  installers: TInstallers[];
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pass?: any;
};

export type IEnv = {
  type: string;
  key: string;
  defaulValue?: string;
  ignore?: boolean;
  kind: "server" | "client";
};

export type IUtil<T = undefined> = (ctx: ICtx, passed?: T) => string;

export type TInstallers =
  | "AuthJS"
  | "Prisma"
  | "TailwindCSS"
  | "UnoCSS"
  | "Upstash Ratelimit"
  | "tRPC";
