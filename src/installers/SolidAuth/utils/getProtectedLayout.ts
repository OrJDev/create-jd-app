import { IUtil } from "~types";

const getProtectedLayout: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  return `import { Match, Switch, type Component } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { authenticator${
    usePrisma ? "" : ", type User"
  } } from "~/server/auth";${
    usePrisma ? `\nimport { type User } from "@prisma/client";` : ""
  }

export const withProtected = (Component: ProtectedRouter) => {
  const routeData = () => {
    return createServerData$(async (_, { request }) => {
      const user = await authenticator.isAuthenticated(request);
      if (!user) {
        throw redirect("/account");
      }
      return user;
    });
  };
  return {
    routeData,
    Page: () => {
      const current = useRouteData<typeof routeData>();
      return (
        <Switch fallback={<Component {...(current() as User)} />}>
          <Match when={current.loading || current() instanceof Response}>
            <Spinner />
          </Match>
        </Switch>
      );
    },
  };
};

export type ProtectedRouter = Component<User>;
`;
};

export default getProtectedLayout;
