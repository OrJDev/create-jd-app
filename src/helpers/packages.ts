const packages = {
  dev: {
    // adapters
    "solid-start-vercel": "^0.2.11",
    // tailwind
    tailwindcss: "^3.2.4",
    postcss: "^8.4.19",
    autoprefixer: "^10.4.13",
    // prisma
    prisma: "^4.6.1",
    // unocss
    unocss: "^0.46.5",
  },
  normal: {
    // prisma
    "@prisma/client": "^4.6.1",
    // trpc
    "@tanstack/solid-query": "^4.15.1",
    "@trpc/client": "^10.1.0",
    "@trpc/server": "^10.1.0",
    "solid-start-trpc": "^0.0.16",
    "solid-trpc": "^0.0.11-rc.2",
    // trpc ssr
    "solid-trpc->ssr": "^0.1.0",
    "@adeora/solid-query": "^0.12.0",
    // next auth
    "@auth/solid-start": "^0.1.0",
    "@auth/core": "^0.2.4",
    "@next-auth/prisma-adapter": "^1.0.5",
    // upstash ratelimit
    "@upstash/ratelimit": "^0.1.5",
    "@upstash/redis": "^1.18.0",
  },
};

export type IPkgs = typeof packages;
export type KeyOrKeyArray<K extends keyof IPkgs> =
  | keyof IPkgs[K]
  | (keyof IPkgs[K])[];

export function withPackages(optIn: { [K in keyof IPkgs]?: KeyOrKeyArray<K> }) {
  const devs: { [K in keyof IPkgs["dev"]]?: string } = {};
  const normals: { [K in keyof IPkgs["normal"]]?: string } = {};
  for (const keyType in optIn) {
    type OptIn = keyof typeof optIn;
    const __curr = optIn[keyType as OptIn];
    const arrOptIn = Array.isArray(__curr) ? __curr : [__curr];
    for (const curr of arrOptIn) {
      const name = curr?.includes("->") ? curr.split("->")[0] : curr;
      if (keyType === "dev") {
        devs[name as keyof typeof devs] =
          packages.dev[curr as keyof typeof packages.dev];
      } else {
        normals[name as keyof typeof normals] =
          packages.normal[curr as keyof typeof packages.normal];
      }
    }
  }
  return [normals, devs];
}

export type IExpectedPackages = ReturnType<typeof withPackages>;
