import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jest-environment-jsdom",
  verbose: true,
  clearMocks: true,
  moduleFileExtensions: ["js", "ts", "vue", "json", "mjs"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,ts,vue}",
    "<rootDir>/src/**/*.(test|spec).{js,ts,vue}",
    "<rootDir>/tests/**/*.{js,ts,vue}"
  ],
  maxWorkers: "50%",
  testTimeout: 10000,
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.(js|jsx|ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    MODE: "development",
                    VITE_API_URL: "https://portalapp.iconpln.co.id:5080/valiant-be/v1/",
                  },
                },
              },
            },
          ],
        },
      },
    ],
    "^.+\\.json$": "ts-jest",
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.ts',
    '!src/router/**',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,ts,vue}',
    '!src/**/*.spec.{js,ts,vue}',
    '!src/**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^vue3-toastify/dist/index.css$": "<rootDir>/src/__mocks__/styleMock.ts",
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.ts",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
    "^leaflet/dist/leaflet.css$": "<rootDir>/src/__mocks__/styleMock.ts",
    "^echarts/(.*)$": "<rootDir>/node_modules/echarts/$1",
    "^vue-router$": "vue-router",
    "^@vue/test-utils$": "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js",
  },
  coveragePathIgnorePatterns: [
    "/node_modules/", 
    "/tests/",
    "/__mocks__/",
    "/coverage/"
  ],
  coverageReporters: ["text", "json-summary", "lcov", "html"],
  transformIgnorePatterns: [
    "/node_modules/(?!vue-router|echarts|vue-echarts|zrender|@vue)/",
  ],
  // reporters: [
  //   "default",
  //   [
  //     "jest-junit",
  //     {
  //       outputDirectory: "./reports/junit",
  //       outputName: "junit.xml",
  //     },
  //   ],
  // ],
};

export default config;
