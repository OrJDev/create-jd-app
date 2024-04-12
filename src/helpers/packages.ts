const packages = {
  dev: {
    // tailwind
    tailwindcss: "^3.4.1",
    postcss: "^8.4.35",
    autoprefixer: "^10.4.17",
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
    "@solid-mediakit/auth": "^2.0.8",
    "@auth/core": "^0.29.0",
    "@auth/prisma-adapter": "^1.6.0",
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
