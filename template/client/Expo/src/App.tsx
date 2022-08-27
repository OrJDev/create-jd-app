import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from 'react-query';
import { trpc } from './utils/trpc';
import { useState } from "react";
import Constants from "expo-constants";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: `http://${Constants.manifest?.debuggerHost?.split(':').shift()}:4000/trpc`,
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar hidden />
          </SafeAreaProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
