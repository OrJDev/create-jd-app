import { IUtil } from "~types";

const getHandler: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  return `import { authenticator${
    usePrisma ? "" : ", type User"
  } } from "~/server/auth";
import { createSolidAuthHandler } from "solid-auth";${
    usePrisma ? `\nimport { type User } from "@prisma/client";` : ""
  }

const handler = createSolidAuthHandler<User>(authenticator);

export const POST = handler;
export const GET = handler;
`;
};

export default getHandler;
