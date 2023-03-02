import { defineConfig } from "astro/config";
import _remarkTwoslash from "remark-shiki-twoslash";
import solidJs from "@astrojs/solid-js";
import mdx from "@astrojs/mdx";
const twoSlashPlugin = _remarkTwoslash.default ?? _remarkTwoslash;

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  markdown: {
    // Applied to .md and .mdx files
    // This import is scuffed bro, that is because of the way TwoSlash works
    remarkPlugins: [[twoSlashPlugin, {
      theme: "dark-plus"
    }]]
  },
  integrations: [mdx(), solidJs()],
  site: `https://sheesh.com`
});