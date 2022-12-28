import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getIndexPage: IUtil = (ctx) => {
  const useUno = ctx.installers.includes("UnoCSS");
  const uswTW = ctx.installers.includes("TailwindCSS");
  const useStyles = useUno || uswTW;
  const useTRPC = ctx.installers.includes("tRPC");
  const useNextAuth = ctx.installers.includes("NextAuth");
  const shouldUsePrisma =
    ctx.installers.includes("Prisma") && !useTRPC && !useNextAuth;
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

  const innerRes = getRes(useNextAuth, shouldUsePrisma, useTRPC);
  const innerContent = getContent(
    withStyles,
    useNextAuth,
    shouldUsePrisma,
    useTRPC,
    withButtonStyles
  );
  return `import { type VoidComponent${
    useTRPC || shouldUsePrisma || useNextAuth ? ", Switch, Match" : ""
  }${shouldUsePrisma ? ", createResource" : ""} } from "solid-js";
import { Title${useNextAuth ? ", useRouteData" : ""} } from "solid-start";${
    useTRPC ? '\nimport { trpc } from "~/utils/trpc";' : ""
  }${
    useNextAuth
      ? `\nimport { createServerData$ } from "solid-start/server";`
      : ""
  }${
    useNextAuth
      ? `\nimport { getSession } from "@solid-auth/next";\nimport { authOpts } from "./api/auth/[...solidauth]";\nimport { signIn, signOut } from "@solid-auth/next/client";`
      : ""
  }
${
  useNextAuth
    ? `\nexport const routeData = () => {
  return createServerData$(async (_, { request }) => {
    return await getSession(request, authOpts);
  });
};
`
    : ""
}
const Home: VoidComponent = () => {${innerRes}
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
  useNextAuth: boolean,
  shouldUsePrisma: boolean,
  useTRPC: boolean
) => {
  if (useNextAuth && useTRPC) {
    return `\n  const session = useRouteData<typeof routeData>();
  const res = trpc.secret.useQuery(undefined, {
    get enabled() {
      return !!session()?.user;
    },
  });
`;
  }
  if (useNextAuth) {
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
  useNextAuth: boolean,
  shouldUsePrisma: boolean,
  useTRPC: boolean,
  withButtonStyles: string
) => {
  if (useNextAuth && !useTRPC) {
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
              onClick={() => signIn("github")}${
                withButtonStyles.length
                  ? `\n             ${withButtonStyles}`
                  : ""
              }
            >
              Login
            </button>
          }
        >
          <Match when={res()}>
            <button
              onClick={() => signOut()}${
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
            shouldUsePrisma || (useNextAuth && !useTRPC)
              ? "loading"
              : "isLoading"
          }}>
            <div${withStyles}>${
      useNextAuth && useTRPC && withStyles.length ? "\n" : ""
    }${
      useNextAuth && useTRPC
        ? `              {res.isFetching ? "Loading" : "Not Logged In"}`
        : "Loading..."
    }${useNextAuth && useTRPC ? "\n            " : ""}</div>
          </Match>
        </Switch>${
          useNextAuth && useTRPC
            ? `\n        <Switch
          fallback={
            <button
              onClick={() => signIn("github")}
              ${
                withButtonStyles.length
                  ? `\n             ${withButtonStyles}`
                  : ""
              }
            >
              Login
            </button>
          }
        >
          <Match when={session.loading}>
            <h1>Loading session</h1>
          </Match>
          <Match when={session()}>
            <button
              onClick={() => signOut()}
              ${
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
