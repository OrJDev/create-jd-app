import { IEnv } from "./Env";
import { IPkg, IFile } from "./Installer";

export type IConfig = {
  files: Array<IFile>;
  pkgs?: IPkg;
  env?: IEnv[];
  plugins?: string[];
};
