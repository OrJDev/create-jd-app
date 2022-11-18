import solid from "solid-start/vite";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import dotenv from "dotenv";

export default defineConfig(() => {
  dotenv.config();
  return {
<<<<<<< HEAD
    plugins: [solid({ ssr: true })],
=======
    plugins: [solid({ ssr: false })],
>>>>>>> 88a4a00418f8cf9b23c66d8e4fdb215b8d0007fc
  };
});
