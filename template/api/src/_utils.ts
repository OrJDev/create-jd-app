import * as trpc from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { inferAsyncReturnType } from "@trpc/server";

const prisma = new PrismaClient();

export const createContext = (opts: CreateNextContextOptions) => ({
  ...opts,
  prisma,
});

export const createRouter = () =>
  trpc.router<inferAsyncReturnType<typeof createContext>>();
