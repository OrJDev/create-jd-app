import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [solid({ ssr: false })],
    envDir: __dirname,
  };
});
