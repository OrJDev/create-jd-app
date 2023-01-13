import type { IUtil } from "~types";

const getReadMe: IUtil = (ctx) => {
  const usePrisma = ctx.installers.includes("Prisma");
  return `# Create JD App

This project was created using [Create JD App](https://github.com/OrJDev/create-jd-app)

${
  ctx.vercel
    ? `## Deploying To Vercel
${
  ctx.vercel === "Cli"
    ? `
### Building

\`\`\`bash
  vercel build --prod
\`\`\`
  
### Deploying 

\`\`\`bash
vercel deploy --prod --prebuilt
\`\`\``
    : `### You Are Done
Create a github repo and push your code to it, then deploy it to vercel (:`
}
  
### Enviroment Variables
  
- \`ENABLE_VC_BUILD\`=\`1\` .${
        usePrisma ? "\n- `DATABASE_URL`=`your database url` ." : ""
      }
`
    : ""
}
`;
};

export default getReadMe;
