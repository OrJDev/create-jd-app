import { inferAsyncReturnType } from "@trpc/server";
import { APIEvent } from "solid-start";

type ICreateContextOptions = Record<string, never>;

export const createContextInner = async (opts: ICreateContextOptions) => {
  return {};
};

export const createContext = async (opts: APIEvent) => {
  return await createContextInner({});
};

export type IContext = inferAsyncReturnType<typeof createContext>;
