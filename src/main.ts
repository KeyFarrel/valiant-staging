import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { createPinia } from "pinia";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import OpenLayersMap from "vue3-openlayers";
import VueDatePicker from '@vuepic/vue-datepicker'
import VueCookies from 'vue-cookies'
import '@vuepic/vue-datepicker/dist/main.css'
import Vue3Lottie from "vue3-lottie";
import "aos/dist/aos.css";
import "./assets/style.css";
import "./assets/main.css";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios";
import "go-captcha-vue/dist/style.css"
import GoCaptcha from "go-captcha-vue"
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";

const nodeMode = import.meta.env.MODE;

axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      const encryptStorage = await encryptStoragePromise;
      
      if (nodeMode === "production") {
        encryptStorage.clear(); 
      } else {
        localStorage.clear();
      }

      router.push({ name: 'login' });
    }
    return Promise.reject(error);
  }
);

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueCookies, { expires: '7d', sameSite: 'Strict', secure: true })
  .use(OpenLayersMap)
  .use(Vue3Toasity, { autoClose: false } as ToastContainerOptions)
  .use(Vue3Lottie)
  .use(autoAnimatePlugin)
  .use(ElementPlus)
  .use(GoCaptcha)
  .component('VueDatePicker', VueDatePicker);

app.mount('#app');
