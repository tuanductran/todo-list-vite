import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
} satisfies Config
