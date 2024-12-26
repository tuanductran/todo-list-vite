import { presetForms } from "@julr/unocss-preset-forms";
import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno({
      dark: "media",
    }),
    presetAttributify(),
    presetForms(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
