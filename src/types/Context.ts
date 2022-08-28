export type IAppCtx = {
  framework: string;
  userDir: string;
  appName: string;
};

export type ICtxWith<T> = IAppCtx & T;

export type ICtx = ICtxWith<{ installers: string[] }>;
