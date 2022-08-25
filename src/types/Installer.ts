import { IConfig } from "./Config";
import { IKeyValue } from "./Static";

export type IInstaller = (
  userDir: string,
  usingInstallers: string[]
) => Promise<IConfig>;

export type IPkgInfo = {
  customVersion?: string;
  devMode?: boolean;
  type: "client" | "server";
};
export type IPkg = IKeyValue<IPkgInfo>;

export type IFile = {
  to: string;
  type?: "copy" | "exec" | "delete";
  path?: string;
};

export type IHelper = (
  userDir: string,
  appName: string,
  installers: string[]
) => Promise<void>;

export type IUtil = (installers: string[]) => void;
