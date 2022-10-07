import { IUtil } from "~types";

const getTsConfig: IUtil = (ctx) => {
  const useMDX = ctx.installers.includes("MDX");
  return `{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "baseUrl": "./",
    "paths": {
      "~/*": ["./src/*"]${ctx.trpc ? ',\n      "@/*": ["./api/src/*"]' : ""}
    },
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "alwaysStrict": true,
    "noUnusedParameters": true,
    "allowUnreachableCode": false,
    "noUnusedLocals": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client"${useMDX ? `, "solid-jsx/types"` : ""}],
    "noEmit": true,
    "isolatedModules": true
  },
  "exclude": ["./scripts"]
}
`;
};

export default getTsConfig;
