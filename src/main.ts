import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { createThemeManager } from "./plugins/themeManager";
import { createPinia } from "pinia";
import { createVfm } from "vue-final-modal";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Vue3Lottie from "vue3-lottie";
import VueSweetAlert from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import PrimeVue from 'primevue/config';
import "aos/dist/aos.css";
import "./assets/main.css";
import "./assets/style.css";
import 'primevue/resources/themes/aura-light-green/theme.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import Wind from '@/presets/wind';
// window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = true;


const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue)
  .use(OpenLayersMap)
  .use(Vue3Toasity, { autoClose: false} as ToastContainerOptions)
  .use(Vue3Lottie)
  .use(autoAnimatePlugin)
  .use(createVfm)
  .use(VueSweetAlert)
  .use(ElementPlus)
  .component("VueDatePicker", VueDatePicker);
app.mount("#app");
