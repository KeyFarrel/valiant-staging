import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(() => {
  return {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      coverage: {
        exclude: ["node_modules/**", "**/*.test.ts"],
        reporter: ["text", "json", "html", "lcov"],
        reportsDirectory: "./coverage",
      },
      setupFiles: ['./vitest.setup.ts'],
      environment: "happy-dom",
    },
  };
});
