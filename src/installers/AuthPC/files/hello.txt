import { z } from "zod";
import { helloCaller } from "../authpc";

export const helloQuery = helloCaller(
  z.object({
    hello: z.string(),
  }),
  ({ input$, ctx$ }) => {
    if (input$.hello === "hello") {
      return ctx$.hello;
    }
    return ctx$.world;
  },
);
