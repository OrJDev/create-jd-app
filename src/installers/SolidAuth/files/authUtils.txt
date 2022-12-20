import { createSolidAuthClient } from "@solid-auth/core";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const authClient = createSolidAuthClient(`${getBaseUrl()}/api/auth`);
