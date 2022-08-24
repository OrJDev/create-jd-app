import { Component, onMount } from "solid-js";
import { useTrpc } from "../../utils/trpc";

interface IHomeProps { };

const App: Component<IHomeProps> = ({ }) => {
    const trpc = useTrpc();
    const [response] = trpc.useQuery("example.test", { name: "example" });
    const [useMutationExample, { loading, data }] = trpc.useMutation("example.mTest", {
        onSuccess: (data, variables) => {
            console.log({ weSuccessSo: { data, variables } });
        }
    });

    onMount(() => {
        (async () => {
            try {
                const response = await useMutationExample({ number: 1 })
                console.log({ response })
            } catch (e) {
                console.log(e);
            }
        })()
    })

    return (
        <div>
            <h1>{response() ?? "no data || yet"}</h1>
            <h1>{loading() ? "loading..." : data() ?? "no data"}</h1>
            <h1>keys length</h1>
            <h2>{Object.keys(trpc).length}</h2>
        </div>
    )
}

export default App;