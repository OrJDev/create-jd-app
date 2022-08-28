import { ParentComponent, createContext, createMemo, createResource, useContext, createSignal } from "solid-js";
import type { IAppRouter } from "api";
import { createTRPCClient, CreateTRPCClientOptions, } from "@trpc/client";
import { AnyRouter, inferHandlerInput, inferProcedureOutput, } from "@trpc/server";


type AppQueries = IAppRouter["_def"]["queries"];
type AppMutations = IAppRouter["_def"]["mutations"];

type AppQueryKeys = keyof AppQueries & string;
type AppMutationsKeys = keyof AppMutations & string;

interface ISolidTrpProps {
    opts: CreateTRPCClientOptions<AnyRouter<any>>;
};

export type ISolidTrpcContext = {
    client: ReturnType<typeof createTRPCClient>;
    useQuery: ReturnType<typeof useQuery>;
    useMutation: ReturnType<typeof useMutation>;
}

type PromiseOrVoid = Promise<void> | void;
export type ISolidTrpcOPtions<TPath extends AppMutationsKeys> = Partial<{
    onSuccess: (data: InferMutationOutput<TPath>, ...variables: inferHandlerInput<AppMutations[TPath]>) =>
        PromiseOrVoid;
    onError: (error: any, ...variables: inferHandlerInput<AppMutations[TPath]>) =>
        PromiseOrVoid;
}>;
export type IClient = ReturnType<typeof createTRPCClient<IAppRouter>>;

export const SolidTrpcContext = createContext<ISolidTrpcContext>({} as any)
export const useTrpc = () => useContext(SolidTrpcContext);
export type InferMutationOutput<TRouteKey extends AppMutationsKeys> =
    inferProcedureOutput<AppMutations[TRouteKey]>



const useQuery = (client: IClient) => <TPath extends AppQueryKeys>(
    path: TPath,
    ...args: inferHandlerInput<AppQueries[TPath]>
) => createResource(async () => await client.query(path, ...args as any));

const useMutation = (client: IClient) => <TPath extends AppMutationsKeys>(
    path: TPath,
    options?: ISolidTrpcOPtions<TPath>
) => {
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<any>(null);
    const [data, setData] = createSignal<InferMutationOutput<TPath> | undefined>(undefined);
    async function mutateAsync(...args: inferHandlerInput<AppMutations[TPath]>):
        Promise<InferMutationOutput<TPath>> {
        setLoading(true);
        setError(undefined);
        setData(undefined);
        try {
            const response = await client.mutation(path, ...args as any);
             options?.onSuccess?.(response, ...args);
            setData(response as any);
            setLoading(false);
            return response;
        } catch (e) {
             options?.onError?.(e, ...args);
            setError(e);
            setLoading(false);
            throw e;
        }
    }
    return [mutateAsync,
        { loading, data, error }
    ] as const;
}


const SolidTrpc: ParentComponent<ISolidTrpProps> = (props) => {
    const client = createMemo(() => createTRPCClient<IAppRouter>(props.opts));
    return (
        <SolidTrpcContext.Provider value={{
            client: client(),
            useQuery: useQuery(client()),
            useMutation: useMutation(client()),
        }}>
            {props.children}
        </SolidTrpcContext.Provider>
    )
}


export default SolidTrpc;

