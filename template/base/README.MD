# Create JD App

This project was created using [Create JD App](https://github.com/OrJDev/create-jd-app)

# Deploying

### Vercel Adapter (or any other adapter that solid-start supports)

#### Installing

```bash
npm install  solid-start-vercel
```

#### Adding to vite config

Without Solid Styled

```ts
import solid from "solid-start/vite";
import { defineConfig } from "vite";
// @ts-ignore
import vercel from "solid-start-vercel";

export default defineConfig({
  plugins: [solid({ ssr: false, adapter: vercel({ edge: false }) })],
});
```

With Solid Styled

```ts
import solid from "solid-start/vite";
import { defineConfig } from "vite";
import solidStyled from "solid-styled/babel";
// @ts-ignore
import vercel from "solid-start-vercel";

export default defineConfig({
  plugins: [
    solid({
      ssr: false,
      adapter: vercel({ edge: false }),
      babel: (_source: string, id: string) => ({
        plugins: [[solidStyled, { source: id }]],
      }),
    }),
  ],
});
```

### Enviroment Variables

- `ENABLE_VC_BUILD` set to `1` .
- If you are using prisma: `DATABASE_URL` set to your `database url`.

### In Case You Are Using Prisma

i created a script that will copy prisma schema to the vercel output folder, if you are using different service please modify the `postbuild` script in `package.json` and make sure you copy the scheme to the output folder.

### You Are Done

Create a github repo and push your code to it, then deploy it to vercel (:
