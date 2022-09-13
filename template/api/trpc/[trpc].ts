import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

const prisma = new PrismaClient();
const createContext = (opts: trpcNext.CreateNextContextOptions) => ({
  ...opts,
  prisma,
});
const createRouter = () =>
  trpc.router<inferAsyncReturnType<typeof createContext>>();

const testRouter = createRouter()
  .query("test", {
    input: z.object({ name: z.string() }),
    resolve({ input }) {
      return `hey ${input.name}`;
    },
  })
  .mutation("mTest", {
    input: z.object({ number: z.number() }),
    resolve({ input }) {
      return input.number / 2 + 1.5;
    },
  });
const appRouter = createRouter().merge("example.", testRouter);

export type IAppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext as any,
  responseMeta({ ctx, type, errors }) {
    const allOk = errors.length === 0;
    const isQuery = type === "query";
    if (ctx?.res && allOk && isQuery) {
      const DAY_IN_SECONDS = 60 * 60 * 24;
      return {
        headers: {
          "cache-control": `s-maxage=${DAY_IN_SECONDS}, stale-while-revalidate=${DAY_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
});
