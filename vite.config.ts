import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  server: {
    port: 3001
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        sourcemap: false
      }
    }
  },
  resolve: {
    alias: [{ find: './runtimeConfig', replacement: './runtimeConfig.browser' }]
  }
})
