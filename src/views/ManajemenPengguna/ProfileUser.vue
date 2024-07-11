<template>
  <Loading v-if="isLoading" />
  <div class="min-h-screen">
    <div class="bg-[url('@/assets/img/Frame.png')] min-w-full h-[352px] -mx-2 -mt-3">
      <div class="flex">
        <div class="w-[400px] bg-white mt-8 ml-10 rounded-[8px]">
          <div class="flex justify-center my-5">
            <div class="flex flex-row items-center justify-center rounded-full w-24 h-24 bg-warningColor">
                <p class="text-xl text-white font-bold uppercase">{{ data.nama_pegawai?.split('')[0] }}</p>
            </div>
          </div>
          <div class="text-center my-5">
            <h1 class="font-bold text-lg capitalize mb-1.5">{{ data.nama_pegawai ? data.nama_pegawai : "-"}}</h1>
            <p class="text-[12px] mt-1.5 text-[#4791F2] underline cursor-pointer hover:font-medium">{{ data.email ? data.email : "-"}}</p>
            <hr class="bg-[#000] mt-5"/>
          </div>
          <div class="flex justify-between items-center px-5">
            <p class="font-medium text-[12px] text-[#7B8DAD] pb-5">Id</p>
            <p class="pb-5 text-[12px] font-medium">{{ data.id_user ? data.id_user : "-"}}</p>
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
            <p class="pb-5 text-[12px] font-medium">{{ activeDate ? activeDate : '-' }}</p>
          </div>
        </div>
        <div class="w-[832px] bg-white mt-8 p-5 mx-10 rounded-[8px]">
          <h1 class="font-medium text-lg">Personal Data</h1>
          <hr class="my-3"/>
          <div class="my-4">
            <h3 class="text-[13px] text-[#4D5E80] font-medium mb-2">Nama User</h3>
            <div class="mt-2 p-2 text-xs font-medium ml-2 bg-[#E0E0E0] capitalize w-full rounded-md">{{ data.nama_pegawai ? data.nama_pegawai : "-"}}</div>
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
const activeDate = ref<any>('');
const fetchDataProfile = async () => {
  try {
    const response: dataItem = await loginService.profile();
    data.value = response.data;
    const date = new Date(data.value.created_at)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    activeDate.value = date.toLocaleDateString("en-US", options) 
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