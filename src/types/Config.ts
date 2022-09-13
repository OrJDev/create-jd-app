import { IPkg, IFile } from "./Installer";
import { IKeyValue } from "./Static";

export type IConfig = {
  files: Array<IFile>;
  pkgs?: IPkg;
  scripts?: IKeyValue<string>;
};
