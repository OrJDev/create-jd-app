import { IUtil } from "~types";

const getTrpcContext: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const useNextAuth = ctx.installers.includes("NextAuth");
  return `import type { inferAsyncReturnType } from "@trpc/server";
import type { createSolidAPIHandlerContext } from "solid-start-trpc";${
    usePrisma ? `\nimport { prisma } from "~/server/db/client";` : ""
  }${
    useNextAuth
      ? `\nimport { getSession } from "@auth/solid-start";\nimport { authOpts } from "~/routes/api/auth/[...solidauth]";`
      : ""
  }

export const createContextInner = async (
  opts: createSolidAPIHandlerContext
) => {${
    useNextAuth
      ? `\n  const session = await getSession(opts.req, authOpts);`
      : ""
  }
  return {
    ...opts,${usePrisma ? `\n    prisma,` : ""}${
    useNextAuth ? `\n    session,` : ""
  }
  };
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
  return await createContextInner(opts);
};

export type IContext = inferAsyncReturnType<typeof createContext>;
`;
};

export default getTrpcContext;
