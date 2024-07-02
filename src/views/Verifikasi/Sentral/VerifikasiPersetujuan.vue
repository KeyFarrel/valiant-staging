<template>
  <Loading v-if="isLoading" />
  <div class="flex">
    <div class="w-1/4 min-h-screen px-4 py-3 bg-white border rounded-lg">
      <h1 class="my-2 text-base font-semibold">Data Sentral Dimiliki</h1>
      <div>
        <div class="flex mt-2">
          <div v-auto-animate="{ duration: 500 }" class="w-full bg-white border rounded-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="p-2 text-sm font-semibold text-primaryTextColor">
                  {{ namaSentral }}
                </p>
              </div>
              <div class="p-2 cursor-pointer" @click="toggleButton">
                <svg v-if="isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289L10 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68342 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                    fill="#0099AD" />
                </svg>
                <svg v-if="!isHover" width="20" height="20" viewBox="0 0 20 20" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z"
                    fill="#0099AD" />
                </svg>
              </div>
            </div>
            <div v-if="isHover">
              <div v-for="(item, i) in menuMesin" :key="i" :class="{ selected: item.mesin === selectedTitle }"
                @click="changeTabMesin(item.mesin)" class="text-xs px-3 py-2 cursor-pointer hover:bg-[#F7FBFC]">
                {{ item.mesin }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="selectedTitle === 'Unit Sentral'" @click="selectedTitle = 'Unit Sentral'"
      class="w-3/4 min-h-screen px-4 py-3 ml-2 bg-white border rounded-lg">
      <div class="flex flex-row items-center justify-between">
        <h1 class="text-base font-semibold">Data Persetujuan</h1>
      </div>
      <div>
        <div class="flex flex-row my-4">
          <div class="w-1.5 h-6 bg-[#0099AD] rounded-sm"></div>
          <h3 class="ml-2 font-semibold">Feasibility Study</h3>
        </div>
        <FeasibilityStudy :source="approveSentralFS" />
      </div>
      <div>
        <div class="flex flex-row my-4">
          <div class="w-1.5 h-6 bg-[#0099AD] rounded-sm"></div>
          <h3 class="ml-2 font-semibold">Kertas Kerja</h3>
        </div>
        <KertasKerja :source="approveSentralKK" />
      </div>
    </div>
    <div v-for="(item, i) in menuMesin" :key="i" v-show="selectedTitle === item.mesin"
      @click="selectedTitle = item.mesin" class="w-3/4 min-h-screen px-4 py-3 ml-2 bg-white border rounded-lg">
      <div class="flex flex-row items-center justify-between">
        <h1 class="text-base font-semibold">Data Persetujuan</h1>
      </div>
      <div>
        <div class="flex flex-row my-4">
          <div class="w-1.5 h-6 bg-[#0099AD] rounded-sm"></div>
          <h3 class="ml-2 font-semibold">Feasibility Study</h3>
        </div>
        <FeasibilityStudyMesin :source="mesinFs" />
      </div>
      <div>
        <div class="flex flex-row my-4">
          <div class="w-1.5 h-6 bg-[#0099AD] rounded-sm"></div>
          <h3 class="ml-2 font-semibold">Kertas Kerja</h3>
        </div>
        <KertasKerjaMesin :source="mesinKk" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from "vue";
import { encryptStorage, encryptedUserInfo } from "@/utils/app-encrypt-storage";
import PersetujuanService from '@/services/persetujuan-service';
import Loading from "@/components/ui/LoadingSpinner.vue";
import KertasKerja from "@/views/Verifikasi/Sentral/TabPage/KK/KertasKerja.vue";
import FeasibilityStudy from "@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudy.vue";
import KertasKerjaMesin from "@/views/Verifikasi/Sentral/TabPage/KK/KertasKerjaMesin.vue";
import FeasibilityStudyMesin from "@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudyMesin.vue";

const nodeMode = import.meta.env.MODE;
const persetujuanService = new PersetujuanService();
const levelSentral = ref(nodeMode === 'production' ? encryptStorage.getItem('level_sentral') : localStorage.getItem("level_sentral"));
// const level_sentral = ref(levelSentral);
const year = new Date().getFullYear();
const approveSentralKK = ref<any[]>([]);
const approveMesinKK = ref<any>();
const detailMesin = ref<any>();
const approveSentralFS = ref<any[]>([]);
const approveMesinFS = ref<any>();
const menuMesin = ref<any[]>([]);
const mesinKk = ref<any[]>([]);
const mesinFs = ref<any[]>([]);
const namaMesin = ref<any>();
const namaSentral = ref<any>();

const selectedTitle = ref(namaMesin);
const isLoading = ref(false);
const isHover = ref(true);

const fetchDetailMesin = async () => {
  try {
    const response: any = await persetujuanService.getDetailMesinAppr({ id_sentral: levelSentral.value });
    if (response.success) {
      detailMesin.value = response.data.mesins;
      namaSentral.value = response.data.sentral;
      namaMesin.value = response.data.mesins[0].mesin;
      changeTabMesin(selectedTitle.value);
    }
    for (var i = 0; i < response.data.mesins.length; i++) {
      menuMesin.value.push({
        mesin: response.data.mesins[i].mesin
      })
    }
  } catch (error) {
    console.error('Fetch Detail Mesin Persetujuan Error : ' + error);
  }
}
const fetchPersetujuanKK = async () => {
  try {
    const response: any = await persetujuanService.getPersetujuanKKSentral({ id_sentral: levelSentral.value, tahun: year });
    if (response.success) {
      approveSentralKK.value = response.data;
      approveMesinKK.value = response.data.mesins;
    }
  } catch (error) {
    console.error('Fetch Persetujuan KK Sentral Error : ' + error);
  }
}
const fetchPersetujuanFS = async () => {
  try {
    const response: any = await persetujuanService.getPersetujuanFSSentral({ id_sentral: levelSentral.value });
    approveSentralFS.value = response.data;
    approveMesinFS.value = response.data.mesins;
  } catch (error) {
    console.error('Fetch Persetujuan FS Sentral Error : ' + error);
  }
}

const changeTabMesin = (mesin: any) => {
  selectedTitle.value = mesin;
  const tempMesinKK = ref<any>()
  if (approveMesinKK.value) {
    tempMesinKK.value = approveMesinKK.value.filter((val: any) => mesin === val.mesin)
  }
  if (tempMesinKK.value) {
    mesinKk.value = tempMesinKK.value
  }
  const tempMesinFs = ref<any>()
  if (approveMesinFS.value) {
    tempMesinFs.value = approveMesinFS.value.filter((val: any) => mesin === val.mesin)
  }
  if (tempMesinFs.value) {
    mesinFs.value = tempMesinFs.value
  }
};

function toggleButton() {
  isHover.value = !isHover.value;
}

onMounted(async () => {
  isLoading.value = true;
  await fetchPersetujuanKK();
  await fetchPersetujuanFS();
  await fetchDetailMesin();
  isLoading.value = false;
})
provide("selectedTitle", selectedTitle);

</script>

<style scoped>
div.selected {
  color: #0099ad;
  background-color: #F7FBFC;
}
</style>
