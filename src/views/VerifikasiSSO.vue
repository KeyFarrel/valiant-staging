<template>
  <div class="bg-white text-primaryTextColor min-h-dvh"></div>
  <ModalNotification :show-modal="isError" :animation-data="errorJsonData" :title="'Verifikasi SSO Gagal'"
    :subtitle="'User anda tidak terdaftar pada aplikasi valiant'" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import LoginService from "@/services/auth-service";
const loginService = new LoginService();
import { useRoute } from "vue-router";
const route = useRoute();
import router from "@/router";
const ssoCode = route.query.code as string;
import errorJsonData from '@/assets/lottie/error.json';
import ModalNotification from '@/components/ui/ModalNotification.vue';
import CryptoJS from "crypto-js";
import axios from "axios";

const isError = ref(false);
const url: any = import.meta.env.VITE_API_URL;
const nodeMode = import.meta.env.MODE;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const verifikasiSSO = async () => {
  try {
    const encryptStorage = await encryptStoragePromise;
    const response: any = await loginService.verifikasiSSO(ssoCode);
    if (response.success) {
      const token = response.data.token;
      const namaPegawai = response.data.nama_pegawai;
      const levelSentral =
        response.data.uuid_sentral === "" || response.data.uuid_sentral === "0"
          ? 0
          : response.data.uuid_sentral;

      const dataString = `${levelSentral}:${namaPegawai}`;
      const hash = CryptoJS.HmacSHA512(dataString, (window as any).userHashSecretKey()).toString();

      const setStorage = (storage: any) => {
        storage.setItem("token", token);
        storage.setItem("nama_pegawai", namaPegawai);
        storage.setItem("level_sentral", levelSentral);
        storage.setItem("user_hash", hash);
      };

      const storage = nodeMode === "production" ? encryptStorage : localStorage;
      setStorage(storage);
      router.push('/peta');
    } else {
      isError.value = true;
      await wait(5000);
      if (nodeMode === "production") {
        encryptStorage.clear();
      } else {
        localStorage.clear();
      }
      router.push('/login');
    }
  } catch (error) {
    const encryptStorage = await encryptStoragePromise;
    isError.value = true;
    await wait(5000);
    if (nodeMode === "production") {
      encryptStorage.clear();
    } else {
      localStorage.clear();
    }
    router.push('/login');
    console.error("Error fetching data:", error);
    throw error;
  }
};
verifikasiSSO();
</script>