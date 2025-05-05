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
      const responseMenu: any = await axios.get(`${url}menu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const menu = responseMenu.data.data;
      const namaPegawai = response.data.nama_pegawai;
      const levelSentral =
        response.data.id_sentral === "" || response.data.id_sentral === "0"
          ? 0
          : response.data.id_sentral;
      let level: string;
      let role: string;

      if (response.data.id_level === "3") {
        level = "Sentral";
      } else if (response.data.id_level === "4") {
        level = "Pembina";
      } else if (response.data.id_level === "2") {
        level = "Pengelola";
      } else if (response.data.id_level === "1") {
        level = "Admin";
      } else if (response.data.id_level === "5") {
        level = "Pusat";
      }

      if (response.data.role_id === "138") {
        role = "Staff";
      } else if (response.data.role_id === "140") {
        role = "Approver";
      } else if (response.data.role_id === "141") {
        role = "Super Admin";
      } else if (response.data.role_id === "142") {
        role = "Monitoring";
      } else if (response.data.role_id === "143") {
        role = "Input";
      }

      const dataString = `${role}:${level}:${levelSentral}:${namaPegawai}:${JSON.stringify(menu)}`;
      const hash = CryptoJS.HmacSHA512(dataString, (window as any).userHashSecretKey()).toString();

      const setStorage = (storage: any) => {
        storage.setItem("token", token);
        storage.setItem("level", level);
        storage.setItem("role", role);
        storage.setItem("nama_pegawai", namaPegawai);
        storage.setItem("level_sentral", levelSentral);
        storage.setItem("menu", JSON.stringify(menu));
        storage.setItem("user_hash", hash);
      };

      const storage = nodeMode === "production" ? encryptStorage : localStorage;
      setStorage(storage);
      router.push('/peta');
    } else {
      isError.value = true;
      await wait(5000);
      router.push('/login');
    }
  } catch (error) {
    isError.value = true;
    await wait(5000);
    router.push('/login');
    console.error("Error fetching data:", error);
    throw error;
  }
};
verifikasiSSO();
</script>