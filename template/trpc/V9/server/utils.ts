import { router as _router } from "@trpc/server";
import { IContext } from "./context";

export const router = () => _router<IContext>();
