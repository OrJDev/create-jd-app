import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter, type IAppRouter } from "./router";
import { createContext } from "./context";

export const expressMW = createExpressMiddleware({
  router: appRouter,
  createContext,
});

export { type IAppRouter };
