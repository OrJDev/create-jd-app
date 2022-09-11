## Deploying to vercel via repo

### Client

Import the project from github, set the ROOT DIRECTORY to apps/client & modify the build settings (see below).

#### Build Command

```bash
cd ../../ && npx turbo run build --filter=client
```

#### Install Command

```bash
npm install --prefix=../../
```

### Server

Import the same project from github (make sure you change the project name because vercel doesn't allow duplicates), set the ROOT DIRECTORY to apps/server & modify the build settings (see below).

#### Build Command

```bash
cd ../../ && npx turbo run build --filter=server
```

#### Install Command

```bash
npm install --prefix=../../
```

#### Example

![Preview](https://i.ibb.co/G2rZ14B/Screenshot-1.png)