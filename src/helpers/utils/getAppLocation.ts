import type { IUtil } from "~types";

const getAppLocation: IUtil = (ctx) => {
  const usingPRPC = ctx.installers.includes("pRPC");
  const usingAuth = ctx.installers.includes("AuthJS");

  if (usingPRPC && usingAuth)
    return `${ctx.templateDir}/app/with-auth-prpc.tsx`;
  else if (usingPRPC) return `${ctx.templateDir}/app/with-prpc.tsx`;
  return ``;
};

export default getAppLocation;
