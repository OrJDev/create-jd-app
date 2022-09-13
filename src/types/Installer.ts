import { IConfig } from "./Config";
import { ICtx } from "./Context";
import { IKeyValue, IPromiseOrType } from "./Static";

export type IInstaller = (ctx: ICtx) => IPromiseOrType<IConfig>;

export type IPkgInfo = {
  customVersion?: string;
  devMode?: boolean;
};
export type IPkg = IKeyValue<IPkgInfo>;

export type IFile = {
  to: string;
  content?: string;
  type?: "copy" | "exec" | "delete" | "write";
  path?: string;
};

export type IUtil = (ctx: ICtx) => string;
