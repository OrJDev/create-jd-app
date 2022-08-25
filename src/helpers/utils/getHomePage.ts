import { IUtil } from "~types/Installer";

const getHomePage: IUtil = (installers) => {
  const useTailwind = installers.includes("tailwind");
  const usePrisma = installers.includes("prisma");
  const getInput = (input: string, cond: boolean) => (cond ? input : "");
  const getStyles = (styles: string) =>
    getInput(` class="${styles}"`, useTailwind);

  return `import { Component, onMount } from "solid-js";
import { useTrpc } from "../../utils/trpc";

interface IHomeProps { };

const App: Component<IHomeProps> = ({ }) => {
    const trpc = useTrpc();
    const [response] = trpc.useQuery("example.test", { name: "example" });
    const [useMutationExample, { loading, data }] = trpc.useMutation("example.mTest", {
        onSuccess: (data, variables) => {
            console.log({ weSuccessSo: { data, variables } });
        }
    });${getInput(
      `\n    const [prismaMutate] = trpc.useMutation("example.prisma", {
        onSuccess: (data, variables) => {
            console.log({ prisma: true, weSuccessSo: { data, variables } });
        }
    })`,
      usePrisma
    )}

    onMount(() => {
        (async () => {
            try {
                const response = await useMutationExample({ number: 1 });${getInput(
                  `\n                const second = await prismaMutate({ text: "hey" })`,
                  usePrisma
                )}
                console.log({ response${getInput(", second", usePrisma)} })
            } catch (e) {
                console.log(e);
            }
        })()
    })

    return (
        <div${getStyles("flex flex-col items-center")}>
            <h1${getStyles(
              "font-bold text-gray-300 text-xl"
            )}>{response() ?? "no data || yet"}</h1>
            <h1${getStyles(
              "font-bold text-gray-300 text-xl"
            )}>{loading() ? "loading..." : data() ?? "no data"}</h1>
            <h1${getStyles("font-semibold text-3xl")}>keys length</h1>
            <h2${getStyles(
              "text-2xl text-red-500"
            )}>{Object.keys(trpc).length}</h2>
        </div>
    )
}

export default App;`;
};

export default getHomePage;
