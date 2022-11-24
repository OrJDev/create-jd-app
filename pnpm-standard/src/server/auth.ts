import { type User } from "@prisma/client";
import { Authenticator, DiscordStrategy } from "solidjs-auth";
import { serverEnv } from "~/env/server";
import { sessionStorage } from "~/utils/auth";
import { prisma } from "./db/client";

export const authenticator = new Authenticator<User>(sessionStorage).use(
  new DiscordStrategy(
    {
      clientID: serverEnv.DISCORD_CLIENT_ID,
      clientSecret: serverEnv.DISCORD_CLIENT_SECRET,
      callbackURL: serverEnv.SITE_URL + "/api/auth/discord/callback",
    },
    async ({ profile }) => {
      let user = await prisma.user.findUnique({
        where: {
          id: profile.id,
        },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: profile.id,
            displayName: profile.__json.username,
            avatar: profile.photos[0].value,
          },
        });
      }
      return user;
    }
  )
);
