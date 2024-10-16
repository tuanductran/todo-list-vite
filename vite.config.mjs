import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import million from 'million/compiler'
import { defineConfig } from 'vite'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    define: {
      'process.env': {
        VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      },
    },
    plugins: [
      // Million.js for optimizing React rendering
      million.vite({ auto: true }),
      // React plugin for Vite
      react(),
    ],
  }
})
