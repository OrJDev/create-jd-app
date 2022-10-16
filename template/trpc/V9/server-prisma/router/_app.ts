import { router } from "../utils";
import exampleRouter from "./example";
import notesRouter from "./notes";

export const appRouter = router()
  .merge("example.", exampleRouter)
  .merge("notes.", notesRouter);

export type IAppRouter = typeof appRouter;
