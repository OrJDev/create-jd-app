import { IUtil } from "~types";

const getTrpcContext: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  const useSolidAuth = ctx.installers.includes("SolidAuth");
  const useNextAuth = ctx.installers.includes("NextAuth");
  return `import type { inferAsyncReturnType } from "@trpc/server";
import type { createSolidAPIHandlerContext } from "solid-start-trpc";${
    usePrisma ? `\nimport { prisma } from "~/server/db/client";` : ""
  }${useSolidAuth ? `\nimport { authenticator } from "../auth";` : ""}${
    useNextAuth
      ? `\nimport { getSession } from "@solid-auth/next/session";\nimport { authOpts } from "~/routes/api/auth/[...solidauth]";`
      : ""
  }

export const createContextInner = async (
  opts: createSolidAPIHandlerContext
) => {${
    useSolidAuth
      ? `\n  const user = await authenticator.isAuthenticated(opts.req);`
      : useNextAuth
      ? `\n  const session = await getSession(opts.req, authOpts);`
      : ""
  }
  return {
    ...opts,${usePrisma ? `\n    prisma,` : ""}${
    useSolidAuth ? `\n    user,` : ""
  }${useNextAuth ? `\n    session,` : ""}
  };
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
  return await createContextInner(opts);
};

export type IContext = inferAsyncReturnType<typeof createContext>;
`;
};

export default getTrpcContext;
