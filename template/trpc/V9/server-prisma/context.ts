import { inferAsyncReturnType } from "@trpc/server";
import { createSolidAPIHandlerContext } from "solid-start-trpc";
import { prisma } from "~/server/db/client";

export const createContextInner = async (
  opts: createSolidAPIHandlerContext
) => {
  return {
    prisma,
    ...opts,
  };
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
  return await createContextInner(opts);
};

export type IContext = inferAsyncReturnType<typeof createContext>;
