import type { ICtx } from "~types";

const getAppLocation = (ctx: ICtx) => {
  const usingAuthPC = ctx.installers.includes("AuthPC");
  const usingAuth = ctx.installers.includes("AuthJS");

  if (usingAuthPC && usingAuth)
    return `${ctx.templateDir}/app/with-auth-authpc.tsx`;
  else if (usingAuthPC) return `${ctx.templateDir}/app/with-authpc.tsx`;
  return ``;
};

export default getAppLocation;
