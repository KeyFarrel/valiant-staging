import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd())
  
  // Only expose VITE_ prefixed variables to the client
  const exposedEnvs = Object.entries(env).reduce((acc, [key, val]) => {
    if (key.startsWith('VITE_')) {
      acc[`import.meta.env.${key}`] = JSON.stringify(val)
    }
    return acc
  }, {})
  
  // // Security enhancements for production builds
  const isProd = mode === 'production' || mode === 'staging'
  
  // // Helper untuk mengatur header security berdasarkan environment
  const getSecurityHeaders = () => {
    // Base headers untuk semua environment
    const baseHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
    
    // Headers tambahan yang lebih ketat untuk production
    if (isProd) {
      return {
        ...baseHeaders,
        'X-Frame-Options': 'SAMEORIGIN',
        'Access-Control-Allow-Origin': 'https://stg-portalvaliant.pln.co.id',
        'Access-Control-Allow-Credentials': 'true',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()',
        'X-DNS-Prefetch-Control': 'off',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self'; object-src 'none'; base-uri 'none'; img-src 'self' data: http: https: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'none'; form-action 'self'; block-all-mixed-content",
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      }
    }
    
    // Headers yang lebih longgar untuk development
    return {
      ...baseHeaders,
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*; connect-src 'self' http://localhost:* ws://localhost:* http://10.14.152.139:*; object-src 'none'; img-src 'self' data: http: https: blob:; style-src 'self' 'unsafe-inline'; font-src 'self'",
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    }
  }
  
  return {
    base: './',
    define: {
      ...exposedEnvs,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
      // Add build timestamp to prevent caching issues
      __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString())
    },
    // Build configuration
    build: {
      outDir: 'dist',
      // Exclude test files from the build
      rollupOptions: {
        external: isProd ? [
          /\.test\./,
          /\.spec\./,
          /\.cy\./,
          /\.e2e\./,
          /__tests__/,
          /__mocks__/
        ] : [],
        output: {
          // Strategi chunking yang lebih sederhana tapi tetap efektif
          manualChunks: isProd ? (id) => {
            // Core libraries (Vue, Router, Pinia)
            if (id.includes('node_modules/vue/') || 
                id.includes('node_modules/vue-router/') || 
                id.includes('node_modules/pinia/')) {
              return 'vendor-core';
            }
            
            // UI libraries
            if (id.includes('node_modules/element-plus/') || 
                id.includes('node_modules/vue3-') || 
                id.includes('node_modules/@vuepic/')) {
              return 'vendor-ui';
            }
            
            // Semua node_modules lainnya
            if (id.includes('node_modules/')) {
              return 'vendor-others';
            }
          } : undefined,
          // File naming
          entryFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          chunkFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          assetFileNames: isProd ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]'
        }
      },
      // Minify hanya di production
      minify: isProd ? 'esbuild' : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      } : undefined,
      // Source maps hanya di development
      sourcemap: !isProd,
      // Mengaktifkan optimasi CSS
      cssCodeSplit: true,
      // Mengaktifkan optimasi modul
      modulePreload: { polyfill: true },
      // Mengaktifkan optimasi asset
      assetsInlineLimit: 4096, // 4kb
      // Mengaktifkan optimasi chunk
      chunkSizeWarningLimit: 1000 // 1000kb
    },
    
    // Konfigurasi server development
    server:{
      port: 5173,
      headers: getSecurityHeaders()
    },
    
    // CSS preprocessor configuration
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    
    // Plugins
    plugins: [
      vue(),
      vueJsx(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          // Replace environment variables in HTML using %VARIABLE% syntax
          return html.replace(/%([^%]+)%/g, (match, p1) => {
            return env[p1] || '';
          });
        }
      },
    ],
    
    // Resolve aliases and extensionss
    resolve: {
      extensions: [
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
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})

