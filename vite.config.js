/* eslint-disable */
const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')

module.exports = defineConfig({
  plugins: [react({
    babel: {
      plugins: [
        ["babel-plugin-react-compiler"],
      ],
    },
  })],
  define: {
    "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
    "process.env.PUBLIC_URL": process.env.NODE_ENV === 'production'
      ? '"https://point-picker.basketbears.com"'
      : '"http://localhost:5173"'
  }
})
