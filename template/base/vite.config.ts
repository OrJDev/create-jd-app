import solid from "solid-start/vite";
import dotenv from "dotenv";
import { defineConfig } from "vite";

export default defineConfig(() => {
  dotenv.config();
  return {
    plugins: [solid({ ssr: false })],
  };
});
