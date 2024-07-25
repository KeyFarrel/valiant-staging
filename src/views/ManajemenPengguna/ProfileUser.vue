<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-row items-center justify-center h-screen -mt-24 space-x-12">
    <div
      class="bg-white rounded-lg w-full max-w-[32%] items-center h-[60%] top-12 max-h-[600px] px-10 py-5 flex flex-col space-y-5">
      <div class="flex flex-col items-center space-y-3.5">
        <div
          class="w-[150px] items-center flex flex-col font-semibold justify-center h-[150px] bg-warningColor rounded-full text-[42px] text-white uppercase">
          {{ data.nama_pegawai.split('')[0] }}
        </div>
        <div class="flex flex-col items-center space-y-1">
          <p class="text-base font-semibold">{{ data.nama_pegawai }}</p>
          <p class="text-[#4791F2]">{{ data.email }}</p>
        </div>
      </div>
      <hr class="w-full">
      <div class="flex flex-col justify-between w-full h-full">
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-sm font-semibold text-labelColor">Level</p>
          <p class="text-sm">{{ authService.checkLevel() }}</p>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-sm font-semibold text-labelColor">Role</p>
          <div
            class="w-fit px-1.5 py-1 flex items-center justify-center text-xs font-semibold bg-[#F7FBFC] border border-primaryColor rounded-full text-primaryColor">
            {{ authService.checkRole() }}
          </div>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-sm font-semibold text-labelColor">Status</p>
          <div
            class="w-fit px-1.5 py-1 flex items-center justify-center font-semibold text-xs bg-[#EDF7F2] border border-[#C7E5D7] rounded-full text-[#397E5D]"
            v-if="data.status">
            Aktif
          </div>
          <div v-else-if="!data.status"
            class="w-fit px-1.5 py-1 flex items-center justify-center font-semibold text-xs bg-[#FAEBEA] border border-[#EFC0BD] rounded-full text-[#C53830]">
            Tidak Aktif
          </div>
        </div>
        <div class="flex flex-row items-center justify-between w-full">
          <p class="text-sm font-semibold text-labelColor">Aktif Sejak</p>
          <p class="text-sm">{{ activeDate }}</p>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg w-full max-w-[52%] top-12 h-[60%] max-h-[600px] p-5 space-y-5 flex flex-col">
      <div class="space-y-3.5">
        <p class="text-base font-semibold">Data Pribadi</p>
        <hr>
      </div>
      <div class="flex flex-col justify-between w-full h-full">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Nama Pengguna</p>
          <p class="text-xs">{{ data.nama_pegawai }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">NIP</p>
          <p class="text-xs">{{ data.nip }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Email Pengguna</p>
          <p class="text-xs">{{ data.email }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Unit Pengelola</p>
          <p class="text-xs">{{ data.pengelola === '' ? '-' : data.pengelola }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Unit Pembina</p>
          <p class="text-xs">{{ data.pembina === '' ? '-' : data.pembina }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-labelColor">Unit Sentral</p>
          <p class="text-xs">{{ data.sentral === '' ? '-' : data.sentral }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import LoginService from "@/services/auth-service";
const loginService = new LoginService();
import AuthService from "@/services/auth-service";
const authService = new AuthService();

const isLoading = ref(false);
const items = ref(["Admin", "Staff Unit Sentral", "Admin Unit Mesin"])
interface dataItem {
  data: any
  id_user: string
  nip: string
  email: string
  username: string
  nama_pegawai: string
  atasan: string
  photo: string
  status: boolean
  no_tlpn: number
  pengelola: string
  pembina: string
  sentral: string
  roles: any
  created_at: any
}

const data = ref<dataItem>({
  data: {},
  id_user: "",
  nip: "",
  email: "",
  username: "",
  nama_pegawai: "",
  atasan: "",
  photo: "",
  status: true,
  no_tlpn: 0,
  pengelola: "",
  pembina: "",
  sentral: "",
  roles: {},
  created_at: ""
});

const activeDate = ref<any>('');
const calculateTimeAgo = (createdAt: any) => {
  const now: any = new Date();
  const date: any = new Date(createdAt);
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} tahun yang lalu`;
  } else if (months > 0) {
    return `${months} bulan yang lalu`;
  } else if (days > 0) {
    return `${days} hari yang lalu`;
  } else if (hours > 0) {
    return `${hours} jam yang lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit yang lalu`;
  } else {
    return `${seconds} detik yang lalu`;
  }
};
const fetchDataProfile = async () => {
  try {
    isLoading.value = true;
    const response: dataItem = await loginService.profile();
    data.value = response.data;
    const createdAt = data.value.created_at;
    activeDate.value = calculateTimeAgo(createdAt);
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchDataProfile();
});
</script>