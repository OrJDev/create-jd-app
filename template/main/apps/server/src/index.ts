import env from "env";
import express from "express";
import { expressMW } from "api";
import cors from "cors";

const app = express();

app.use(cors());
app.use("/trpc", expressMW);

app.listen(env.PORT, () => {
  console.log(`http://localhost:${env.PORT}`);
});
