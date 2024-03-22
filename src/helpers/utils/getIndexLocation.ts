import type { ICtx, IUtil } from "~types";

const getIndexLocation: IUtil = (ctx) => {
  const usingPRPC = ctx.installers.includes("pRPC");
  const usingTw = ctx.installers.includes("TailwindCSS");
  const usingAuth = ctx.installers.includes("AuthJS");
  return createFileHelper(usingPRPC, usingTw, usingAuth, ctx);
};

export default getIndexLocation;

function createFileHelper(
  usingPRPC: boolean,
  usingTw: boolean,
  usingAuth: boolean,
  ctx: ICtx
) {
  const fileName = usingPRPC ? `prpc` : "";
  let indexFile = "";
  if (usingPRPC && usingTw && usingAuth) {
    indexFile = `with-auth-${fileName}-tw.tsx`;
  } else if (usingPRPC && !usingTw && usingAuth) {
    indexFile = `with-auth-${fileName}.tsx`;
  } else if (usingPRPC && usingTw) {
    indexFile = `with-${fileName}-tw.tsx`;
  } else if (usingPRPC && !usingTw) {
    indexFile = `with-${fileName}.tsx`;
  } else if (usingAuth && usingTw) {
    indexFile = "with-auth-tw.tsx";
  } else if (!usingPRPC && usingTw) {
    indexFile = "with-tw.tsx";
  } else if (usingAuth) {
    indexFile = "with-auth.tsx";
  }

  return indexFile ? `${ctx.templateDir}/index/${indexFile}` : ``;
}
