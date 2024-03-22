import type { IUtil } from "~types";

const getQueries: IUtil = (ctx) => {
  const useAuth = ctx.installers.includes("AuthJS");
  return `import { query$ } from '@solid-mediakit/prpc'
import { z } from 'zod'${
    useAuth ? "\nimport { protectedAction } from './middleware'" : ""
  }

export const testQuery = query$({
  queryFn: async ({ payload }) => {
    return \`hey \${payload.hello}\`
  },
  key: 'hello',
  schema: z.object({
    hello: z.string(),
  }),
})${
    useAuth
      ? `\nexport const protectedQuery = query$({
  queryFn: async ({ payload }) => {
    return \`this is top secret: \${payload.hello}\`;
  },
  key: "hello",
  schema: z.object({
    hello: z.string(),
  }),
  middleware: [protectedAction],
});`
      : ""
  }
`;
};
export default getQueries;
