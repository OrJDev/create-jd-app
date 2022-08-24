import "./env/init";
import env from "./env";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { appRouter, type IAppRouter } from "./router";
import { createContext } from "./trpc";
import cors from "cors";

const app = express();

app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(env.PORT, () => {
  console.log(`http://localhost:${env.PORT}`);
});

export { type IAppRouter };
