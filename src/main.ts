import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia, getActivePinia } from "pinia";
import axios from "axios";
import { encryptStoragePromise, setDecryptFailureHandler } from "@/utils/app-encrypt-storage";
import AuthService from "@/services/auth-service";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Vue3Lottie from "vue3-lottie";
import lottie from "lottie-web/build/player/lottie_light";
import "go-captcha-vue/dist/style.css";
import GoCaptcha from "go-captcha-vue";

import "./assets/style.css";
import "./assets/main.css";

import { initXssProtection, sanitizeDirective } from "./utils/xssProtection";
import { initPathTraversalProtection } from "./utils/pathTraversalProtection";
import { initEnvProtection } from "./utils/envProtection";
import { initDevToolsRestriction } from "./utils/devToolsRestriction";

const nodeMode = import.meta.env.MODE;

const pinia = createPinia();
pinia.use(() => ({ _customProperties: new Set() }));

const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(Vue3Toastify, { autoClose: false })
  .use(Vue3Lottie, { player: lottie })
  .use(GoCaptcha)
  .directive("sanitize", sanitizeDirective);

initXssProtection();
initDevToolsRestriction();
initPathTraversalProtection();
initEnvProtection();

import { setupGlobalLoggerOverride, logger } from "./utils/logger";
import { secureEnv, isDevelopment } from "./utils/secureEnv";
setupGlobalLoggerOverride();

logger.info(`Application starting in ${nodeMode} mode`);

const appConfig = {
  apiUrl: secureEnv.VITE_API_URL || "",
  environment: nodeMode || "development",
};
app.config.globalProperties.$secureConfig = appConfig;
app.provide("secureConfig", appConfig);

import { decryptAES } from "./services/helper/encryption";
import { useSessionStore } from "@/store/storeSession";
import { notifyError } from "./services/helper/toast-notification";
import { useCsrfTokenStore } from "@/store/storeCsrfToken";
const sessionStore = useSessionStore(getActivePinia());
axios.interceptors.response.use(
  async (response: any) => {
    const csrfToken =
      response.headers["x-csrf-token"] || response.headers["X-Csrf-Token"] || response.headers["X-CSRF-Token"];
    if (csrfToken) {
      const csrfStore = useCsrfTokenStore(getActivePinia());
      csrfStore.setCsrfToken(csrfToken);
    }
    try {
      if (
        nodeMode !== "development" &&
        response.data.response &&
        typeof response.data.response === "string"
      ) {
        const decryptedData = await decryptAES(response.data.response);
        try {
          response.data = JSON.parse(decryptedData);
        } catch {
          response.data = decryptedData;
        }
      }
    } catch (error) {
      console.error("Failed to decrypt response:", error);
    }
    if (isDevelopment()) {
      logger.debug(`API Response: ${response.config.url}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response;
  },
  async (error) => {
    const currentRoute = router.currentRoute.value;

    if (
      nodeMode !== "development" &&
      error.response &&
      error.response.data &&
      error.response.data.response &&
      typeof error.response.data.response === "string"
    ) {
      try {
        const decryptedErrorData = await decryptAES(
          error.response.data.response,
        );
        console.log("decrypted error response", decryptedErrorData);
        try {
          error.response.data = JSON.parse(decryptedErrorData);
        } catch {
          error.response.data = decryptedErrorData;
        }
      } catch (decryptError) {
        console.error("Failed to decrypt error response:", decryptError);
      }
    }

    const isUnauthorized = error.response?.status === 401;
    const isUserNotRegistered = error.response?.data?.message === "User belum terdaftar pada aplikasi Valiant";
    const isLoginPage = currentRoute.name === "login";
    const isNetworkError = error.code === "ERR_NETWORK";
    const isRecordNotFound = error.response?.data?.message === "record not found";
    
    const ignoredNetworkUrl = "https://stg-be-valiant.pln.co.id/v1/mutasiasset/download/";
    const shouldIgnoreNetworkError = error.config?.url === ignoredNetworkUrl;

    if (isUnauthorized && !isUserNotRegistered && !isLoginPage) {
      console.log(
        "Unauthorized access detected, clearing storage and redirecting to login",
      );
      const encryptStorage = await encryptStoragePromise;
      if (nodeMode === "production" || nodeMode === "staging") {
        encryptStorage.clear();
      } else {
        localStorage.clear();
        logger.warn(
          "Unauthorized access detected, clearing storage and redirecting to login",
        );
      }
      sessionStore.invalidateSession();
      router.push({ name: "login" });
    } else if (isNetworkError && !shouldIgnoreNetworkError) {
      sessionStore.setErrNetwork();
      console.log("Network error detected, setting network error state", error);
      router.push({ name: "503" });
    } else if (
      error.response &&
      !isUnauthorized &&
      !isNetworkError &&
      !isLoginPage &&
      !isRecordNotFound
    ) {
      notifyError(
        `${error.response.data.message} ${error.response.data.uuid ?? 0}`,
        5000,
      );
    } else if (isDevelopment()) {
      console.log("API Error:", error);
      logger.error("API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

const loadCriticalResources = async () => {
  const OpenLayersMap = await import("vue3-openlayers");
  app.use(OpenLayersMap.default);
};

const loadNonEssentialResources = async () => {
  const [VueDatePicker, autoAnimatePlugin] = await Promise.all([
    import("@vuepic/vue-datepicker"),
    import("@formkit/auto-animate/vue").then((m) => m.autoAnimatePlugin),
  ]);

  await Promise.all([
    import("@vuepic/vue-datepicker/dist/main.css"),
  ]);

  app
    .use(autoAnimatePlugin)
    .component("VueDatePicker", VueDatePicker.default);

  console.log("Non-essential resources loaded");
};

(async () => {
  try {
    await loadCriticalResources();
  } catch (error) {
    console.error("Failed to load critical resources:", error);
  }

  app.mount("#app");

  setDecryptFailureHandler(async () => {
    try {
      const authService = new AuthService();
      const encryptStorage = await encryptStoragePromise;
      await authService.logout();
      nodeMode === 'production' || nodeMode === 'staging'
        ? encryptStorage.clear()
        : localStorage.clear();
      document.cookie.split(';').forEach(c => {
        document.cookie = c.trimStart().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      });
      sessionStore.invalidateSession();
      router.push({ name: 'login' });
    } catch {
      localStorage.clear();
      window.location.href = '/login';
    }
  });

  window.requestIdleCallback
    ? window.requestIdleCallback(async () => await loadNonEssentialResources())
    : setTimeout(() => loadNonEssentialResources(), 100);
})();
