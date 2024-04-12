import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
} satisfies Config
