import { IUtil } from "~types/Installer";
import { getStyle } from "~utils/react";

const getHomePage: IUtil = (ctx) => {
  const useTW = ctx.installers.includes("TailwindCSS");
  const { initServer } = ctx;
  return `import { Component${
    initServer ? ", onMount" : ""
  } } from "solid-js";${
    initServer ? '\nimport { trpc } from "~/utils/trpc";' : ""
  }

interface IHomeProps { };

const Home: Component<IHomeProps> = ({ }) => {${ctx.initServer ? trpc : ""}
    return (
        <div${getStyle(useTW, "flex flex-col items-center", "", true)}>
            <h1${getStyle(
              useTW,
              "font-bold text-gray-300 text-xl",
              "",
              true
            )}>${
    initServer ? '{response() ?? "no data || yet"}' : "Hey there"
  }</h1>
            <h1${getStyle(
              useTW,
              "font-bold text-gray-300 text-xl",
              "",
              true
            )}>${
    initServer
      ? '{currentState().loading ? "loading..." : currentState().data ?? "no data"}'
      : "Hope you are doing well"
  }</h1>
        </div>
    )
}

export default Home;`;
};

const trpc = `\n    const [response] = trpc.useQuery("example.test", { name: "example" });
    const [useMutationExample, currentState] = trpc.useMutation("example.mTest", {
        onSuccess: (data, variables) => {
            console.log({ weSuccessSo: { data, variables } });
        }
    });
    const [prismaMutate] = trpc.useMutation("example.prisma", {
        onSuccess: (data, variables) => {
            console.log({ prisma: true, weSuccessSo: { data, variables } });
        }
    });

    onMount(() => {
        (async () => {
            try {
                const response = await useMutationExample({ number: 1 });
                const second = await prismaMutate({ text: "hey" });
                console.log({ response, second })
            } catch (e) {
                console.log(e);
            }
        })()
    })
`;

export default getHomePage;
