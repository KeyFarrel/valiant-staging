import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  verbose: true,
  moduleFileExtensions: ["js", "ts", "vue", "json"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    // "^.+\\.json$": "jest-transform-stub",
    '^.+\\.json$': 'ts-jest',
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "node_modules/ts-jest-mock-import-meta", // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
              options: {
                metaObjectReplacement: {
                  env: {
                    MODE: "development", // Mock variabel environment
                    VITE_API_URL:
                      "https://portalapp.iconpln.co.id:5080/valiant-be/v1/", // Mock base URL jika diperlukan
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Ensure it points to the correct tsconfig file
      useESM: true, // Enable ESM in ts-jest
    },
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@vue/test-utils":
      "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js",
      '^vue3-toastify/dist/index.css$': '<rootDir>/src/__mocks__/styleMock.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    // '\\.(json)$': '<rootDir>/__mocks__/fileMock.js'
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  coverageReporters: ["text", "json-summary", "lcov"],
  transformIgnorePatterns: ["/node_modules/", "^.+\\.js$"],
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
