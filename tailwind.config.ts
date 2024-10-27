import tailwindFroms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'selector',
  theme: {
    extend: {},
  },
  plugins: [tailwindFroms],
} satisfies Config
