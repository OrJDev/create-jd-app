import { ParentComponent, createContext, createMemo, createResource, useContext } from "solid-js";
import type { IAppRouter } from "server";
import { createTRPCClient, CreateTRPCClientOptions, } from "@trpc/client";
import { AnyRouter, inferHandlerInput } from "@trpc/server";

type AppQueries = IAppRouter["_def"]["queries"];
type AppMutations = IAppRouter["_def"]["mutations"];

type AppQueryKeys = keyof AppQueries & string;
type AppMutationsKeys = keyof AppMutations & string;

interface ISolidTrpProps {
    opts: CreateTRPCClientOptions<AnyRouter<any>>;
};

export type ISolidTrpcContext = {
    client: ReturnType<typeof createTRPCClient>;
    query: ReturnType<typeof query>;
    mutate: ReturnType<typeof mutate>;
}

export type IClient = ReturnType<typeof createTRPCClient<IAppRouter>>;

export const SolidTrpcContext = createContext<ISolidTrpcContext>({} as any)
export const useTrpc = () => useContext(SolidTrpcContext);

const query = (client: IClient) => <TPath extends AppQueryKeys>(
    path: TPath,
    ...args: inferHandlerInput<AppQueries[TPath]>
) => createResource(async () => client.query(path, ...args as any));

const mutate = (client: IClient) => <TPath extends AppMutationsKeys>(
    path: TPath,
) => (...args: inferHandlerInput<AppMutations[TPath]>) =>
        client.mutation(path, ...args as any);


const SolidTrpc: ParentComponent<ISolidTrpProps> = (props) => {
    const client = createMemo(() => createTRPCClient<IAppRouter>(props.opts));
    return (
        <SolidTrpcContext.Provider value={{
            query: query(client()),
            mutate: mutate(client()),
            client: client(),
        }}>
            {props.children}
        </SolidTrpcContext.Provider>
    )
}


export default SolidTrpc;

