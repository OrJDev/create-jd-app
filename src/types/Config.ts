import { IEnv } from "./Env";
import { IPkg, IFile } from "./Installer";
import { IKeyValue } from "./Static";

export type IConfig = {
  files: Array<IFile>;
  pkgs?: IPkg;
  scripts?: IKeyValue;
  env?: IEnv[];
  plugins?: string[];
  onFinish?: () => Promise<void>;
};
