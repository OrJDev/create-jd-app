import { IUtil } from "~types";
import { getStyle } from "~utils/jsx";

const getBlogComp: IUtil = (ctx) => {
  const useTW = ctx.installers.includes("TailwindCSS");
  return `import { Component, lazy, Suspense } from "solid-js";

interface IBlogProps {}

const Blog: Component<IBlogProps> = ({}) => {
  const Markdown = lazy(() => import("../../blogs/example.mdx"));
  return (
    <Suspense
      fallback={
        <div${getStyle(useTW, "pt-16 grid place-items-center")}>
          <h1${getStyle(useTW, "font-bold text-3xl")}>Loading...</h1>
        </div>
      }
    >
      <Markdown />
    </Suspense>
  );
};

export default Blog;
`;
};

export default getBlogComp;
