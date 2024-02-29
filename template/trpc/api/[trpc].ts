import { createSolidAPIHandler } from "@solid-mediakit/trpc/handler";
import { createContext } from "~/server/trpc/context";
import { appRouter } from "~/server/trpc/router/_app";

export const { GET, POST } = createSolidAPIHandler({
  router: appRouter,
  createContext,
});
