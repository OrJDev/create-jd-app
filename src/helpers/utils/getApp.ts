import { IUtil } from "~types";
import { resolveProviders } from "~utils/jsx";

const getApp: IUtil = (ctx) => {
  const useRouter = ctx.installers.includes("Router");
  const providers = useRouter ? ["Router", "Routes"] : [];
  const children = useRouter
    ? '<Route path="/" component={Home} />'
    : "<Home />";
  ctx.trpc &&
    providers.unshift("TRPCProvider client={client} queryClient={queryClient}");
  const resolved = resolveProviders(providers, [children]);

  return `import { Component } from "solid-js";
import { Home } from "./pages";${
    useRouter
      ? '\nimport { Routes, Route, Router } from "@solidjs/router";'
      : ""
  }${
    ctx.trpc
      ? '\nimport { QueryClient } from "@tanstack/solid-query";\nimport { TRPCProvider } from "solid-trpc";\nimport { client } from "./utils/trpc";'
      : ""
  }

interface IAppProps {}${
    ctx.trpc ? "\n\nconst queryClient = new QueryClient();" : ""
  }

const App: Component<IAppProps> = ({}) => {
  return (
${resolved}
  );
};

export default App;
`;
};

export default getApp;
