import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../src/routers/_route";
import { createContext } from "../src/_utils";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
