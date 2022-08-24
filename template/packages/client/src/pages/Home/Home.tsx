import { Component } from "solid-js";
import { useTrpc } from "../../utils/trpc";

interface IHomeProps { };

const App: Component<IHomeProps> = ({ }) => {
    const trpc = useTrpc();
    const [response] = trpc.query("example.test", { name: "example" });
    const [mutate, { loading, data }] = trpc.mutate("example.mTest");

    onMount(() => {
        (async () => {
            await mutate({ number: 1 })
        })()
    })

    return (
        <div>
            <h1>{response() ?? "no data || yet"}</h1>
            <h1>{loading() ? "loading" : data() ?? "no data"}</h1>
            <h1>keys length</h1>
            <h2>{Object.keys(trpc).length}</h2>
        </div>
    )
}

export default App;