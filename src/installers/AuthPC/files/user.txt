import { z } from "zod";
import { userCaller } from "../authpc";

export const protectedQuery = userCaller(
  z.object({
    hello: z.string(),
  }),
  ({ input$, ctx$ }) => {
    return `this is top secret: ${input$.hello} ${ctx$.user.name}`;
  }
);
