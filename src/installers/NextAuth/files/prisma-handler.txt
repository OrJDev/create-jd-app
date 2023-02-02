import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start";
import Discord from "@auth/core/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { serverEnv } from "~/env/server";
import { prisma } from "~/server/db/client";

export const authOpts: SolidAuthConfig = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore types error
    Discord({
      clientId: serverEnv.DISCORD_ID,
      clientSecret: serverEnv.DISCORD_SECRET,
    }),
  ],
  session: {
    strategy: "database",
    generateSessionToken: () => {
      return crypto.randomUUID();
    },
  },
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);
