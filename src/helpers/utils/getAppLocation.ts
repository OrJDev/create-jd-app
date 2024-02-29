import type { IUtil } from "~types";

const getAppLocation: IUtil = (ctx) => {
  const usingTRPC = ctx.installers.includes("tRPC");
  const usingAuth = ctx.installers.includes("AuthJS");

  if (usingTRPC && usingAuth)
    return `${ctx.templateDir}/app/with-auth-trpc.tsx`;
  else if (usingTRPC) return `${ctx.templateDir}/app/with-trpc.tsx`;
  return ``;
};

export default getAppLocation;
