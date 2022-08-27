import { IConfig } from "./Config";
import { ICtx } from "./Context";
import { IKeyValue, IPromiseOrType } from "./Static";

export type IInstaller = (ctx: ICtx) => IPromiseOrType<IConfig>;

export type IPkgInfo = {
  customVersion?: string;
  devMode?: boolean;
  type: string;
};
export type IPkg = IKeyValue<IPkgInfo>;

export type IFile = {
  to: string;
  type?: "copy" | "exec" | "delete";
  path?: string;
};

export type IHelper = (ctx: ICtx, plugins: string[]) => IPromiseOrType<void>;

export type IUtil = (installers: string[]) => string;
