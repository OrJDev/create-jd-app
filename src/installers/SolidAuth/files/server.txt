import { Authenticator } from "@solid-auth/core";
import { DiscordStrategy } from "@solid-auth/socials";
import { serverEnv } from "~/env/server";
import { sessionStorage } from "~/utils/auth";

export type User = {
  id: string;
  displayName: string;
  avatar?: string;
};

const users: User[] = [];

export const authenticator = new Authenticator<User>(sessionStorage).use(
  new DiscordStrategy(
    {
      clientID: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      callbackURL: serverEnv.SITE_URL + "/api/auth/discord/callback",
    },
    async ({ profile }) => {
      let user = users.find((u) => u.id === profile.id);
      if (!user) {
        user = {
          id: profile.id,
          displayName: profile.__json.username,
          avatar: profile.photos[0].value,
        };
        users.push(user);
      }
      return user;
    }
  )
);
