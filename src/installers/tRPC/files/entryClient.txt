import { mount, StartClient } from "solid-start/entry-client";
import { TRPCProvider } from "solid-trpc";
import { client, queryClient } from "./utils/trpc";

mount(
  () => (
    <TRPCProvider client={client} queryClient={queryClient}>
      <StartClient />
    </TRPCProvider>
  ),
  document
);
