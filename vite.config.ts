import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import UnoCSS from "unocss/vite";
import { defineConfig, loadEnv } from "vite";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), UnoCSS()],
    define: {
    "process.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
  },
  };
});
