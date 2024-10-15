/** @type {import('postcss').Postcss} */
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-lightningcss': {
      browsers: '>= .25%',
    },
    'tailwindcss': {},
    'tailwindcss/nesting': {},
  },
}
