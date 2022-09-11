import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter as router, createContext } from "api";
import { NextApiRequest, NextApiResponse } from "next";

const trpcHandler = createNextApiHandler({
  router,
  createContext,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 200;
    return res.end();
  }
  return await trpcHandler(req, res);
}
