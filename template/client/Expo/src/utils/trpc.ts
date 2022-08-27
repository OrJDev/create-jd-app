import { createReactQueryHooks } from "@trpc/react";
import { type IAppRouter } from "api";

export const trpc = createReactQueryHooks<IAppRouter>();
