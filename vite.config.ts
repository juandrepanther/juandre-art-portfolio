import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  // root: '/src',
  server: {
    //if you need to test on your mobile, then uncomment code line below
    // host: false,
    // open: true,
    // cors: false,
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // },
    port: 3001
  },

  // define: {
  //   global: 'globalThis'
  //   // global: {}
  // },
  base: '/juandre-art-portfolio/',
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        sourcemap: false
        // manualChunks: (id) => {
        //   if (id.includes('node_modules')) {
        //     if (id.includes('three')) {
        //       return 'vendor_three'
        //     } else if (id.includes('@mui')) {
        //       return 'vendor_mui'
        //     } else if (id.includes('leva')) {
        //       return 'vendor_leva'
        //     } else if (id.includes('r3f-perf')) {
        //       return 'vendor_r3f-perf'
        //     } else if (id.includes('stats-js')) {
        //       return 'vendor_stats-js'
        //     } else if (id.includes('stats.js')) {
        //       return 'vendor_stats.js'
        //     } else if (id.includes('@react-three/drei' || 'drei')) {
        //       return 'vendor_@react-three/drei'
        //     }
        //     return 'mainChunk'
        //   }
        // }
      }
    }
  },
  resolve: {
    alias: [{ find: './runtimeConfig', replacement: './runtimeConfig.browser' }]
  }
})
