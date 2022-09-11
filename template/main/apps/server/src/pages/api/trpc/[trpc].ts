import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter as router, createContext } from "api";
import { withCors } from "~/utils/cors";

export default withCors(
  createNextApiHandler({
    router,
    createContext,
  })
);
