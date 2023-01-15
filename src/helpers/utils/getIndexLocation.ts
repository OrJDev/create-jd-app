import { type IUtil } from "~types";

const getIndexLocation: IUtil = (ctx) => {
  const usingTRPC = ctx.installers.includes("tRPC");
  const usingTw =
    ctx.installers.includes("TailwindCSS") || ctx.installers.includes("UnoCSS");
  const usingAuth = ctx.installers.includes("NextAuth");
  let indexFile = "";
  if (usingTRPC && usingTw && usingAuth) {
    indexFile = "with-auth-trpc-tw.tsx";
  } else if (usingTRPC && !usingTw && usingAuth) {
    indexFile = "with-auth-trpc.tsx";
  } else if (usingTRPC && usingTw) {
    indexFile = "with-trpc-tw.tsx";
  } else if (usingTRPC && !usingTw) {
    indexFile = "with-trpc.tsx";
  } else if (!usingTRPC && usingTw) {
    indexFile = "with-tw.tsx";
  }
  indexFile = indexFile ? `${ctx.templateDir}/index/${indexFile}` : ``;
  return indexFile;
};

export default getIndexLocation;
