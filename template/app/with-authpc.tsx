// @refresh reload
import "./app.css";
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { QueryClient } from "@tanstack/solid-query";
import { AuthPCProvider } from "@solid-mediakit/authpc/provider";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Create JD App</Title>
          <AuthPCProvider queryClient={queryClient}>
            <Suspense>{props.children}</Suspense>
          </AuthPCProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
