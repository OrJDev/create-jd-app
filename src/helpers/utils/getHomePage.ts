import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getHomePage: IUtil = (ctx) => {
  const useTW = ctx.installers.includes("TailwindCSS");
  const useQuery = ctx.installers.includes("Solid Query");
  const { initServer } = ctx;
  const shouldUseQuery = useQuery && !initServer;
  return `import { Component${
    initServer ? ", onMount" : ""
  } } from "solid-js";${
    initServer ? '\nimport { trpc } from "~/utils/trpc";' : ""
  }${
    shouldUseQuery
      ? '\nimport { createQuery } from "@tanstack/solid-query";'
      : ""
  }

interface IHomeProps {}

const Home: Component<IHomeProps> = ({}) => {${ctx.initServer ? trpc : ""}${
    shouldUseQuery
      ? `\n  const queryExample = createQuery(
    () => ["example"],
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve("Hello World!"), 3000);
      })
  );`
      : ""
  }
  return (
    <div${getStyle(useTW, "flex flex-col items-center")}>
      <h1${getStyle(useTW, "font-bold text-gray-300 text-xl")}>${
    initServer
      ? '\n        {response() ?? "no data || yet"}\n      '
      : "Hey there"
  }</h1>
      <h1${getStyle(useTW, "font-bold text-gray-300 text-xl")}>${
    initServer
      ? `\n        {currentState().loading
          ? "Loading..."
          : currentState().data ?? "No Data"}\n      `
      : shouldUseQuery
      ? '\n        {queryExample.isLoading ? "Loading..." : queryExample.data ?? "No Data"}\n      '
      : "Hope you are doing well"
  }</h1>
    </div>
  );
};

export default Home;
`;
};

const trpc = `\n  const [response] = trpc.useQuery("example.test", { name: "example" });
  const [useMutationExample, currentState] = trpc.useMutation("example.mTest", {
    onSuccess: (data, variables) => {
      console.log({ weSuccessSo: { data, variables } });
    },
  });

  onMount(async () => {
    try {
      const response = await useMutationExample({ number: 1 });
      console.log({ response });
    } catch (e) {
      console.log(e);
    }
  });
`;

export default getHomePage;
