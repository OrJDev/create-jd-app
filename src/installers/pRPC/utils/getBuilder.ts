import { IUtil } from "~types";

const getBuilder: IUtil = (ctx) => {
  const useAuth = ctx.installers.includes("AuthJS");
  return `import { builder$${
    useAuth ? ", error$" : ""
  } } from "@solid-mediakit/prpc";${
    useAuth
      ? `\nimport { authOptions } from "./auth";\nimport { getSession } from "@solid-mediakit/auth";`
      : ""
  }

export const helloBuilder = builder$()
  .middleware$(() => {
    return {
      hello: 1,
    };
  })
  .middleware$((ctx) => {
    return {
      ...ctx,
      world: 2,
    };
  });${
    useAuth
      ? `\n\nexport const userBuilder = builder$().middleware$(async ({ event$ }) => {
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
