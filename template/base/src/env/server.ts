import { serverScheme } from "./schema";
import { ZodFormattedError } from "zod";

export const formatErrors = (
  errors: ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

const env = serverScheme.safeParse(process.env);

if (env.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(env.error.format())
  );
  throw new Error("Invalid environment variables");
}

for (let key of Object.keys(env.data)) {
  if (key.startsWith("VITE_")) {
    console.warn("❌ You are exposing a server-side env-variable:", key);
    throw new Error("You are exposing a server-side env-variable");
  }
}

export default env.data;
