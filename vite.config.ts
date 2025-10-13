import { defineConfig, loadEnv, Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath, URL } from "node:url";

function removeVersionSignatures(): Plugin {
  return {
    name: 'remove-version-signatures',
    transform(code, id) {
      if (id.includes('node_modules/core-js') || id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.vue')) {
        code = code.replace(/\/\*!\s*Core JS\s*([\d\.]+)\s*\*\//g, '/* Core JS */');
        code = code.replace(/\/\*![\s\S]*?@version[\s\S]*?\*\//g, '/* JS Library */');
        
        code = code.replace(/VERSION[\s]*[:=][\s]*['"]([\d\.]+)['"]/, 'VERSION = "0.0.0"');
        code = code.replace(/version[\s]*[:=][\s]*['"]([\d\.]+)['"]/, 'version = "0.0.0"');
        
        code = code.replace(/@version\s+([\d\.]+)/g, '@version 0.0.0');
        
        code = code.replace(/['"]core-js\/([\d\.]+)['"]/g, '"core-js/0.0.0"');
        code = code.replace(/require\(['"]core-js['"]\)/g, 'require("core-js-obfuscated")');
        code = code.replace(/from\s+['"]core-js['"]/, 'from "core-js-obfuscated"');
        
        code = code.replace(/['"](\d+\.\d+\.\d+(-[a-z0-9]+)?)['"]/g, '"0.0.0"');
      }
      return code;
    },
    transformIndexHtml(html) {
      html = html.replace(/<meta[^>]*generator[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*version[^>]*>/gi, '');
      
      return html.replace(/<head>/, '<head>\n  <!-- Core JS 0.0.0 -->');
    },
    generateBundle(options, bundle) {
      Object.keys(bundle).forEach(fileName => {
        const asset = bundle[fileName];
        if (fileName.endsWith('.js') && 'source' in asset) {
          let code = asset.source.toString();
          
          code = code.replace(/core-js@(\d+\.\d+\.\d+)/g, 'core-js@0.0.0');
          code = code.replace(/core-js\/(\d+\.\d+\.\d+)/g, 'core-js/0.0.0');
          code = code.replace(/"version":"(\d+\.\d+\.\d+)"/g, '"version":"0.0.0"');
          
          asset.source = code;
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const exposedEnvs = Object.entries(env).reduce((acc, [key, val]) => {
    if (key.startsWith("VITE_")) {
      acc[`import.meta.env.${key}`] = JSON.stringify(val);
    }
    return acc;
  }, {});

  const isProd = mode === "production" || mode === "staging";
  console.log("🔍 isProd:", isProd, mode);

  const getSecurityHeaders = () => {
    const baseHeaders = {
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };

    if (isProd) {
      return {
        ...baseHeaders,
        "X-Frame-Options": "SAMEORIGIN",
        "Access-Control-Allow-Origin": "http://10.14.152.139:30051",
        "Access-Control-Allow-Credentials": "true",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security":
          "max-age=63072000; includeSubDomains; preload",
        "Permissions-Policy":
          "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()",
        "X-DNS-Prefetch-Control": "off",
        "Cross-Origin-Resource-Policy": "same-origin",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      };
    }

    return {
      ...baseHeaders,
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Credentials": "true",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    };
  };

  return {
    base: "./",
    define: {
      ...exposedEnvs,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
      __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
    },

    build: {
      outDir: "dist",
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          // drop_console: true,
          drop_debugger: true,
          keep_fnames: true,
          keep_classnames: true
        },
        format: {
          comments: false
        },
        mangle: {
          keep_fnames: true,
          keep_classnames: true,
          properties: false
        }
      },

      rollupOptions: {
        external: isProd
          ? [
              /\.test\./,
              /\.spec\./,
              /\.cy\./,
              /\.e2e\./,
              /__tests__/,
              /__mocks__/,
            ]
          : [],
        output: {
          entryFileNames: isProd
            ? "assets/js/[hash].js"
            : "assets/[name].js",
          chunkFileNames: isProd
            ? "assets/js/[hash].js"
            : "assets/[name].js",
          assetFileNames: isProd
            ? "assets/[ext]/[hash].[ext]"
            : "assets/[name].[ext]",
        },
      },

      cssCodeSplit: true,

      modulePreload: { polyfill: true },

      assetsInlineLimit: 4096,

      chunkSizeWarningLimit: 1000,
    },

    server: {
      port: 5173,
      headers: getSecurityHeaders(),
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
      removeVersionSignatures(),
      {
        name: "vite-plugin-html",
        transformIndexHtml(html) {
          html = html.replace(/<meta[^>]*generator[^>]*>/gi, '');
          html = html.replace(/<meta[^>]*version[^>]*>/gi, '');
          html = html.replace(/<meta[^>]*http-equiv=["']X-Frame-Options["'][^>]*>/gi, '');
          html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '');
          html = html.replace(/<meta[^>]*http-equiv=["']X-XSS-Protection["'][^>]*>/gi, '');
          html = html.replace(/<meta[^>]*http-equiv=["']Strict-Transport-Security["'][^>]*>/gi, '');
          
          const safeHeaders = {
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-Content-Type-Options": "nosniff",
            "X-DNS-Prefetch-Control": "off"
          };
          
          return html.replace(
            /<head>/,
            `<head>\n${Object.entries(safeHeaders)
              .map(([key, val]) => `  <meta http-equiv="${key}" content="${val}">`)
              .join("\n")}`
          );
        },
      },
      isProd ? {
        name: 'js-obfuscator',
        enforce: 'post' as const,
        apply: 'build' as const,
        transformIndexHtml(html) {
          return html.replace(/<!--[\s\S]*?-->/g, '');
        },
        generateBundle(options, bundle) {
          Object.keys(bundle).forEach(fileName => {
            const asset = bundle[fileName];
            if (fileName.endsWith('.js') && 'source' in asset) {
              let code = asset.source.toString();
              
              code = code.replace(/\/\*!\s*Core JS\s*([\d\.]+)\s*\*\//g, '');
              code = code.replace(/\/\*![\s\S]*?\*\//g, '');
              
              code = code.replace(/VERSION[\s]*[:=][\s]*['"]([\d\.]+)['"]/, 'VERSION=""');
              code = code.replace(/version[\s]*[:=][\s]*['"]([\d\.]+)['"]/, 'version=""');
              
              code = code.replace(/@version\s+([\d\.]+)/g, '@version');
              code = code.replace(/core-js\/([\d\.]+)/g, 'core-js/x');
              
              code = code.replace(/['"](\d+\.\d+\.\d+(-[a-z0-9]+)?)['"]/g, '"0.0.0"');
              
              code = code.replace(/core-js-pure/g, 'core-js-x');
              code = code.replace(/core-js-compat/g, 'core-js-x');
              
              asset.source = code;
            }
          });
        }
      } : null,
    ].filter(Boolean),

    resolve: {
      extensions: [
        ".mjs",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".vue",
        ".scss",
      ],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    test: {
      environment: 'happy-dom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/__test__/unit/**/*.test.ts'],
      globals: true,
      coverage: {
        provider: "v8",
        reporter: [
          ["lcov", { projectRoot: "./src" }],
          ["json", { file: "coverage.json" }],
          ["text"],
        ],
      },
    },
  };
});
