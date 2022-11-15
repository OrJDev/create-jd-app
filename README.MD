# Create JD App

Create modern type safed Solid web application within seconds.

## Getting Started

```bash
npm create jd-app@latest
```

## Base Template

- [Solid Start](https://github.com/solidjs/solid-start)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [Zod](https://github.com/colinhacks/zod)

## Addons

- [Prisma](https://github.com/prisma/prisma)
- [tRPC](https://github.com/trpc/trpc)
- [TailwindCSS](https://github.com/tailwindlabs/tailwindcss)
- [UnoCSS](https://github.com/unocss/unocss)
- [Upstash Ratelimit](https://github.com/upstash/ratelimit)

### Examples

- [Hello World](https://github.com/OrJDev/solid-start-trpc-hello-world/)
- [JWT Authentication](https://github.com/OrJDev/solid-trpc-authentication)
- [Upstash RateLimit](https://github.com/OrJDev/solid-trpc-redis-example)

#### Preview

![Screenshot_1](https://user-images.githubusercontent.com/91349014/201010596-4578b981-4183-4197-be43-6e01ed582954.png)

### Folders And Why

#### /env

The env file isn't being used in any addon currently, might be used in the future. It adds nice type safety check and zod validation to your env, so it is recommended to use it in your code (can be used to store JWT secrets, etc).

- /env/client - Client side env - `imort.meta.env`
- /env/server - Server side env - `process.env`
- /env/schema - Schema for env - `Zod Client Schema & Zod Server Schema`

#### /server

The server folder is where you put all of your server side code (anything that will not be imported by client), you may see this folder when you use `tRPC` or `Prisma`.

- /server/trpc - tRPC server side code: routers, context, utils, etc.
- /server/db - `client.ts` = Where the prisma client is being created.
