// @refresh reload
import "./app.css";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { QueryClient } from "@tanstack/solid-query";
import { AuthPCProvider } from "@solid-mediakit/authpc/provider";
import { SessionProvider } from "@solid-mediakit/auth/client";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Create JD App</Title>
          <SessionProvider>
            <AuthPCProvider queryClient={queryClient}>
              <Suspense>{props.children}</Suspense>
            </AuthPCProvider>
          </SessionProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
