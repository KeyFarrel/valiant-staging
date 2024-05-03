import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'
import Inspect from 'vite-plugin-inspect'
import { visualizer } from 'rollup-plugin-visualizer'

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
    plugins: [
      vue(),
      vueJsx(),
      Inspect({
        build: true,
        outputDir: '.vite-inspect'
      }),
      visualizer({
        gzipSize: true,
        brotliSize: true,
        open: false,
        template: 'sunburst',
        filename: '.rollup-inspect/index.html'
      }),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          navigateFallback: undefined,
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          globPatterns: [
            "**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,wav,mp3,gltf,bin,eot,ttf,woff,woff2}",
          ],
          maximumFileSizeToCacheInBytes: 25097152,
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon-dark.svg'],
        manifest: {
          name: 'valiant',
          short_name: 'valiant',
          theme_color: '#ffffff',
          icons: [
            {
              src: "assets/img/Non-EBT.png",
            },
            {
              src: "assets/img/ebt.png",
            },
          ]
        },
        // workbox: {
        //   navigateFallback: '/',
        //   cleanupOutdatedCaches: true
        // },
        // client: {
        //   installPrompt: true,
        //   periodicSyncForUpdates: 20
        // },
        
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
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
  //server: {
 //   origin: 'http://127.0.0.1:8080'
 // }
})

