import { createSolidAPIHandler } from "solid-start-trpc";
import { createContext } from "~/server/trpc/context";
import { appRouter } from "~/server/trpc/router/_app";

const handler = createSolidAPIHandler({
  router: appRouter,
  createContext,
});

export const GET = handler;
export const POST = handler;
