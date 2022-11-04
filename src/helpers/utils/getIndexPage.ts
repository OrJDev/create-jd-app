import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getIndexPage: IUtil = (ctx) => {
  const useTRPC = ctx.installers.includes("tRPC");
  const useTW = ctx.installers.includes("TailwindCSS");
  const res =
    ctx.trpcVersion === "V10"
      ? `trpc.hello.useQuery({ name: "from tRPC" });`
      : `trpc.createQuery(() => ["example.hello", { name: "from tRPC" }]);`;
  const mutExample =
    ctx.trpcVersion === "V10"
      ? `trpc.random.useMutation();`
      : `trpc.createMutation(() => ["example.random"]);`;

  return `import { onMount } from "solid-js";${
    useTRPC ? '\nimport { trpc } from "~/utils/trpc";' : ""
  }

export default function Home() {${
    useTRPC
      ? `\n  const res = ${res}
  const mutExample = ${mutExample}

  onMount(() => {
    mutExample.mutateAsync({ num: 5 }).then(console.log);
  });
`
      : ""
  }
  return <div${getStyle(useTW, "font-bold text-2xl text-gray-500")}>${
    useTRPC ? `{res.isLoading ? "loading" : res.data}` : "Hey There"
  }</div>;
}
`;
};

export default getIndexPage;
