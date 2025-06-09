import { defineConfig } from "eslint-define-config";

export default defineConfig([
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    languageOptions: {
      ecmaVersion: "latest",
    },
    plugins: ["vue"],
    extends: [
      "plugin:vue/vue3-essential",
      "eslint:recommended",
      "@vue/eslint-config-typescript",
      "@vue/eslint-config-prettier/skip-formatting",
    ],
  },
]);
