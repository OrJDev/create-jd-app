import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getIndexPage: IUtil = (ctx) => {
  const useUno = ctx.installers.includes("UnoCSS");
  const uswTW = ctx.installers.includes("TailwindCSS");
  const useStyles = useUno || uswTW;
  const useTRPC = ctx.installers.includes("tRPC");
  const useNextAuth = ctx.installers.includes("NextAuth");
  const useSolidAuth = ctx.installers.includes("SolidAuth");
  const useAuth = useNextAuth || useSolidAuth;
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

  const loginKey = useSolidAuth ? "discord" : "github";
  const innerRes = getRes(useNextAuth, useSolidAuth, shouldUsePrisma, useTRPC);
  const innerContent = getContent(
    withStyles,
    useSolidAuth,
    useNextAuth,
    shouldUsePrisma,
    loginKey,
    useTRPC,
    withButtonStyles
  );
  return `import { type VoidComponent${
    useTRPC || shouldUsePrisma || useAuth ? ", Switch, Match" : ""
  }${shouldUsePrisma ? ", createResource" : ""} } from "solid-js";
import { Title${useAuth ? ", useRouteData" : ""} } from "solid-start";${
    useTRPC ? '\nimport { trpc } from "~/utils/trpc";' : ""
  }${
    useAuth ? `\nimport { createServerData$ } from "solid-start/server";` : ""
  }${
    useSolidAuth
      ? `\nimport { authenticator } from "~/server/auth";
import { authClient } from "~/utils/auth";`
      : ""
  }${
    useNextAuth
      ? `\nimport { getSession } from "@solid-auth/next";\nimport { authOpts } from "./api/auth/[...solidauth]";\nimport { signIn, signOut } from "@solid-auth/next/client";`
      : ""
  }
${
  useAuth
    ? `\nexport const routeData = () => {
  return createServerData$(async (_, { request }) => {
    return await ${
      useSolidAuth
        ? "authenticator.isAuthenticated(request)"
        : "getSession(request, authOpts)"
    };
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
  useSolidAuth: boolean,
  shouldUsePrisma: boolean,
  useTRPC: boolean
) => {
  if ((useNextAuth || useSolidAuth) && useTRPC) {
    return `\n  const ${
      useSolidAuth ? "user" : "session"
    } = useRouteData<typeof routeData>();
  const res = trpc.secret.useQuery(undefined, {
    get enabled() {
      return ${useSolidAuth ? "!!user()" : "!!session()?.user"};
    },
  });
`;
  }
  if (useNextAuth || useSolidAuth) {
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
  useSolidAuth: boolean,
  useNextAuth: boolean,
  shouldUsePrisma: boolean,
  loginKey: string,
  useTRPC: boolean,
  withButtonStyles: string
) => {
  const useAuth = useNextAuth || useSolidAuth;
  const key = useSolidAuth ? "user" : "session";
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
              onClick={() => ${
                useSolidAuth
                  ? `authClient.login("${loginKey}", {
                  successRedirect: "/",
                  failureRedirect: "/",
                })`
                  : `signIn("${loginKey}")`
              }}${
      withButtonStyles.length ? `\n             ${withButtonStyles}` : ""
    }
            >
              Login with ${loginKey}
            </button>
          }
        >
          <Match when={res()}>
            <button
              onClick={() => ${
                useSolidAuth
                  ? `authClient.logout({
                  redirectTo: "/",
                })`
                  : "signOut()"
              }}${
      withButtonStyles.length ? `\n             ${withButtonStyles}` : ""
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
              onClick={() => ${
                useSolidAuth
                  ? `authClient.login("${loginKey}", {
                  successRedirect: "/",
                  failureRedirect: "/",
                })}`
                  : `signIn("${loginKey}")}`
              }${
                withButtonStyles.length
                  ? `\n             ${withButtonStyles}`
                  : ""
              }
            >
              Login with ${loginKey}
            </button>
          }
        >
          <Match when={${key}.loading}>
            <h1>Loading ${key}</h1>
          </Match>
          <Match when={${key}()}>
            <button
              onClick={() => ${
                useSolidAuth
                  ? `authClient.logout({
                  redirectTo: "/",
                })}`
                  : "signOut()}"
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
