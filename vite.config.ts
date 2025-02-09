import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // React plugin for Vite
    react(),
    // UnoCSS plugin for Vite
    UnoCSS(),
  ],
});
