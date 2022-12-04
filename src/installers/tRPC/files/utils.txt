import { createTRPCSolid } from "solid-trpc";
import { httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/solid-query";

type IAppRouter = any; // replace this with an actual router

export const trpc = createTRPCSolid<IAppRouter>();
export const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc", // replace this with actual url
    }),
  ],
});
export const queryClient = new QueryClient();
