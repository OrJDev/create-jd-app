import { IUtil } from "~types/Installer";
import { resolveProviders } from "~utils/react";

const PROVIDERS = ["NavigationContainer", "SafeAreaProvider"];
const DEFAULT_CHILDREN = ["<Navigation />", "<StatusBar hidden />"];

const getApp: IUtil = (ctx) => {
  if (ctx.initServer) {
    PROVIDERS.unshift("QueryClientProvider client={queryClient}");
    PROVIDERS.unshift(
      "trpc.Provider client={trpcClient} queryClient={queryClient}"
    );
  }
  const providers = resolveProviders(PROVIDERS, DEFAULT_CHILDREN);
  return `import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";${
    ctx.initServer
      ? `\nimport { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from './utils/trpc';
import { useState } from "react";
import Constants from "expo-constants";`
      : ""
  }

export default function App() {
${getConstants(ctx.initServer)}
  return (
${providers}
  );
}`;
};

const getConstants = (initServer: boolean) => {
  return initServer
    ? `  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: \`http://\${Constants.manifest?.debuggerHost?.split(':').shift()}:3000/api/trpc\`,
    }),
  );`
    : "";
};

export default getApp;
