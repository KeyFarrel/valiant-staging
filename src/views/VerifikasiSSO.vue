<template>
  <div class="bg-white text-primaryTextColor min-h-dvh"></div>
  <ModalNotification :show-modal="isError" :animation-data="errorJsonData" :title="'Verifikasi SSO Gagal'"
    :subtitle="'User anda tidak terdaftar pada aplikasi valiant'" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { encryptStorage } from "@/utils/app-encrypt-storage";
import LoginService from "@/services/auth-service";
const loginService = new LoginService();
import { useRoute } from "vue-router";
const route = useRoute();
import router from "@/router";
const ssoCode = route.query.code as string;
import errorJsonData from '@/assets/lottie/error.json';
import ModalNotification from '@/components/ui/ModalNotification.vue';

const isError = ref(false);
const nodeMode = import.meta.env.MODE;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const verifikasiSSO = async () => {
  try {
    const response: any = await loginService.verifikasiSSO(ssoCode);
    if (response.success) {
      const token = response.data.token;
      const namaPegawai = response.data.nama_pegawai;
      const levelID = response.data.id_level;
      const levelSentral = response.data.id_sentral === '' ? 0 : response.data.id_sentral;
      const idPembina = response.data.id_pembina === '' ? 0 : response.data.id_pembina;
      const kodePengelola = response.data.kode_pengelola === '' ? 0 : response.data.kode_pengelola;
      const roleId = response.data.role_id === '' ? 0 : response.data.role_id;
      if (nodeMode === 'production') {
        encryptStorage.setItem('token', token);
        encryptStorage.setItem('nama_pegawai', namaPegawai);
        encryptStorage.setItem('level_id', levelID);
        encryptStorage.setItem('level_sentral', levelSentral);
        encryptStorage.setItem('id_pembina', idPembina);
        encryptStorage.setItem('role_id', roleId);
        encryptStorage.setItem('kode_pengelola', kodePengelola);
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('nama_pegawai', namaPegawai);
        localStorage.setItem('level_id', levelID);
        localStorage.setItem('level_sentral', levelSentral);
        localStorage.setItem('id_pembina', idPembina);
        localStorage.setItem('role_id', roleId);
        localStorage.setItem('kode_pengelola', kodePengelola);
      }
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