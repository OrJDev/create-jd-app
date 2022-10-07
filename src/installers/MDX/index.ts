import { IInstaller } from "~types";

const config: IInstaller = (ctx) => ({
  files: [
    {
      path: `${__dirname}/files/viteConfig.txt`,
      to: `${ctx.userDir}/vite.config.ts`,
    },
    {
      path: `${__dirname}/files/mdxConfig.txt`,
      to: `${ctx.userDir}/mdx.config.ts`,
    },
    {
      path: `${__dirname}/files/blogExample.txt`,
      to: `${ctx.userDir}/src/blogs/example.mdx`,
    },
    {
      path: `${__dirname}/utils/getBlogComp`,
      to: `${ctx.userDir}/src/pages/Blog/Blog.tsx`,
      type: "exec",
    },
    {
      to: `${ctx.userDir}/src/pages/Blog/index.ts`,
      type: "write",
      content: 'export { default } from "./Blog";',
    },
    {
      to: `${ctx.userDir}/src/pages/index.ts`,
      type: "append",
      content: 'export { default as Blog } from "./Blog";',
    },
  ],
  pkgs: [
    "@mdx-js/rollup",
    "rehype-autolink-headings",
    "rehype-code-titles",
    "rehype-mathjax",
    "rehype-prism",
    "rehype-slug",
    "remark-frontmatter",
    "remark-gemoji",
    "remark-gfm",
    "remark-lint",
    "remark-math",
    "remark-mdx",
    "remark-mdx-frontmatter",
    "remark-toc",
    "solid-jsx",
    "solid-mdx",
  ],
});

export default config;
