import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { createPinia } from "pinia";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import { install } from "vue3-recaptcha-v2";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css";
import VueDatePicker from '@vuepic/vue-datepicker'
import VueCookies from 'vue-cookies'
import '@vuepic/vue-datepicker/dist/main.css'
import Vue3Lottie from "vue3-lottie";
import "aos/dist/aos.css";
import "./assets/style.css";
import "./assets/main.css";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueCookies, { expires: '7d'})
  .use(OpenLayersMap)
  .use(Vue3Toasity, { autoClose: false} as ToastContainerOptions)
  .use(Vue3Lottie)
  .use(autoAnimatePlugin)
  .use(ElementPlus)
  .use(install, {
    sitekey: "6LcdBh0qAAAAAHU6gVhG4QQqEuJHZwRuFzBzZnFE",
  })
  .component('VueDatePicker', VueDatePicker);

app.mount('#app');
