import { IUtil } from "~types";

const getTrpcApi: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  return `import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { APIEvent } from "solid-start";
import { appRouter } from "~/server/trpc/router/_app";${
    usePrisma ? `\nimport { prisma } from "~/server/db/client";` : ""
  }

const handler = (ctx: APIEvent) =>
  fetchRequestHandler({
    router: appRouter,
    createContext: () => ({${usePrisma ? "\n      prisma," : ""}
      req: ctx.request,
      res: { headers: {} },
    }),
    endpoint: "/api/trpc",
    req: ctx.request,
  });

export const GET = handler;
export const POST = handler;`;
};

export default getTrpcApi;
