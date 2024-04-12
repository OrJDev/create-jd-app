const packages = {
  dev: {
    // prisma
    prisma: "^5.12.1",
  },
  normal: {
    // prisma
    "@prisma/client": "^5.12.1",
    // prpc
    "@tanstack/solid-query": "^5.29.3",
    "@solid-mediakit/prpc": "^1.2.2",
    "@solid-mediakit/prpc-plugin": "^1.2.2",
    // authjs
    "@solid-mediakit/auth": "^2.0.9",
    "@auth/core": "^0.29.0",
    "@auth/prisma-adapter": "^1.6.0",
    // tailwind
    "@tailwindcss/vite": "4.0.0-alpha.14",
    tailwindcss: "^4.0.0-alpha.14",
    "@tailwindcss/postcss": "^4.0.0-alpha.14",
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
