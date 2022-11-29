import { IUtil } from "~types";

const getTrpcContext: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const useAuth = ctx.installers.includes("SolidAuth");
  return `import type { inferAsyncReturnType } from "@trpc/server";
import type { createSolidAPIHandlerContext } from "solid-start-trpc";${
    usePrisma ? `\nimport { prisma } from "~/server/db/client";` : ""
  }${useAuth ? `\nimport { authenticator } from "../auth";` : ""}

export const createContextInner = async (
  opts: createSolidAPIHandlerContext
) => {${
    useAuth
      ? `\n  const user = await authenticator.isAuthenticated(opts.req);`
      : ""
  }
  return {
    ...opts,${usePrisma ? `\n    prisma,` : ""}${useAuth ? `\n    user,` : ""}
  };
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
  return await createContextInner(opts);
};

export type IContext = inferAsyncReturnType<typeof createContext>;
`;
};

export default getTrpcContext;
