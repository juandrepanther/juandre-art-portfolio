import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

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
    alias: [
      { find: './runtimeConfig', replacement: './runtimeConfig.browser' },
      {
        find: 'assets',
        replacement: fileURLToPath(new URL('./src/assets', import.meta.url))
      },
      {
        find: 'data',
        replacement: fileURLToPath(new URL('./src/data', import.meta.url))
      },
      {
        find: 'hooks',
        replacement: fileURLToPath(new URL('./src/hooks', import.meta.url))
      },
      {
        find: 'lib',
        replacement: fileURLToPath(new URL('./src/lib', import.meta.url))
      },
      {
        find: 'pages',
        replacement: fileURLToPath(new URL('./src/pages', import.meta.url))
      },
      {
        find: 'shared',
        replacement: fileURLToPath(new URL('./src/shared', import.meta.url))
      },
      {
        find: 'tests',
        replacement: fileURLToPath(new URL('./src/tests', import.meta.url))
      },
      {
        find: 'utils',
        replacement: fileURLToPath(new URL('./src/utils', import.meta.url))
      }
    ]
  }
})
