export type IAppCtx = {
  userDir: string;
  initServer: boolean;
  appName: string;
};

export type ICtxWith<T> = IAppCtx & T;

export type ICtx = ICtxWith<{ installers: string[] }>;
