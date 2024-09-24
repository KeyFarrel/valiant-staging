import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

const path = require('path')
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: './',
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
    server:{
      port: 5173
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
    ],
    resolve: {
      extensions: [
        '.spec.ts',
        '.test.ts',
        '.mjs',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.vue',
        '.scss'
      ],
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})

