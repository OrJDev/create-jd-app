import { authMiddleware } from "@solid-mediakit/auth";
import { createMiddleware } from "@solidjs/start/middleware";
import { authOptions } from "./server/auth";

const pathsToPreload = ["/"];

export default createMiddleware({
  onRequest: [authMiddleware(pathsToPreload, authOptions)],
});
