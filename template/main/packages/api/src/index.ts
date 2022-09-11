import { appRouter } from "./router";
import { createContext } from "./utils";

export type IAppRouter = typeof appRouter;
export { createContext, appRouter };
