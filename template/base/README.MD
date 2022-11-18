# Create JD App

This project was created using [Create JD App](https://github.com/OrJDev/create-jd-app)

# Deploying

### Vercel Adapter (or any other adapter)

#### Installing

```bash
npm install -D solid-start-vercel@latest
```

#### Adding to vite config

```ts
import solid from "solid-start/vite";
import { defineConfig } from "vite";
// @ts-ignore
import vercel from "solid-start-vercel";
import dotenv from "dotenv";

export default defineConfig(() => {
  dotenv.config();
  return {
    plugins: [solid({ ssr: false, adapter: vercel({ edge: false }) })],
  };
});
```

### Enviroment Variables

- `ENABLE_VC_BUILD` set to `1` .
- If you are using prisma: `DATABASE_URL` set to your `database url`.

### In Case You Are Using Prisma

i created a script that will copy prisma schema to the vercel output folder, if you are using different service please modify the `postbuild` script in `package.json` and make sure you copy the scheme to the output folder.

### You Are Done

Create a github repo and push your code to it, then deploy it to vercel (:
