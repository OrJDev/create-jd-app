const packages = {
  dev: {
    // tailwind
    tailwindcss: "^3.4.1",
    postcss: "^8.4.35",
    autoprefixer: "^10.4.17",
    // prisma
    prisma: "^5.10.2",
  },
  normal: {
    // prisma
    "@prisma/client": "^5.10.2",
    // prpc
    "@tanstack/solid-query": "^5.28.6",
    "@solid-mediakit/prpc": "^1.0.4",
    "@solid-mediakit/prpc-plugin": "^1.0.2",
    // next auth
    "@solid-mediakit/auth": "^2.0.7",
    "@auth/core": "^0.28.0",
    "@auth/prisma-adapter": "^1.5.0",
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
