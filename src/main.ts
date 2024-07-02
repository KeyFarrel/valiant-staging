import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { createPinia } from "pinia";
import { createVfm } from "vue-final-modal";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Vue3Lottie from "vue3-lottie";
import "aos/dist/aos.css";
import "./assets/main.css";
import "./assets/style.css";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(OpenLayersMap)
  .use(Vue3Toasity, { autoClose: false} as ToastContainerOptions)
  .use(Vue3Lottie)
  .use(autoAnimatePlugin)
  .use(createVfm)
  .use(ElementPlus)
  .component('VueDatePicker', VueDatePicker);

app.mount("#app");
