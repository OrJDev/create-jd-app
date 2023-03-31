import { middleware$, error$ } from "@prpc/solid";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(20, "10 s"),
});

export const withRateLimit = middleware$(async ({ request$ }) => {
  const ip = request$.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success, pending, reset } = await ratelimit.limit(`mw_${ip}`);
  await pending;

  if (!success) {
     return error$(
      `Rate limit exceeded, retry in ${new Date(reset).getDate()} seconds`,
      { status: 429 }
    );
  }
});
