// @refresh reload
import "./app.css";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { QueryClient } from "@tanstack/solid-query";
import { SessionProvider } from "@solid-mediakit/auth/client";
import { PRPCProvider } from "@solid-mediakit/prpc/provider";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Create JD App</Title>
          <Suspense>
            <SessionProvider>
              <PRPCProvider queryClient={queryClient}>
                {props.children}
              </PRPCProvider>
            </SessionProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
