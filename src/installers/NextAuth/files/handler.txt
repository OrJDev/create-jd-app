import { SolidAuth, type SolidAuthConfig } from "@solid-auth/next";
import Github from "@auth/core/providers/github";
import { serverEnv } from "~/env/server";

export const authOpts: SolidAuthConfig = {
  providers: [
    Github({
      clientId: serverEnv.GITHUB_ID,
      clientSecret: serverEnv.GITHUB_SECRET,
    }),
  ],
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);
