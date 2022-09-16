import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../src/routers/_route";
import { createContext } from "../src/_utils";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  responseMeta({ ctx, type, errors }) {
    const allOk = errors.length === 0;
    const isQuery = type === "query";
    if (ctx?.res && allOk && isQuery) {
      const DAY_IN_SECONDS = 60 * 60 * 24;
      return {
        headers: {
          "cache-control": `s-maxage=${DAY_IN_SECONDS}, stale-while-revalidate=${DAY_IN_SECONDS}`,
        },
      };
    }
    return {};
  },
});
