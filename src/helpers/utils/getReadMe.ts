import { IUtil } from "~types";
import { getUserPackageManager } from "~utils/helpers";

const getReadMe: IUtil = (ctx) => {
  const pkg = getUserPackageManager();
  const usePrisma = ctx.installers.includes("Prisma");
  return `# Create JD App

This project was created using [Create JD App](https://github.com/OrJDev/create-jd-app)

## Deploying To Vercel

### Installing

\`\`\`bash
${pkg} ${pkg === "yarn" ? "add" : "install"} solid-start-vercel@latest -D
\`\`\`

### Adding to vite config

\`\`\`ts
import solid from "solid-start/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";
// @ts-expect-error no typing
import vercel from "solid-start-vercel";

export default defineConfig(() => {
  dotenv.config();
  return {
    plugins: [solid({ ssr: false, adapter: vercel({ edge: false }) })],
  };
});
\`\`\`

### Enviroment Variables

- \`ENABLE_VC_BUILD\`=\`1\` .${
    usePrisma ? "\n- `DATABASE_URL`=`your database url` ." : ""
  }${
    !ctx.vercel && usePrisma
      ? `\n\n### PostBuild Script

I created a script that will copy Prisma schema to the vercel output folder, if you are using different service please modify the \`postbuild\` script in \`package.json\` and make sure you copy the scheme to the output folder.`
      : ""
  }

### You Are Done

Create a github repo and push your code to it, then deploy it to vercel (:
`;
};

export default getReadMe;
