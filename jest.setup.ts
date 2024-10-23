// jest.setup.ts

// Mock `import.meta.env` for Jest testing
globalThis.import = {
  meta: {
    env: {
      MODE: "development", // Mock environment variables as needed
      VITE_API_URL: "https://portalapp.iconpln.co.id:5080/valiant-be/v1/", // Mock base URL if needed
      BASE_URL: '/', // Mock BASE_URL as used in your router
    },
  },
};

// Other setup tasks if needed
