import type { ICtx } from "~types";

const getIndexLocation = (ctx: ICtx) => {
  const usingAuthPC = ctx.installers.includes("AuthPC");
  const usingTw = ctx.installers.includes("TailwindCSS");
  const usingAuth = ctx.installers.includes("AuthJS");
  return createFileHelper(usingAuthPC, usingTw, usingAuth, ctx);
};

export default getIndexLocation;

function createFileHelper(
  usingAuthPC: boolean,
  usingTw: boolean,
  usingAuth: boolean,
  ctx: ICtx,
) {
  const fileName = usingAuthPC ? `authpc` : "";
  let indexFile = "";
  if (usingAuthPC && usingTw && usingAuth) {
    indexFile = `with-auth-${fileName}-tw.tsx`;
  } else if (usingAuthPC && !usingTw && usingAuth) {
    indexFile = `with-auth-${fileName}.tsx`;
  } else if (usingAuthPC && usingTw) {
    indexFile = `with-${fileName}-tw.tsx`;
  } else if (usingAuthPC && !usingTw) {
    indexFile = `with-${fileName}.tsx`;
  } else if (usingAuth && usingTw) {
    indexFile = "with-auth-tw.tsx";
  } else if (!usingAuthPC && usingTw) {
    indexFile = "with-tw.tsx";
  } else if (usingAuth) {
    indexFile = "with-auth.tsx";
  }

  return indexFile ? `${ctx.templateDir}/index/${indexFile}` : ``;
}
