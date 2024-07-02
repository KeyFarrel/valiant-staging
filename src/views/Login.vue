<template>
  <div class="h-screen md:flex">
    <div class="hidden w-8/12 max-h-screen md:flex">
      <div id="default-carousel" class="relative w-full" data-carousel="slide">
        <!-- Carousel wrapper -->
        <div class="relative h-screen overflow-hidden md:h-screen">
          <div class="z-50 p-10">
            <img src="../assets/img/LogoPLN.png" class="w-26" alt="logo-pln" />
          </div>
          <!-- Item 1 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/Carousel2.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
          <!-- Item 2 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel4.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
          <!-- Item 3 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel5.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
          <!-- Item 4 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/carousel6.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
          <!-- Item 5 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="../assets/img/Carousel3.jpg"
              class="absolute block object-cover w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..." />
          </div>
        </div>
        <!-- Slider indicators -->
        <div class="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
          <button type="button" class="w-12 h-2 rounded-full" aria-current="true" aria-label="Slide 1"
            data-carousel-slide-to="0"></button>
          <button type="button" class="w-12 h-2 rounded-full" aria-current="false" aria-label="Slide 2"
            data-carousel-slide-to="1"></button>
          <button type="button" class="w-12 h-2 rounded-full" aria-current="false" aria-label="Slide 3"
            data-carousel-slide-to="2"></button>
          <button type="button" class="w-12 h-2 rounded-full" aria-current="false" aria-label="Slide 4"
            data-carousel-slide-to="3"></button>
          <button type="button" class="w-12 h-2 rounded-full" aria-current="false" aria-label="Slide 5"
            data-carousel-slide-to="4"></button>
        </div>
      </div>
    </div>
    <div class="flex md:w-4/12 min-h-screen justify-center items-center py-10 bg-[#F6FAFD]">
      <form class="bg-[#F6FAFD]">
        <div>
          <img src="../assets/img/LogoValiant.png" class="m-auto w-72" alt="logo-valiant" />
        </div>
        <h1 class="mb-2 text-3xl font-bold text-gray-800">Login</h1>
        <p class="mb-4 text-xs font-normal text-gray-600">
          Silahkan login terlebih dahulu untuk masuk aplikasi.
        </p>
        <div>
          <label for="emailAddress" class="text-xs text-[#5979A6] mb-1">Email</label>
          <input v-model="valEmail" id="emailAddress" type="email" autocomplete="new-email"
            class="block bg-white p-3 w-[350px] mb-4 text-xs text-gray-900 rounded-md border border-gray-300 focus:ring-[#0099AD] focus:border-[#0099AD]"
            placeholder="Masukkan Email Anda" />
        </div>
        <p class="mb-2 -mt-2 text-xs text-red-500">{{ valEmailErr }}</p>
        <div>
          <label for="password1" class="text-xs text-[#5979A6] mb-1">Password</label>
          <div class="relative">
            <input v-model="valPassword" autocomplete="new-password"
              class="block bg-white py-3 w-[350px] text-xs mb-6 text-gray-900 rounded-md border border-gray-300 focus:ring-[#0099AD] focus:border-[#0099AD]"
              :type="showPassword ? 'text' : 'password'" id="password1" placeholder="Masukkan Kata Sandi"
              @keyup.enter="onSubmit" @paste="onPaste" @copy="onCopy" />
            <button @click="visiblePassword" class="absolute transform -translate-y-1/2 top-1/2 right-3" type="button">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" class="mr-4" height="12"
                viewBox="0 0 16 12" fill="none">
                <path
                  d="M8 1.16577C10.209 1.16577 12.0275 2.40216 13.3398 3.73427C13.989 4.39332 14.493 5.0549 14.8346 5.55215C14.9529 5.72443 15.0511 5.87613 15.1286 6.00008C15.0511 6.12403 14.9529 6.27574 14.8345 6.44803C14.493 6.94528 13.9889 7.60687 13.3397 8.26592C12.0273 9.59805 10.2088 10.8344 8 10.8344C5.79123 10.8344 3.97267 9.59805 2.66032 8.26592C2.01107 7.60687 1.50703 6.94528 1.16548 6.44803C1.04715 6.27574 0.9489 6.12404 0.871435 6.00008C0.94889 5.87613 1.04712 5.72443 1.16544 5.55215C1.50696 5.0549 2.01096 4.39332 2.66019 3.73427C3.97247 2.40216 5.79103 1.16577 8 1.16577Z"
                  stroke="#989899" stroke-width="1.5" />
                <ellipse cx="8" cy="6" rx="2.5" ry="2.53833" fill="#989899" />
              </svg>
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" class="mr-4" height="15"
                viewBox="0 0 16 15" fill="none">
                <path
                  d="M8 2.27148C10.209 2.27148 12.0275 3.50788 13.3398 4.83999C13.989 5.49903 14.493 6.16061 14.8346 6.65787C14.9529 6.83014 15.0511 6.98184 15.1286 7.10579C15.0511 7.22975 14.9529 7.38145 14.8345 7.55374C14.493 8.051 13.9889 8.71259 13.3397 9.37163C12.0273 10.7038 10.2088 11.9401 8 11.9401C5.79123 11.9401 3.97267 10.7038 2.66032 9.37163C2.01107 8.71259 1.50703 8.051 1.16548 7.55374C1.04715 7.38145 0.9489 7.22975 0.871435 7.10579C0.94889 6.98184 1.04712 6.83014 1.16544 6.65787C1.50696 6.16061 2.01096 5.49903 2.66019 4.83999C3.97247 3.50788 5.79103 2.27148 8 2.27148Z"
                  stroke="#989899" stroke-width="1.5" />
                <ellipse cx="8" cy="7.10571" rx="2.5" ry="2.53833" fill="#989899" />
                <rect width="1.51154" height="18.1385" rx="0.75"
                  transform="matrix(0.701707 0.712466 -0.701707 0.712466 13.5835 0.105713)" fill="#989899" />
              </svg>
            </button>
          </div>
        </div>
        <p class="mb-3 -mt-1 text-xs text-red-500">{{ valPasswordErr }}</p>
        <div class="flex flex-col">
          <div class="mb-2 text-sm font-bold tracking-wide text-gray-700">
            Captcha
          </div>
          <div
            class="bg-gray-200 text-primaryTextColor h-[80px] w-[350px] px-4 border-2 border-gray-200 flex items-center justify-between rounded-md">
            <label for="check">
              <input type="checkbox" id="check" class="cursor-pointer" v-model="checkbox" @click="checkboxChange" />
              <span class="p-2 text-xs" :class="ceklistCaptcha === true
                ? 'text-green-500'
                : ceklistCaptcha === false
                  ? 'text-red-500'
                  : ''
                ">I'm not a robot</span>
            </label>
            <div>
              <div>
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" class="w-6 ml-5" />
                <span class="text-[9px] mr-1 ml-2">reCAPTCHA</span>
                <div class="flex">
                  <a href="#" class="text-[9px] mr-1">Privacy</a>
                  <span class="text-[9px] mr-1">-</span>
                  <a href="#" class="text-[9px] mr-1">Terms</a>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white text-primaryTextColor h-[140px] w-[350px] border border-gray-300 rounded-md"
            :class="box === true ? 'block' : 'hidden'">
            <input type="text" id="captchaInput" class="w-[330px] mx-2 text-xs m-1 border-0" placeholder="Type the text"
              v-model="valCaptcha" />
            <hr class="border-gray-300 w-[330px] mx-2" />
            <div class="flex items-center justify-center">
              <div class="m-2">
                <input type="text" id="captcha" disabled class="w-24 text-xs text-center bg-gray-200 border-0"
                  :value="captcha.map((c: any) => c.char).join('')" />
              </div>
            </div>
            <hr />
            <div class="flex justify-between mr-4 mt-1.5">
              <div class="flex px-4 py-2">
                <img src="https://www.gstatic.com/recaptcha/api2/refresh.png" alt="refresh" class="w-5 h-5" />
                <img src="https://www.gstatic.com/recaptcha/api2/audio.png" alt="audio" class="w-5 h-5" />
                <img src="https://www.gstatic.com/recaptcha/api2/info.png" alt="info" class="w-5 h-5" />
              </div>
              <button
                class="w-20 p-1 text-xs font-semibold tracking-wide text-white duration-300 bg-indigo-600 rounded-md shadow-lg font-display focus:outline-none focus:shadow-outline hover:bg-indigo-300 hover:text-indigo-600"
                @click="checkCaptcha" type="button">
                Verify
              </button>
            </div>
          </div>
        </div>
        <button
          class="text-primaryTextColor uppercase  bg-slate-300 w-[350px] cursor-not-allowed focus:ring-4 focus:ring-slate-700 rounded-lg text-xs p-3 my-4 dark:bg-slate-700 dark:hover:bg-slate-300 focus:outline-none dark:focus:ring-slate-400"
          v-if="valEmail.length === 0 && valPassword.length === 0" disabled>
          <p class="font-medium">Masuk Ke Aplikasi</p>
        </button>
        <button @click="onSubmit" type="button"
          class="text-white uppercase  bg-[#0099AD] w-[350px] hover:bg-[#0099AD] hover:text-white active:ring active:ring-[#005A66] rounded-lg text-xs p-3 my-4 dark:bg-[#005A66] dark:hover:bg-slate-300 focus:outline-none dark:focus:ring-[#0099AD]"
          v-else>
          <p v-show="!isLoading" class="font-semibold">Masuk Ke Aplikasi</p>
          <div v-show="isLoading" class="flex flex-row items-center justify-center space-x-2">
            <svg aria-hidden="true" class="inline w-5 h-5 text-gray-200 animate-spin fill-[#0099AD]"
              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
            <span class="font-medium">Loading...</span>
          </div>
        </button>
        <div class="flex flex-row items-center justify-center mb-4 space-x-3">
          <div class="w-16 h-[1px] bg-slate-300"></div>
          <p class="mr-1 text-xs text-center">atau masuk dengan</p>
          <div class="w-16 h-[1px] bg-slate-300"></div>
        </div>
        <button type="button" @click="loginSSO"
          class="text-[#0099AD] duration-300 bg-white w-[350px] hover:bg-blue-100 border border-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-xs p-3 text-center dark:focus:ring-[#007E8F] dark:bg-white dark:border-[#0099AD] dark:text-[#005A66] dark:hover:bg-blue-200 mr-2">
          LOGIN SSO
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import LoginService from "../services/auth-service";
import { initFlowbite } from "flowbite";
import axios from "axios";
import { store } from "../store";
import { encryptStorage } from "@/utils/app-encrypt-storage";

const router = useRouter();
const isLoading = ref(false);
const valEmail = ref("");
const valPassword = ref("");
const valCaptcha = ref("");
const valEmailErr = ref("");
const valPasswordErr = ref("");
const showPassword = ref(false);
const loginService = new LoginService();
const checkbox = ref(false);
const ceklistCaptcha = ref();
const box = ref(false);
const verify = ref(false);

function checkboxChange() {
  box.value = true;
}

function visiblePassword() {
  showPassword.value = !showPassword.value;
}

const captcha: any = ref([]);
async function onSubmit() {
  if (valEmail.value === "") {
    valEmailErr.value = "Email kosong mohon diisi";
  } else if (valPassword.value === "") {
    valPasswordErr.value = "Password kosong mohon diisi";
    valEmailErr.value = "";
  } else {
    valEmailErr.value = "";
    valPasswordErr.value = "";
    isLoading.value = true;
    let param;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(valEmail.value)) {
      param = {
        email: valEmail.value,
        password: valPassword.value,
      };
    } else {
      param = {
        email: valEmail.value,
        password: valPassword.value,
      };
    }
    if (verify.value !== true && box.value !== true) {
      valPasswordErr.value = "Anda belum melakukan 'Verifikasi Captcha'";
      isLoading.value = false;
      return;
    } else {
      valPasswordErr.value = "";
    }
    if (ceklistCaptcha.value !== true) {
      valPasswordErr.value = "Captcha belum diverifikasi";
      isLoading.value = false;
      return;
    }
    const url = import.meta.env.VITE_API_URL;
    try {
      const response: any = await loginService.login(param);
      const token = response.data.token;
      const permission = await axios.get(`${url}permission`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      store.setMenus(permission.data.data);
      setTimeout(() => {
        router.push({ name: "dashboard" });
      }, 500);
    } catch (e) {
      isLoading.value = false;
      console.log(e);
      valEmailErr.value = "Email atau Password salah";
      valPasswordErr.value = "Email atau Password salah";
    }
  }
}

const loginSSO = async () => {
  try {
    const response: any = await loginService.loginSSO();
    window.location.href = response.data;
    console.log(response);
  } catch (error) {
    console.error('Login SSO Gagal : ', error);
  }
}

async function onPaste(e: any) {
  e.preventDefault();
}

async function onCopy(e: any) {
  e.preventDefault();
}

async function generateCaptcha() {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let captchaChars = [];
  for (let i = 0; i < 6; i++) {
    let char = chars[Math.floor(Math.random() * chars.length)];
    let fontSize = Math.floor(Math.random() * 10) + 20; // random font size between 20 and 30
    let rotation = Math.floor(Math.random() * 21) - 10; // random rotation between -10 and 10 degrees
    captchaChars.push({ char, fontSize, rotation });
  }
  captcha.value = captchaChars;
}

function checkCaptcha() {
  if (valCaptcha.value !== captcha.value.map((c: any) => c.char).join("")) {
    console.log("masuk1");
    valPasswordErr.value = "Captcha yang anda masukkan tidak sesuai";
    isLoading.value = false;
  } else if (valCaptcha.value === captcha.value.map((c: any) => c.char).join("")) {
    console.log('masuk2')
    valPasswordErr.value = "";
    verify.value = true;
    ceklistCaptcha.value = true;
    box.value = false;
  } else {
    valPasswordErr.value = "";
    box.value = false;
    ceklistCaptcha.value = false;
  }
}
onMounted(() => {
  generateCaptcha();
  initFlowbite();
});
</script>

<style lang="scss"></style>