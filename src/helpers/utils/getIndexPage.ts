import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getIndexPage: IUtil = (ctx) => {
  const useTRPC = ctx.installers.includes("tRPC");
  const useTW = ctx.installers.includes("TailwindCSS");
  return `import { onMount } from "solid-js";
import { trpc } from "~/utils/trpc";

export default function Home() {
${
  useTRPC
    ? `  const res = trpc.createQuery(() => ["example.hello", { name: "from tRPC" }]);
  const mutExample = trpc.createMutation(() => ["example.random"]);
  onMount(() => {
    mutExample.mutateAsync({ num: 5 }).then(console.log);
  });`
    : ""
}
  return <div${getStyle(useTW, "font-bold text-2xl text-gray-500")}>${
    useTRPC ? `{res.isLoading ? "loading" : res.data}` : "Hey There"
  }</div>;
}
`;
};

export default getIndexPage;
