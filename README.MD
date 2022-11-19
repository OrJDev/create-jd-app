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
- [Solid Auth](https://github.com/orjdev/solid-auth)

#### Preview

![Screenshot_1](https://user-images.githubusercontent.com/91349014/201010596-4578b981-4183-4197-be43-6e01ed582954.png)

### Folders And Why

#### /env

It adds nice type safety check and zod validation to your env (both client and server), so it is recommended to use it in your code (can be used to store JWT secret, etc).

- /env/client - Client side env - `imort.meta.env`
- /env/server - Server side env - `process.env`
- /env/schema - Schema for env - `Zod Client Schema & Zod Server Schema`

#### /server

The server folder is where you put all of your server side code (anything that will not be imported by client), you may see this folder when you use `tRPC` or `Prisma`.

- /server/trpc - tRPC server side code: routers, context, utils, etc.
- /server/db - `client.ts` = Where the prisma client is being created.

This project was inspired by [create t3 app](https://github.com/t3-oss/create-t3-app) and was created in order to make it easier to create a solid app. (and replace `npm init solid`)
