export type IAppCtx = {
  framework: string;
  userDir: string;
  initServer: boolean;
  appName: string;
  clientDir: string;
};

export type ICtxWith<T> = IAppCtx & T;

export type ICtx = ICtxWith<{ installers: string[] }>;
