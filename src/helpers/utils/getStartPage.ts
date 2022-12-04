import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getStartPage: IUtil = (ctx) => {
  const useStyles =
    ctx.installers.includes("TailwindCSS") || ctx.installers.includes("UnoCSS");
  const useTRPC = ctx.installers.includes("tRPC");
  return `import type { VoidComponent } from "solid-js";${
    useTRPC ? '\nimport { useQueryClient } from "@tanstack/solid-query";' : ""
  }

const App: VoidComponent = () => {${
    useTRPC
      ? `\n  // you can use the trpc client like this: trpc.hello.useQuery(()=> "input")\n  // modify the trpc url and appRouter type to get it to work \n  const queryClient = useQueryClient();`
      : ""
  }
  return (
    <p${getStyle(useStyles, "text-4xl text-green-700 text-center py-20")}>
${getInnerP(useTRPC)}    
    </p>
  );
};

export default App;
`;
};

const getInnerP = (useTRPC?: boolean) => {
  if (useTRPC) {
    return `      The query client is an object?{" "}
      {typeof queryClient === "object" ? "Yes" : "No"}`;
  }
  return `      Hey there pal`;
};

export default getStartPage;
