import * as trpc from "@trpc/server";
import { prisma } from "db";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { inferAsyncReturnType } from "@trpc/server";

export const createContext = ({ req, res }: CreateNextContextOptions) => ({
  req,
  res,
  prisma,
});

export const createRouter = () =>
  trpc.router<IContext>().formatError(({ shape, error }) => {
    return { ...shape, error };
  });

export type IContext = inferAsyncReturnType<typeof createContext>;
