// @refresh reload
import "./app.css";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import { queryClient, trpc } from "./utils/trpc";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SessionProvider } from "@solid-mediakit/auth/client";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Create JD App</Title>
          <Suspense>
            <QueryClientProvider client={queryClient}>
              <trpc.Provider queryClient={queryClient}>
                <SessionProvider>{props.children}</SessionProvider>
              </trpc.Provider>
            </QueryClientProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
