export type IAppCtx = {
  framework: string;
  userDir: string;
  appName: string;
};

export type ICtx = IAppCtx & { installers: string[] };
