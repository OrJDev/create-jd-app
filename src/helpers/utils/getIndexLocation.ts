import { type IUtil } from "~types";

const getIndexLocation: IUtil = (ctx) => {
  const usingPRPC = ctx.installers.includes("pRPC");
  const usingTw =
    ctx.installers.includes("TailwindCSS") || ctx.installers.includes("UnoCSS");
  const usingAuth = ctx.installers.includes("AuthJS");
  let indexFile = "";
  if (usingPRPC && usingTw && usingAuth) {
    indexFile = "with-auth-prpc-tw.tsx";
  } else if (usingPRPC && !usingTw && usingAuth) {
    indexFile = "with-auth-prpc.tsx";
  } else if (usingPRPC && usingTw) {
    indexFile = "with-prpc-tw.tsx";
  } else if (usingPRPC && !usingTw) {
    indexFile = "with-prpc.tsx";
  } else if (usingAuth && usingTw) {
    indexFile = "with-auth-tw.tsx";
  } else if (!usingPRPC && usingTw) {
    indexFile = "with-tw.tsx";
  } else if (usingAuth) {
    indexFile = "with-auth.tsx";
  }
  indexFile = indexFile ? `${ctx.templateDir}/index/${indexFile}` : ``;
  return indexFile;
};

export default getIndexLocation;
