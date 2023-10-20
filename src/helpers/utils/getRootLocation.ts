import type { IUtil } from "~types";

const getRootLocation: IUtil = (ctx) => {
  const usingPRPC = ctx.installers.includes("pRPC");
  const usingTRPC = ctx.installers.includes("tRPC");
  const usingAuth = ctx.installers.includes("AuthJS");
  if (usingPRPC && usingAuth)
    return `${ctx.templateDir}/root/with-auth-prpc.tsx`;
  else if (usingTRPC && usingAuth)
    return `${ctx.templateDir}/root/with-auth-trpc.tsx`;
  else if (usingTRPC) return `${ctx.templateDir}/root/with-trpc.tsx`;
  return ``;
};

export default getRootLocation;
