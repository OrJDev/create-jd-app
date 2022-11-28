import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { APIEvent } from "solid-start";
import { appRouter } from "~/server/trpc/router/_app";

const handler = (ctx: APIEvent) =>
  fetchRequestHandler({
    router: appRouter,
    createContext: () => ({
      req: ctx.request,
      res: { headers: {} },
    }),
    endpoint: "/api/trpc",
    req: ctx.request,
  });

export const GET = handler;
export const POST = handler;
