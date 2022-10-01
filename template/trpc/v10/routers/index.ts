import { t } from "../utils";
import exampleRouter from "./example";

export const appRouter = t.mergeRouters(exampleRouter);

export type IAppRouter = typeof appRouter;
