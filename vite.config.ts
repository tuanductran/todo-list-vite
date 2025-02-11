import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), UnoCSS()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    },
  };
});
