import { createRouter } from "../_utils";
import exampleRouter from "./_example";

export const appRouter = createRouter().merge("example.", exampleRouter);

export type IAppRouter = typeof appRouter;
