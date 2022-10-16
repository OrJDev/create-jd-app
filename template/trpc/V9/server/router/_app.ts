import { router } from "../utils";
import exampleRouter from "./example";

export const appRouter = router().merge("example.", exampleRouter);

export type IAppRouter = typeof appRouter;
