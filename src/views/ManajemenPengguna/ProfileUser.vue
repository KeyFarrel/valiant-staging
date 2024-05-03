<template>
  <Loading v-if="isLoading" />
  <div class="flex">
    <div class="w-2/5 min-h-screen px-6 py-4 mr-2 bg-white rounded-lg">
      <div>
        <svg width="200" height="200" class="mx-auto mt-5" viewBox="0 0 60 60" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="30" fill="#C7E5D7" />
          <path
            d="M32.2564 21.0494H35.3928V33.3221C35.3871 34.4471 35.1484 35.4158 34.6768 36.2283C34.2053 37.0352 33.5462 37.6573 32.6996 38.0948C31.8587 38.5266 30.8786 38.7425 29.7592 38.7425C28.7365 38.7425 27.8161 38.5607 26.9979 38.1971C26.1854 37.8278 25.5405 37.2823 25.0632 36.5607C24.5859 35.8391 24.3473 34.9414 24.3473 33.8675H27.4922C27.4979 34.3391 27.6001 34.7454 27.799 35.0863C28.0036 35.4272 28.2848 35.6886 28.6428 35.8704C29.0007 36.0522 29.4126 36.1431 29.8786 36.1431C30.3842 36.1431 30.8132 36.038 31.1655 35.8278C31.5178 35.6119 31.7848 35.2937 31.9666 34.8732C32.1541 34.4528 32.2507 33.9357 32.2564 33.3221V21.0494Z"
            fill="#333333" />
        </svg>
      </div>
      <div class="mt-4 text-center">
        <div>
          <div class="text-lg font-bold">{{ namaPegawai }}</div>
        </div>
        <div>
          <div class="mt-2 mb-6 text-sm text-[#4791F2] underline cursor-pointer">
          </div>
        </div>
      </div>
      <hr />
      <div class="flex justify-between mt-4">
        <div class="text-[#7B8DAD] text-[13px] mt-3">Id</div>
      </div>
      <div class="flex justify-between mt-4">
        <div class="text-[#7B8DAD] text-[13px] mt-3">Role</div>
        <!-- <div v-for="(item, i) in dataRoles" :key="i"
          class="mt-3 text-center text-[#0099AD] text-[13px] p-0.5 h-6 w-28 rounded-full border border-[#0099AD]">
          {{ item.role }}
        </div> -->
      </div>
      <div class="flex justify-between mt-4">
        <div class="text-[#7B8DAD] text-[13px] mt-3">Status</div>
        <div
          class="mt-3 text-[13px] flex items-center justify-center text-[#0099AD] p-1.5 h-6 w-15 rounded-full border border-[#0099AD]">
          <svg width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M6.67498 1.10213C6.87538 0.848889 7.25106 0.800011 7.51409 0.992955C7.77712 1.1859 7.82789 1.5476 7.62749 1.80084L3.59389 6.8979C3.48918 7.03022 3.3302 7.11253 3.15782 7.1237C2.98543 7.13486 2.81644 7.07378 2.69426 6.95616L0.425366 4.7717C0.191545 4.54659 0.191545 4.1816 0.425366 3.95648C0.659188 3.73136 1.03829 3.73136 1.27211 3.95648L3.05657 5.67453L6.67498 1.10213Z"
              fill="#0EA976" />
          </svg>
          <span class="ml-2">Aktif</span>
          <!-- <span v-if="data.status === true" class="ml-2">Aktif</span>
          <span v-else class="ml-2">Tidak Aktif</span> -->
        </div>
      </div>
      <div class="flex justify-between mt-4">
        <div class="text-[#7B8DAD] text-[13px] mt-3">Aktif Sejak</div>
        <div class="mt-3 text-right">0 Bulan</div>
      </div>
    </div>
    <div class="w-3/5 min-h-screen px-6 py-4 bg-white rounded-lg">
      <h2 class="mb-4 font-bold">Personal Data</h2>
      <hr />
      <div>
        <div class="flex mt-4">
          <div class="w-2/5 text-[#7B8DAD] text-sm">Nama User</div>
          <div class="w-3/5 text-sm">{{ namaPegawai }}</div>
        </div>
        <div class="flex mt-4">
          <div class="w-2/5 text-[#7B8DAD] text-sm">NIP</div>
        </div>
        <div class="flex mt-4">
          <div class="w-2/5 text-[#7B8DAD] text-sm">Email User</div>
        </div>
        <div class="flex mt-4">
          <div class="w-2/5 text-[#7B8DAD] text-sm">Role</div>
          <!-- <div v-for="(item, i) in dataRoles" :key="i">
            <div class="w-3/5 text-sm">{{ item.role }}</div>
          </div> -->
        </div>
        <div class="flex mt-4">
          <div class="w-2/5 text-[#7B8DAD] text-sm">Unit Pengelola</div>
          <div class="w-3/5 text-sm">
          </div>
        </div>
        <div class="flex mt-4">
          <div class="w-2/5 text-[#7B8DAD] text-sm">Unit Pembina</div>
        </div>
        <div class="flex mt-4">
          <div class="w-2/5 text-[#7B8DAD] text-sm">Unit Sentral</div>
        </div>
        <div class="flex mt-4">
          <div class="w-2/5 text-[#7B8DAD] text-sm">Unit Mesin</div>
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
const isLoading = ref(false);

interface dataItem {
  username: string;
  nip: string;
  id_user: number;
  nama_pegawai: string;
  email: string;
  role: string;
  pengelola: string;
  pembina: string;
  sentral: string;
  mesins: string;
}

const data = ref<dataItem[]>([]);
const dataRoles = ref<dataItem>();
const dataPengelola = ref<dataItem>();
const dataPembina = ref<dataItem>();
const dataSentral = ref<dataItem>();
const namaPegawai = ref(localStorage.getItem("nama_pegawai"));

const fetchDataProfile = async () => {
  try {
    const response: any = await loginService.profile();
    data.value = response.data;
    dataRoles.value = response.data.roles;
    dataPengelola.value = response.data.pengelola;
    dataPembina.value = response.data.pembina;
    dataSentral.value = response.data.sentral;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    await fetchDataProfile();
  } catch (error) {
    console.error("Error Fetch Me : ", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
