import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), UnoCSS()],
    server: {
      proxy: {
        "/api": {
          target: import.meta.env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
