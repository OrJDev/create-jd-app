import { Component } from "solid-js";
import { Home } from "./pages";
import SolidTrpc from "./utils/trpc";

interface IAppProps { };

const App: Component<IAppProps> = ({ }) => {
    return (
        <SolidTrpc
            opts={{ url: "http://localhost:4000/trpc" }}
        >
            <Home />
        </SolidTrpc>
    )
}

export default App;