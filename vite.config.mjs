import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // React plugin for Vite
    react(),
  ],
  build: {
    target: "esnext", // Build targeting modern browsers for better performance
    sourcemap: true, // Enable source maps for easier debugging
  },
  server: {
    port: 5173, // Default port for local development
    open: true, // Open browser on server start
  },
});
