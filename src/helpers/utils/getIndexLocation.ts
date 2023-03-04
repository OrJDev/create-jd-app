import type { ICtx, IUtil } from "~types";

const getIndexLocation: IUtil = (ctx) => {
  const usingPRPC = ctx.installers.includes("pRPC");
  const usingTRPC = ctx.installers.includes("tRPC");
  const usingTw =
    ctx.installers.includes("TailwindCSS") || ctx.installers.includes("UnoCSS");
  const usingAuth = ctx.installers.includes("AuthJS");
  return createFileHelper(
    usingTRPC || usingPRPC,
    usingTw,
    usingAuth,
    usingTRPC ? "tRPC" : "pRPC",
    ctx
  );
};

export default getIndexLocation;

function createFileHelper(
  usingRPC: boolean,
  usingTw: boolean,
  usingAuth: boolean,
  rpc: "pRPC" | "tRPC",
  ctx: ICtx
) {
  const fileName = `${rpc.toLowerCase()}`;
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
