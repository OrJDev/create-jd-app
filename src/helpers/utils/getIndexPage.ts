import { ICtx, IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getIndexPage: IUtil = (ctx) => {
  const useUno = ctx.installers.includes("UnoCSS");
  const uswTW = ctx.installers.includes("TailwindCSS");
  const useStyles = useUno || uswTW;
  const useTRPC = ctx.installers.includes("tRPC");
  const shouldUsePrisma = ctx.installers.includes("Prisma") && !useTRPC;
  const withStyles = getStyle(
    useStyles,
    `font-bold text-2xl ${useUno ? "text-gray" : "text-gray-500"}`
  );
  const innerRes = getRes(ctx, shouldUsePrisma, useTRPC);
  const innerContent = getContent(withStyles, shouldUsePrisma, useTRPC);
  return `import { type ParentComponent${
    useTRPC || shouldUsePrisma ? ", Switch, Match" : ""
  }${shouldUsePrisma ? ", createResource" : ""} } from "solid-js";
import { Title } from "solid-start";${
    useTRPC ? '\nimport { trpc } from "~/utils/trpc"' : ""
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

const getRes = (ctx: ICtx, shouldUsePrisma: boolean, useTRPC: boolean) => {
  const res =
    ctx.trpcVersion === "V10"
      ? `trpc.hello.useQuery(() => ({ name: "from tRPC" }));`
      : `trpc.createQuery(() => ["example.hello", { name: "from tRPC" }]);`;
  return shouldUsePrisma
    ? `\n  const [res] = createResource(() =>
    fetch("/api/notes").then((res) => res.json())
  );\n`
    : useTRPC
    ? `\n  const res = ${res}\n`
    : "";
};

const getContent = (
  withStyles: string,
  shouldUsePrisma: boolean,
  useTRPC: boolean
) => {
  if (shouldUsePrisma || useTRPC) {
    return `        <Switch ${
      withStyles.length ? "\n          " : ""
    }fallback={${withStyles.length ? "\n            " : ""}<pre${withStyles}>${
      withStyles.length ? "\n              " : ""
    }{JSON.stringify(res${shouldUsePrisma ? "()" : ".data"})}${
      withStyles.length ? "\n            " : ""
    }</pre>${withStyles.length ? "\n          " : ""}}${
      withStyles.length ? "\n        " : ""
    }>
          <Match when={res.${shouldUsePrisma ? "loading" : "isLoading"}}>
            <div${withStyles}>Loading...</div>
          </Match>
        </Switch>`;
  }
  return `        <h1${withStyles}>Hey There Pal</h1>`;
};
