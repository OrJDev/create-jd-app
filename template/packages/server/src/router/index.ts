import { createRouter } from "../trpc";
import User from "./example";

export const appRouter = createRouter().merge("example.", User);

export type IAppRouter = typeof appRouter;
