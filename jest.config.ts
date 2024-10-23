import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jest-environment-jsdom",
  verbose: true,
  // maxWorkers: 2,
  // watchman: false,
  // forceExit: true,
  // testTimeout: 30000,
  moduleFileExtensions: ["js", "ts", "vue", "json", "mjs"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    // "^.+\\.json$": "jest-transform-stub",
    "^.+\\.json$": "ts-jest",
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    // {
    //   useESM: true,
    //   diagnostics: {
    //     ignoreCodes: [1343],
    //   },
    //   astTransformers: {
    //     before: [
    //       {
    //         path: "node_modules/ts-jest-mock-import-meta", // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
    //         options: {
    //           metaObjectReplacement: {
    //             env: {
    //               MODE: "development", // Mock variabel environment
    //               VITE_API_URL:
    //                 "https://portalapp.iconpln.co.id:5080/valiant-be/v1/", // Mock base URL jika diperlukan
    //             },
    //           },
    //         },
    //       },
    //     ],
    //   },
    // },
  },
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   'src/**/*.{js,ts,vue}',  // Pastikan semua file di src diambil untuk coverage
  //   '!src/main.ts',           // Abaikan file yang tidak perlu, seperti main.ts
  //   '!src/router/**',         // Abaikan file router jika tidak perlu
  // ],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@vue/test-utils":
      "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js",
    "^vue3-toastify/dist/index.css$": "<rootDir>/src/__mocks__/styleMock.ts",
    "\\.(css|less|scss|sass)$": "<rootDir>/node_modules/identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
    "^leaflet/dist/leaflet.css$": "<rootDir>/src/__mocks__/styleMock.ts",  
    "^echarts/(.*)$": "<rootDir>/node_modules/echarts/$1",
    "^vue-router$": "<rootDir>/node_modules/vue-router/dist/vue-router.esm-bundler.js", // Point to the ESM version of vue-router
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  coverageReporters: ["text", "json-summary", "lcov"],
  transformIgnorePatterns: [
    // "/node_modules/(?!.*\\.mjs$)", // Jangan abaikan file .mjs dalam node_modules
    "/node_modules/(?!vue-router|echarts|vue-echarts|zrender)/",
  ],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./reports/junit",
        outputName: "junit.xml",
      },
    ],
  ],
};

export default config;
