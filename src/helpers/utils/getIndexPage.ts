import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getIndexPage: IUtil = (ctx) => {
  const useUno = ctx.installers.includes("UnoCSS");
  const uswTW = ctx.installers.includes("TailwindCSS");
  const useStyles = useUno || uswTW;
  const useTRPC = ctx.installers.includes("tRPC");
  const useAuth = ctx.installers.includes("SolidAuth");
  const shouldUsePrisma =
    ctx.installers.includes("Prisma") && !useTRPC && !useAuth;
  const withStyles = getStyle(
    useStyles,
    `font-bold text-2xl ${useUno ? "text-gray" : "text-gray-500"}`
  );
  const withButtonStyles = getStyle(
    useStyles,
    `${
      useUno ? "bg-purple" : "bg-purple-700"
    } mx-3 my-3 rounded-lg w-56 p-2.5 text-white font-bold flex items-center justify-center`
  );

  const innerRes = getRes(useAuth, shouldUsePrisma, useTRPC);
  const innerContent = getContent(
    withStyles,
    useAuth,
    shouldUsePrisma,
    useTRPC,
    withButtonStyles
  );
  return `import { type ParentComponent${
    useTRPC || shouldUsePrisma || useAuth ? ", Switch, Match" : ""
  }${shouldUsePrisma ? ", createResource" : ""} } from "solid-js";
import { Title${useAuth ? ", useRouteData" : ""} } from "solid-start";${
    useTRPC ? '\nimport { trpc } from "~/utils/trpc";' : ""
  }${
    useAuth
      ? `\nimport { createServerData$ } from "solid-start/server";
import { authenticator } from "~/server/auth";
import { authClient } from "~/utils/auth";`
      : ""
  }
${
  useAuth
    ? `\nexport const routeData = () => {
  return createServerData$(async (_, { request }) => {
    const user = await authenticator.isAuthenticated(request);
    return user;
  });
};
`
    : ""
}
const Home: ParentComponent = () => {${innerRes}
  return (
    <>
      <Title>Home</Title>
      <div>
${innerContent}
      </div>
    </>
  );
};

export default Home;
`;
};

export default getIndexPage;

const getRes = (
  useAuth: boolean,
  shouldUsePrisma: boolean,
  useTRPC: boolean
) => {
  if (useAuth && useTRPC) {
    return `\n  const user = useRouteData<typeof routeData>();
  const res = trpc.secret.useQuery(undefined, {
    get enabled() {
      return !!user();
    },
  });
`;
  }
  if (useAuth) {
    return `\n  const res = useRouteData<typeof routeData>();\n`;
  }
  return shouldUsePrisma
    ? `\n  const [res] = createResource(() =>
    fetch("/api/notes").then((res) => res.json())
  );\n`
    : useTRPC
    ? `\n  const res = trpc.hello.useQuery(() => ({ name: "from tRPC" }));\n`
    : "";
};

const getContent = (
  withStyles: string,
  useAuth: boolean,
  shouldUsePrisma: boolean,
  useTRPC: boolean,
  withButtonStyles: string
) => {
  if (useAuth && !useTRPC) {
    return `        <Switch
          fallback={
            <div class="font-bold text-2xl text-gray-500">Loading...</div>
          }
        >
          <Match when={res() !== undefined}>
            <pre class="font-bold text-2xl text-gray-500">
              {JSON.stringify(res(), null, 2)}
            </pre>
          </Match>
        </Switch>
        <Switch
          fallback={
            <button
              onClick={() =>
                authClient.login("discord", {
                  successRedirect: "/",
                  failureRedirect: "/",
                })
              }${
                withButtonStyles.length
                  ? `\n             ${withButtonStyles}`
                  : ""
              }
            >
              Login with discord
            </button>
          }
        >
          <Match when={res()}>
            <button
              onClick={() =>
                authClient.logout({
                  redirectTo: "/",
                })
              }${
                withButtonStyles.length
                  ? `\n             ${withButtonStyles}`
                  : ""
              }
            >
              Logout
            </button>
          </Match>
        </Switch>`;
  }
  if (shouldUsePrisma || useTRPC) {
    return `        <Switch ${
      withStyles.length ? "\n          " : ""
    }fallback={${withStyles.length ? "\n            " : ""}<pre${withStyles}>${
      withStyles.length ? "\n              " : ""
    }{JSON.stringify(res${shouldUsePrisma ? "()" : ".data"}, null, 2)}${
      withStyles.length ? "\n            " : ""
    }</pre>${withStyles.length ? "\n          " : ""}}${
      withStyles.length ? "\n        " : ""
    }>
          <Match when={res.${
            shouldUsePrisma || (useAuth && !useTRPC) ? "loading" : "isLoading"
          }}>
            <div${withStyles}>${
      useAuth && useTRPC && withStyles.length ? "\n" : ""
    }${
      useAuth && useTRPC
        ? `              {res.isFetching ? "Loading" : "Not Logged In"}`
        : "Loading..."
    }${useAuth && useTRPC ? "\n            " : ""}</div>
          </Match>
        </Switch>${
          useAuth && useTRPC
            ? `\n        <Switch
          fallback={
            <button
              onClick={() =>
                authClient.login("discord", {
                  successRedirect: "/",
                  failureRedirect: "/",
                })
              }${
                withButtonStyles.length
                  ? `\n             ${withButtonStyles}`
                  : ""
              }
            >
              Login with discord
            </button>
          }
        >
          <Match when={user.loading}>
            <h1>Loading user</h1>
          </Match>
          <Match when={user()}>
            <button
              onClick={() =>
                authClient.logout({
                  redirectTo: "/",
                })
              }${
                withButtonStyles.length
                  ? `\n             ${withButtonStyles}`
                  : ""
              }
            >
              Logout
            </button>
          </Match>
        </Switch>`
            : ""
        }`;
  }
  return `        <h1${withStyles}>Hey There Pal</h1>`;
};
