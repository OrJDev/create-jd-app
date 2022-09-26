import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getHomePage: IUtil = (ctx) => {
  const useTW = ctx.installers.includes("TailwindCSS");
  const { initServer } = ctx;
  return `import { Component${
    initServer ? ", onMount" : ""
  } } from "solid-js";${
    initServer ? '\nimport { trpc } from "~/utils/trpc";' : ""
  }

interface IHomeProps {}

const Home: Component<IHomeProps> = ({}) => {${ctx.initServer ? trpc : ""}
  return (
    <div${getStyle(useTW, "flex flex-col items-center")}>
      <h1${getStyle(useTW, "font-bold text-gray-300 text-xl")}>${
    initServer
      ? '\n        {response.data ?? "no data || yet"}\n      '
      : "Hey there"
  }</h1>
      <h1${getStyle(useTW, "font-bold text-gray-300 text-xl")}>${
    initServer
      ? `\n        {mutationExample.isLoading
          ? "Loading..."
          : mutationExample.data ?? "No Data"}\n      `
      : "Hope you are doing well"
  }</h1>
    </div>
  );
};

export default Home;
`;
};

const trpc = `\n  const response = trpc.createQuery(() => [
    "example.test",
    { name: "example" },
  ]);
  const mutationExample = trpc.createMutation(() => "example.mTest");

  onMount(async () => {
    try {
      const response = await mutationExample.mutateAsync({ number: 1 });
      console.log({ response });
    } catch (e) {
      console.log(e);
    }
  });
`;

export default getHomePage;
