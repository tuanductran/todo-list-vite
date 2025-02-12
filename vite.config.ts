import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [react(), UnoCSS()],
  };
});
