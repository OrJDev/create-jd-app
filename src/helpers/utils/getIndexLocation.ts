import type { ICtx, IUtil } from "~types";

const getIndexLocation: IUtil = (ctx) => {
  const usingTRPC = ctx.installers.includes("tRPC");
  const usingTw = ctx.installers.includes("TailwindCSS");
  const usingAuth = ctx.installers.includes("AuthJS");
  return createFileHelper(
    usingTRPC,
    usingTw,
    usingAuth,
    usingTRPC ? "tRPC" : null,
    ctx
  );
};

export default getIndexLocation;

function createFileHelper(
  usingRPC: boolean,
  usingTw: boolean,
  usingAuth: boolean,
  rpc: null | "tRPC",
  ctx: ICtx
) {
  const fileName = rpc ? `${rpc.toLowerCase()}` : "";
  let indexFile = "";
  if (usingRPC && usingTw && usingAuth) {
    indexFile = `with-auth-${fileName}-tw.tsx`;
  } else if (usingRPC && !usingTw && usingAuth) {
    indexFile = `with-auth-${fileName}.tsx`;
  } else if (usingRPC && usingTw) {
    indexFile = `with-${fileName}-tw.tsx`;
  } else if (usingRPC && !usingTw) {
    indexFile = `with-${fileName}.tsx`;
  } else if (usingAuth && usingTw) {
    indexFile = "with-auth-tw.tsx";
  } else if (!usingRPC && usingTw) {
    indexFile = "with-tw.tsx";
  } else if (usingAuth) {
    indexFile = "with-auth.tsx";
  }

  return indexFile ? `${ctx.templateDir}/index/${indexFile}` : ``;
}
