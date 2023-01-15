import type { IUtil } from "~types";

const getClientUtils: IUtil = (ctx) => {
  const queryImport = ctx.ssr ? "@adeora/solid-query" : "@tanstack/solid-query";
  return `import { QueryClient } from "${queryImport}";
import type { IAppRouter } from "~/server/trpc/router/_app";
import { createTRPCSolid } from "solid-trpc";
import { httpBatchLink } from "@trpc/client";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return \`http://localhost:\${process.env.PORT ?? 5173}\`;
};

export const trpc = createTRPCSolid<IAppRouter>();
export const client = trpc.createClient({
  links: [
    httpBatchLink({
      url: \`\${getBaseUrl()}/api/trpc\`,
    }),
  ],
});
export const queryClient = new QueryClient();
`;
};

export default getClientUtils;
