import type { IUtil } from "~types";

const getBuilder: IUtil = (ctx) => {
  const useAuth = ctx.installers.includes("AuthJS");
  return `import { createCaller${
    useAuth ? ", error$" : ""
  } } from "@solid-mediakit/authpc";${
    useAuth
      ? `\nimport { authOptions } from "./auth";\nimport { getSession } from "@solid-mediakit/auth";`
      : ""
  }

export const helloCaller = createCaller
  .use(() => {
    return {
      hello: 1,
    };
  })
  .use(({ ctx$ }) => {
    return {
      ...ctx$,
      world: 2,
    };
  });${
    useAuth
      ? `\n\nexport const userCaller = createCaller.use(async ({ event$ }) => {
  const session = await getSession(event$.request, authOptions);
  if (!session) {
    return error$("Unauthorized", {
      status: 401,
    });
  }
  return session;
});`
      : ""
  }
`;
};

export default getBuilder;
