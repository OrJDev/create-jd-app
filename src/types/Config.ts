import { IPkg, IFile } from "./Installer";

export type IConfig = {
  files: Array<IFile>;
  pkgs?: IPkg;
  env?: IEnv[];
  plugins?: string[];
};

export type IEnv = {
  type: string;
  key: string;
  defaulValue?: any;
  ignore?: boolean;
};
