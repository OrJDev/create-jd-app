import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getIndexPage: IUtil = (ctx) => {
  const useTRPC = ctx.installers.includes("tRPC");
  const useStyled = ctx.installers.includes("Solid-Styled");
  const useTW = ctx.installers.includes("TailwindCSS") && !useStyled;
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
  }${useStyled ? '\nimport { css } from "solid-styled";' : ""}

export default function Home() {
${
  useTRPC
    ? `  const res = ${res}
  const mutExample = ${mutExample}

  onMount(() => {
    mutExample.mutateAsync({ num: 5 }).then(console.log);
  });
`
    : ""
}${
    useStyled
      ? `\n  css\`
    div {
      font-family: system-ui;
      font-weight: bold;
      color: darkgray;
    }
  \`;
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
