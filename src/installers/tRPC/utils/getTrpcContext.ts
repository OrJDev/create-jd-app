import { IUtil } from "~types";

const getTrpcContext: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  return `import type { inferAsyncReturnType } from "@trpc/server";
import type { createSolidAPIHandlerContext } from "solid-start-trpc";${
    usePrisma ? `\nimport { prisma } from "~/server/db/client";` : ""
  }

export const createContextInner = async (
  opts: createSolidAPIHandlerContext
) => {
  return {
    ...opts,${usePrisma ? `\n    prisma,` : ""}
  };
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
  return await createContextInner(opts);
};

export type IContext = inferAsyncReturnType<typeof createContext>;
`;
};

export default getTrpcContext;
