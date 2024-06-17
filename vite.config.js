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
})
