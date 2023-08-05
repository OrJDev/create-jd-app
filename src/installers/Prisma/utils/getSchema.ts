import type { IUtil } from "~types";

const getSchema: IUtil = (ctx) => {
  const useNextAuth = ctx.installers.includes("AuthJS");
  return `generator client {
    provider = "prisma-client-js"${
      ctx.vercel === "Cli"
        ? `\n    binaryTargets = ["native", "rhel-openssl-1.0.x"]`
        : ""
    }
}

datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
}

${
  useNextAuth
    ? `model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? // @db.Text
  access_token      String? // @db.Text
  expires_in        Int?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? // @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}`
    : `model Notes {
    id   String @id @default(cuid())
    text String
}`
}
`;
};

export default getSchema;
