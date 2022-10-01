import { ISyntax, IUtil } from "~types";
import { actionToSyntax, getStyle } from "~utils/jsx";

const getHomePage: IUtil = (ctx) => {
  const useTW = ctx.installers.includes("TailwindCSS");
  return `import { Component${ctx.trpc ? ", onMount" : ""} } from "solid-js";${
    ctx.trpc ? '\nimport { trpc } from "~/utils/trpc";' : ""
  }

interface IHomeProps {}

const Home: Component<IHomeProps> = ({}) => {${
    ctx.trpc ? trpc(ctx.trpc.syntax) : ""
  }
  return (
    <div${getStyle(useTW, "flex flex-col items-center")}>
      <h1${getStyle(useTW, "font-bold text-gray-300 text-xl")}>${
    ctx.trpc
      ? `${useTW ? "\n        " : ""}{response.data ?? "no data || yet"}${
          useTW ? "\n      " : ""
        }`
      : "Hey there"
  }</h1>
      <h1${getStyle(useTW, "font-bold text-gray-300 text-xl")}>${
    ctx.trpc
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

const trpc = (syntax: ISyntax) => `\n  const response = ${actionToSyntax(
  syntax,
  "test",
  "Query",
  "example",
  '{ name: "example" }'
)}
  const mutationExample = ${actionToSyntax(
    syntax,
    "mTest",
    "Mutation",
    "example"
  )}

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
