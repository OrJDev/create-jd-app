export type IAppCtx = {
  userDir: string;
  appName: string;
  templateDir: string;
  vercel:boolean;
};

export type INullAble<T> = T | null;

export type IPromiseOrType<T> = Promise<T> | T;

export type ICtxWith<T> = IAppCtx & T;

export type ITRPCVersion = "V10" | "V9";

export type ICtx = ICtxWith<{
  installers: string[];
  trpcVersion?: ITRPCVersion;
}>;

export type IConfig = {
  files?: Array<IFile>;
  pkgs?: IPkg | string[];
  scripts?: Record<string, string>;
  env?: IEnv[];
  commands?: string | string[];
  reject?: string; // @TODO: make this actually useful
};

type IInstallerCB = (ctx: ICtx) => IPromiseOrType<IConfig>;
export type IInstaller = IConfig | IInstallerCB;

export type IPkgInfo = {
  customVersion?: string;
  devMode?: boolean;
};
export type IPkg = Record<string, IPkgInfo>;

export type IFile = {
  to: string;
  content?: string;
  type?: "copy" | "exec" | "delete" | "write" | "append";
  path?: string;
};

export type IEnv = {
  type: string;
  key: string;
  defaulValue?: any;
  ignore?: boolean;
};

export type IUtil = (ctx: ICtx) => string;
