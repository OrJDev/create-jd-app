import { IUtil } from "~types";
import { resolveProviders } from "~utils/jsx";

const getApp: IUtil = (ctx) => {
  const useRouter = ctx.installers.includes("Router");
  const useQuery = ctx.installers.includes("Solid Query");
  const providers = useRouter ? ["Router", "Routes"] : [];
  const children = useRouter
    ? '<Route path="/" component={Home} />'
    : "<Home />";
  useQuery && providers.unshift("QueryClientProvider client={queryClient}");
  const resolved = resolveProviders(providers, [children]);

  return `import { Component } from "solid-js";
import { Home } from "./pages";${
    useRouter
      ? '\nimport { Routes, Route, Router } from "@solidjs/router";'
      : ""
  }${
    useQuery
      ? '\nimport { QueryClientProvider, QueryClient } from "@tanstack/solid-query";'
      : ""
  }

interface IAppProps {}${
    useQuery ? "\n\nconst queryClient = new QueryClient();" : ""
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
