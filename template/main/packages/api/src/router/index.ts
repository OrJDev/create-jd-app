import { createRouter } from "../utils";
import Example from "./example";

export const appRouter = createRouter().merge("example.", Example);

export type IAppRouter = typeof appRouter;
