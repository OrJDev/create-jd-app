import type { ICtx } from "~types";

const getAppLocation = (ctx: ICtx) => {
  const usingPRPC = ctx.installers.includes("pRPC");
  const usingAuth = ctx.installers.includes("AuthJS");

  if (usingPRPC && usingAuth)
    return `${ctx.templateDir}/app/with-auth-prpc.tsx`;
  else if (usingPRPC) return `${ctx.templateDir}/app/with-prpc.tsx`;
  return ``;
};

export default getAppLocation;
