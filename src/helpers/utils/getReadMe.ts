import type { IEnv, IUtil } from "~types";

const getReadMe: IUtil<IEnv[]> = (ctx, passed = []) => {
  const envContent = `### Enviroment Variables

${passed
  .filter((env) => !env.ignore || env.key === "ENABLE_VC_BUILD")
  .map((env) => `- \`${env.key}\`=${env.defaulValue ?? ""}`)
  .join("\n")}  
  `;
  const runCmd = ctx.pkgManager === "pnpm" ? "" : " run";
  return `This project was created using [Create JD App](https://github.com/OrJDev/create-jd-app)

## Start Dev Server

\`\`\`bash
${ctx.pkgManager}${runCmd} dev
\`\`\`

This will start a dev server on port \`3000\` and will watch for changes.

## Testing Production Build

### Build

\`\`\`bash
${ctx.pkgManager}${runCmd} build
\`\`\`

### Start

\`\`\`bash
${ctx.pkgManager}${runCmd} start
\`\`\`

This will start a production server on port \`3000\`.
${
  ctx.vercel === "Cli"
    ? `\n## Deploying To Vercel

### Building

\`\`\`bash
  vercel build --prod
\`\`\`
  
### Deploying 

\`\`\`bash
vercel deploy --prod --prebuilt
\`\`\``
    : ""
}
${envContent}
[Sponsor Create JD App](https://github.com/sponsors/OrJDev)
`;
};

export default getReadMe;
