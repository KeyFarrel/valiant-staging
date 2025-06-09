import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import axios from "axios";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";

// Impor CSS dasar yang diperlukan untuk rendering awal
import "./assets/style.css";
import "./assets/main.css";

// Separating essential and non-essential resources
// Essential components that are used in templates must be loaded before mounting the app
const loadEssentialResources = async () => {
  // Essential UI Libraries that are used in templates immediately
  const [Vue3Lottie, GoCaptcha] = 
    await Promise.all([
      import('vue3-lottie'),
      import('go-captcha-vue')
    ]);
  
  // Register essential plugins needed for initial render
  app
    .use(Vue3Lottie.default)
    .use(GoCaptcha.default);
    
  console.log('Essential resources loaded');
  return { Vue3Lottie, GoCaptcha };
};

// Non-essential resources can be loaded after app is mounted
const loadNonEssentialResources = async () => {
  // UI Libraries that can be loaded later
  const [Vue3Toasity, ElementPlus, VueDatePicker, VueCookies, autoAnimatePlugin, OpenLayersMap] = 
    await Promise.all([
      import('vue3-toastify'),
      import('element-plus'),
      import('@vuepic/vue-datepicker'),
      import('vue-cookies'),
      import('@formkit/auto-animate/vue').then(m => m.autoAnimatePlugin),
      import('vue3-openlayers')
    ]);
  
  // CSS imports
  await Promise.all([
    import('vue3-toastify/dist/index.css'),
    import('@vuepic/vue-datepicker/dist/main.css'),
    import('element-plus/dist/index.css'),
    import('go-captcha-vue/dist/style.css'),
    import('aos/dist/aos.css')
  ]);
  
  // Register plugins that aren't needed for initial render
  app
    .use(Vue3Toasity.default, { autoClose: false } as Vue3Toasity.ToastContainerOptions)
    .use(ElementPlus.default)
    .use(VueCookies.default, { expires: '7d', sameSite: 'Strict', secure: true })
    .use(autoAnimatePlugin)
    .use(OpenLayersMap.default)
    .component('VueDatePicker', VueDatePicker.default);
    
  console.log('Non-essential resources loaded');
};

// Import security protection utilities
import { initXssProtection, sanitizeDirective, sanitizeInput, sanitizeUrl } from "./utils/xssProtection";
import { bruteForceProtection } from "./utils/bruteForceProtection";
import { initPathTraversalProtection } from "./utils/pathTraversalProtection";
import { registerFileValidation } from "./utils/fileUploadValidation";


const nodeMode = import.meta.env.MODE;

axios.interceptors.response.use(
  async (response: any) => {
    try {
      // Check if response data is encrypted (you might need to adjust this logic based on your API)
      if (response.data.response && typeof response.data.response === 'string') {
        // Decrypt the response data
        const decryptedData = await decryptAES(response.data.response);
        // Try to parse as JSON if it's supposed to be JSON
        try {
          response.data.response = JSON.parse(decryptedData);
        } catch {
          // If it's not valid JSON, just set the decrypted string
          response.data.response = decryptedData;
        }
      }
    } catch (error) {
      console.error('Failed to decrypt response:', error);
    }
    console.log("Response:", response);
    // Log successful responses only in development mode
    if (isDevelopment()) {
      logger.debug(`API Response: ${response.config.url}`, {
        status: response.status,
        statusText: response.statusText
      });
    }
    return response;
  },
  async (error) => {
    console.log(error, "ERROR");
    if (error.response && error.response.status === 401 && error.response.data.message !== "User belum terdaftar pada aplikasi Valiant") {
      const encryptStorage = await encryptStoragePromise;
      if (nodeMode === "production" || nodeMode === "staging") {
        encryptStorage.clear(); 
      } else {
        localStorage.clear();
        // Only log in development mode
        logger.warn('Unauthorized access detected, clearing storage and redirecting to login');
      }
      router.push({ name: 'login' });
    } else if (isDevelopment()) {
      // Only log errors in development mode
      logger.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

// Import secure utilities
import { initDevToolsRestriction } from "./utils/devToolsRestriction";
import { secureEnv, isDevelopment } from "./utils/secureEnv";
import { initEnvProtection } from "./utils/envProtection";
import { logger, setupGlobalLoggerOverride } from "./utils/logger";
import { decryptAES } from './services/helper/encryption';

// Configure application to use secure environment variables
// This prevents exposure of sensitive information
const appConfig = {
  apiUrl: secureEnv.VITE_API_URL || '',
  environment: secureEnv.NODE_ENV || 'development'
};

// Create Pinia instance with debug disabled
const pinia = createPinia();
// Disable Pinia debug logs
pinia.use(() => ({ _customProperties: new Set() }));

const app = createApp(App)
  .use(pinia)
  .use(router)
  .directive('sanitize', sanitizeDirective); // Register the sanitize directive for automatic HTML sanitization

// Register file validation directive
registerFileValidation(app);

// Initialize security protections
initDevToolsRestriction();
initEnvProtection();
initXssProtection(); // Initialize comprehensive XSS protection
initPathTraversalProtection(); // Initialize path traversal protection

// Set up logging based on environment
setupGlobalLoggerOverride();

// Log application startup only in development mode
logger.info(`Application starting in ${secureEnv.NODE_ENV} mode`);

// Make secure configuration available to the application
app.config.globalProperties.$secureConfig = appConfig;

// Provide secure configuration to the application
app.provide('secureConfig', appConfig);

// Load essential resources first, then mount the app
(async () => {
  await loadEssentialResources();
  
  // Mount aplikasi setelah resource esensial dimuat
  app.mount('#app');

  // Setelah aplikasi dimuat, muat resource yang tidak esensial
  // Ini akan meningkatkan First Contentful Paint (FCP) dan Time to Interactive (TTI)
  window.requestIdleCallback ? 
    window.requestIdleCallback(() => loadNonEssentialResources()) : 
    setTimeout(() => loadNonEssentialResources(), 100);
})();
