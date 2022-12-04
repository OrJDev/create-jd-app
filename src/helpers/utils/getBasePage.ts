import { IUtil } from "~types";

const getBasePage: IUtil = (ctx) => {
  const useUno = ctx.installers.includes("UnoCSS");
  const useTRPC = ctx.installers.includes("tRPC");
  return `/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import App from "./App";${useUno ? '\nimport "uno.css";' : ""}${
    useTRPC ? '\nimport { trpc, client, queryClient } from "./utils/trpc";' : ""
  }

${getRender(useTRPC)}
`;
};

const getRender = (useTRPC?: boolean) => {
  if (useTRPC) {
    return `render(
  () => (
    <trpc.Provider client={client} queryClient={queryClient}>
      <App />
    </trpc.Provider>
  ),
  document.getElementById("root") as HTMLElement
);`;
  }
  return `render(() => <App />, document.getElementById("root") as HTMLElement);`;
};

export default getBasePage;
