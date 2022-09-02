import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      { find: "vite-react-async-router", replacement: resolve(__dirname, "../../dist/index.js") },
    ],
  },
  plugins: [react()],
})
