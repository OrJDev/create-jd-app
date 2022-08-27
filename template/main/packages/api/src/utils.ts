import * as trpc from "@trpc/server";
import { IContext } from "./context";

export const createRouter = () => trpc.router<IContext>();
