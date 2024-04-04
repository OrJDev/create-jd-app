import { z } from "zod";
import { userBuilder } from "../prpc";

export const protectedQuery = userBuilder
  .input(
    z.object({
      hello: z.string(),
    })
  )
  .query$(({ payload, ctx$ }) => {
    return `this is top secret: ${payload.hello} ${ctx$.user?.name}`;
  }, "myProtectedQuery");
