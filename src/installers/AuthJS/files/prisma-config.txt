import { type SolidAuthConfig } from "@solid-auth/base";
import Discord from "@auth/core/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { serverEnv } from "~/env/server";
import { prisma } from "./db";

declare module "@auth/core/types" {
  export interface Session {
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: SolidAuthConfig = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Discord({
      clientId: serverEnv.DISCORD_ID,
      clientSecret: serverEnv.DISCORD_SECRET,
    }),
  ],
  debug: false,
};
