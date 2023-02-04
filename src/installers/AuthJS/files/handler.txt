import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start";
import Discord from "@auth/core/providers/discord";
import { serverEnv } from "~/env/server";

export const authOpts: SolidAuthConfig = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  providers: [
    // @ts-expect-error Types Issue
    Discord({
      clientId: serverEnv.DISCORD_ID,
      clientSecret: serverEnv.DISCORD_SECRET,
    }),
  ],
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);
