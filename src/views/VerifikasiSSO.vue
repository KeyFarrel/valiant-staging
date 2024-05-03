<template>
  <div class="text-black bg-white min-h-dvh"></div>
  <ModalNotification :show-modal="isError" :animation-data="errorJsonData" :title="'Verifikasi SSO Gagal'"
    :subtitle="'User anda tidak terdaftar pada aplikasi valiant'" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoginService from "@/services/auth-service";
const loginService = new LoginService();
import { useRoute } from "vue-router";
const route = useRoute();
import router from "@/router";
const ssoCode = route.query.code as string;
import errorJsonData from '@/assets/lottie/error.json';
import ModalNotification from '@/components/ui/ModalNotification.vue';

const isError = ref(false);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const verifikasiSSO = async () => {
  try {
    const response: any = await loginService.verifikasiSSO(ssoCode);
    if (response.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("nama_pegawai", response.data.nama_pegawai);
      localStorage.setItem("level_id", response.data.id_level);
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

<style lang="scss" scoped></style>