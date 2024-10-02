Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        MODE: 'development',  // Mock variabel environment
        VITE_API_URL: 'https://portalapp.iconpln.co.id:5080/valiant-be/v1/', // Mock base URL jika diperlukan
        // Tambahkan mock untuk variabel env lain yang diperlukan
      },
    },
  },
});