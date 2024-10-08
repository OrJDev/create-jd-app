const packages = {
  dev: {
    // prisma
    prisma: "^5.20.0",
  },
  normal: {
    // prisma
    "@prisma/client": "^5.20.0",
    // prpc
    "@tanstack/solid-query": "^5.59.0",
    "@solid-mediakit/prpc": "^1.3.3",
    "@solid-mediakit/prpc-plugin": "^1.3.4",
    // authjs
    "@solid-mediakit/auth": "^3.0.0",
    "@solid-mediakit/auth-plugin": "^1.1.4",
    "@auth/core": "0.35.0",
    "@auth/prisma-adapter": "^2.6.0",
    // tailwind
    postcss: "^8.4.40",
    tailwindcss: "^3.4.7",
    autoprefixer: "^10.4.19",
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
