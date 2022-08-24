import { Component, onMount, createSignal } from "solid-js";
import { useTrpc } from "../../utils/trpc";

interface IHomeProps { };

const App: Component<IHomeProps> = ({ }) => {
    const trpc = useTrpc();
    const [response] = trpc.query("example.test", { name: "example" });
    const [example, setExample] = createSignal<string | undefined>("loading...");
    const mutateExample = trpc.mutate("example.mTest");

    onMount(() => {
        (async () => {
            try {
                const response = await mutateExample({ number: 1 })
                setExample(response)
            } catch (e) {
                setExample(undefined)
                console.log(e);
            }
        })()
    })

    return (
        <div>
            <h1>{response() ?? "no data || yet"}</h1>
            <h1>{example() ?? "no data"}</h1>
            <h1>keys length</h1>
            <h2>{Object.keys(trpc).length}</h2>
        </div>
    )
}

export default App;