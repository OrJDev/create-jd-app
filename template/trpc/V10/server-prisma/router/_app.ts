import { t } from "../utils";
import exampleRouter from "./example";
import notesRouter from "./notes";

export const appRouter = t.mergeRouters(exampleRouter, notesRouter);

export type IAppRouter = typeof appRouter;
