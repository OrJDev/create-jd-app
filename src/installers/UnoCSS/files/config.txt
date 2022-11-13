import { defineConfig } from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  transformers: [transformerVariantGroup()],
});
