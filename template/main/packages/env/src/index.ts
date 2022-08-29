import "./init";
import schema from "./schema";

const _serverEnv = schema.safeParse(process.env);

if (!_serverEnv.success) {
  console.error(
    "❌ Invalid environment variables",
    _serverEnv.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

export default _serverEnv.data;
