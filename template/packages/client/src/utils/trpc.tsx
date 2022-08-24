import { ParentComponent, createContext, createMemo, createResource, useContext, createSignal } from "solid-js";
import type { IAppRouter } from "server";
import { createTRPCClient, CreateTRPCClientOptions, } from "@trpc/client";
import { AnyRouter, inferHandlerInput, inferProcedureOutput } from "@trpc/server";

type AppQueries = IAppRouter["_def"]["queries"];
type AppMutations = IAppRouter["_def"]["mutations"];

type AppQueryKeys = keyof AppQueries & string;
type AppMutationsKeys = keyof AppMutations & string;

export type InferMutationOutput<TRouteKey extends AppMutationsKeys> =
    inferProcedureOutput<AppMutations[TRouteKey]>

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
) => {
    const [loading, setLoading] = createSignal<boolean>(true);
    const [error, setError] = createSignal<any>(null);
    const [data, setData] = createSignal<undefined | InferMutationOutput<TPath>>(undefined);
    const mutateAsync = async (...args: inferHandlerInput<AppMutations[TPath]>) => {
        try {
            const response = await client.mutation(path, ...args as any);
            setData(response as any);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false)
        }
    }
    return [mutateAsync, { data, loading, error }] as const;
}

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

