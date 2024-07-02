<template>
  <Loading v-if="isLoading" />
  <div class="min-h-screen">
    <div class="bg-[url('@/assets/img/Frame.png')] min-w-full h-[352px] -mx-2 -mt-3">
      <div class="flex">
        <div class="w-[400px] bg-white mt-8 ml-10 rounded-[8px]">
          <div class="flex justify-center my-5">
            <svg width="130" height="130" viewBox="0 0 60 60" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="30" fill="#C7E5D7" />
              <path
                d="M32.2564 21.0494H35.3928V33.3221C35.3871 34.4471 35.1484 35.4158 34.6768 36.2283C34.2053 37.0352 33.5462 37.6573 32.6996 38.0948C31.8587 38.5266 30.8786 38.7425 29.7592 38.7425C28.7365 38.7425 27.8161 38.5607 26.9979 38.1971C26.1854 37.8278 25.5405 37.2823 25.0632 36.5607C24.5859 35.8391 24.3473 34.9414 24.3473 33.8675H27.4922C27.4979 34.3391 27.6001 34.7454 27.799 35.0863C28.0036 35.4272 28.2848 35.6886 28.6428 35.8704C29.0007 36.0522 29.4126 36.1431 29.8786 36.1431C30.3842 36.1431 30.8132 36.038 31.1655 35.8278C31.5178 35.6119 31.7848 35.2937 31.9666 34.8732C32.1541 34.4528 32.2507 33.9357 32.2564 33.3221V21.0494Z"
                fill="#333333" />
            </svg>
          </div>
          <div class="text-center my-5">
            <h1 class="font-bold text-lg mb-1.5">{{ data.username ? data.username : "-"}}</h1>
            <p class="text-[12px] mt-1.5 text-[#4791F2] underline cursor-pointer hover:font-medium">{{ data.email ? data.email : "-"}}</p>
            <hr class="bg-[#000] mt-5"/>
          </div>
          <div class="flex justify-between items-center px-5">
            <p class="font-medium text-[12px] text-[#7B8DAD] pb-5">Id</p>
            <p class="pb-5 text-[12px]">{{ data.id_user ? data.id_user : "-"}}</p>
          </div>
          <div class="flex justify-between items-center px-5">
            <p class="font-medium text-[12px] text-[#7B8DAD] pb-5">Role</p>
            <div class="grid grid-cols-2 gap-x-2">
              <div v-if="data.roles === null">
                <div class="bg-[#F7FBFC] mb-2 p-1.5 text-center text-[10px] text-[#0099AD] border border-[#0099AD] font-semibold rounded-md">
                  -
                </div>
              </div>
              <div v-else v-for="item in items">
                <div class="bg-[#F7FBFC] mb-2 p-1.5 text-center text-[10px] text-[#0099AD] border border-[#0099AD] font-semibold rounded-md">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center px-5">
            <p class="font-medium text-[12px] text-[#7B8DAD] pb-5">Status</p>
              <div v-if="data.status === true" class="bg-[#E0E0E0] mb-2 p-1.5 text-center text-[10px] text-[#7F7F80] font-semibold rounded-md">
                Aktif
              </div>
              <div v-else class="bg-[#E0E0E0] mb-2 p-1.5 text-center text-[10px] text-[#7F7F80] font-semibold rounded-md">
                Tidak Aktif
              </div>
          </div>
          <div class="flex justify-between items-center px-5">
            <p class="font-medium text-[12px] text-[#7B8DAD] pb-5">Aktif Sejak</p>
            <p class="pb-5 text-[12px]"></p>
          </div>
        </div>
        <div class="w-[832px] bg-white mt-8 p-5 mx-10 rounded-[8px]">
          <h1 class="font-medium text-lg">Personal Data</h1>
          <hr class="my-3"/>
          <div class="my-4">
            <h3 class="text-[13px] text-[#4D5E80] font-medium mb-2">Nama User</h3>
            <div class="mt-2 p-2 text-xs font-medium ml-2 bg-[#E0E0E0] w-full rounded-md">{{ data.username ? data.username : "-"}}</div>
          </div>
          <div class="my-4">
            <h3 class="text-[13px] text-[#4D5E80] font-medium mb-2">NIP</h3>
            <div class="mt-2 p-2 text-xs font-medium ml-2 bg-[#E0E0E0] w-full rounded-md">{{ data.nip ? data.nip : "-"}}</div>
          </div>
          <div class="my-4">
            <h3 class="text-[13px] text-[#4D5E80] font-medium mb-2">Email User</h3>
            <div class="mt-2 p-2 text-xs font-medium ml-2 bg-[#E0E0E0] w-full rounded-md">{{ data.email ? data.email : "-"}}</div>
          </div>
          <div class="my-4">
            <h3 class="text-[13px] text-[#4D5E80] font-medium mb-2">Role</h3>
            <div class="mt-2 p-2 text-xs font-medium ml-2 bg-[#E0E0E0] w-full rounded-md">{{ data.roles ? data.roles : "-"}}</div>
          </div>
          <div class="my-4">
            <h3 class="text-[13px] text-[#4D5E80] font-medium mb-2">Unit Pengelola</h3>
            <div class="mt-2 p-2 text-xs font-medium ml-2 bg-[#E0E0E0] w-full rounded-md">{{ data.pengelola ? data.pengelola : "-"}}</div>
          </div>
          <div class="my-4">
            <h3 class="text-[13px] text-[#4D5E80] font-medium mb-2">Unit Pembina</h3>
            <div class="mt-2 p-2 text-xs font-medium ml-2 bg-[#E0E0E0] w-full rounded-md">{{ data.pembina ? data.pembina : "-"}}</div>
          </div>
          <div class="my-4">
            <h3 class="text-[13px] text-[#4D5E80] font-medium mb-2">Unit Sentral</h3>
            <div class="mt-2 p-2 text-xs font-medium ml-2 bg-[#E0E0E0] w-full rounded-md">{{ data.sentral ? data.sentral : "-"}}</div>
          </div>
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
const items = ref(["Admin", "Staff Unit Sentral", "Admin Unit Mesin"])
interface dataItem {
  data: any;
  id_user: string;
  nip: string;
  email: string;
  username: string;
  nama_pegawai: string;
  status_pegawai: string;
  atasan: string;
  photo: string;
  status: any;
  no_tlpn: number;
  pengelola: string;
  pembina: string;
  sentral: string;
  roles: any
}

const data = ref<dataItem>({});

const fetchDataProfile = async () => {
  try {
    const response: dataItem = await loginService.profile();
    data.value = response.data;
    console.log(data.value)
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