import { IUtil } from "~types";

const getProtectedLayout: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  return `import { ${
    ctx.ssr ? "Show" : "Match, Switch"
  }, type Component } from "solid-js";
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
        throw redirect("/");
      }
      return user;
    });
  };
  return {
    routeData,
    Page: () => {
      const current = useRouteData<typeof routeData>();
      return (
${getInnerJsx(ctx.ssr)}        
      );
    },
  };
};

export type ProtectedRouter = Component<User>;
`;
};

const getInnerJsx = (ssr?: boolean) => {
  if (ssr) {
    return `        <Show when={current()} keyed>
          {(user) => <Component {...user} />}
        </Show>`;
  }
  return `        <Switch fallback={<Component {...(current() as User)} />}>
          <Match when={current.loading || current() instanceof Response}>
            <h1>Loading...</h1>
          </Match>
        </Switch>`;
};

export default getProtectedLayout;
