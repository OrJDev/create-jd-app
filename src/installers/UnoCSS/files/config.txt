import { defineConfig, transformerVariantGroup  } from "unocss";

export default defineConfig({
  transformers: [transformerVariantGroup()],
});
