import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import axios from "axios";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import Vue3Lottie from "vue3-lottie";
import lottie from "lottie-web/build/player/lottie_light";
import "go-captcha-vue/dist/style.css"
import GoCaptcha from "go-captcha-vue"

import "./assets/style.css";
import "./assets/main.css";

import { initXssProtection, sanitizeDirective } from "./utils/xssProtection";
import { bruteForceProtection } from "./utils/bruteForceProtection";
import { initPathTraversalProtection } from "./utils/pathTraversalProtection";
import { registerFileValidation } from "./utils/fileUploadValidation";
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

registerFileValidation(app);

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
axios.interceptors.response.use(
  async (response: any) => {
    try {
      if (
        response.data.response &&
        typeof response.data.response === "string"
      ) {
        const decryptedData = await decryptAES(response.data.response);
        try {
          response.data.response = JSON.parse(decryptedData);
        } catch {
          response.data.response = decryptedData;
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
    console.log(error, "ERROR");
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message !==
        "User belum terdaftar pada aplikasi Valiant"
    ) {
      const encryptStorage = await encryptStoragePromise;
      if (nodeMode === "production" || nodeMode === "staging") {
        encryptStorage.clear();
      } else {
        localStorage.clear();
        logger.warn(
          "Unauthorized access detected, clearing storage and redirecting to login",
        );
      }
      router.push({ name: "login" });
    } else if (isDevelopment()) {
      logger.error("API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  },
);

const loadNonEssentialResources = async () => {
  const [
    ElementPlus,
    VueDatePicker,
    VueCookies,
    autoAnimatePlugin,
    OpenLayersMap,
  ] = await Promise.all([
    import("element-plus"),
    import("@vuepic/vue-datepicker"),
    import("vue-cookies"),
    import("@formkit/auto-animate/vue").then((m) => m.autoAnimatePlugin),
    import("vue3-openlayers"),
  ]);

  await Promise.all([
    import("@vuepic/vue-datepicker/dist/main.css"),
    import("element-plus/dist/index.css"),
    import("aos/dist/aos.css"),
  ]);

  app
    .use(ElementPlus.default)
    .use(VueCookies.default, {
      expires: "7d",
      sameSite: "Strict",
      secure: true,
    })
    .use(autoAnimatePlugin)
    .use(OpenLayersMap.default)
    .component("VueDatePicker", VueDatePicker.default)

  console.log("Non-essential resources loaded");
};


(async () => {
  window.requestIdleCallback
    ? window.requestIdleCallback(async () => await loadNonEssentialResources())
    : setTimeout(() => loadNonEssentialResources(), 100);

  app.mount("#app");
})();
