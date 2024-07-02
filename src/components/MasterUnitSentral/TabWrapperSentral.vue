<template>
  <div>
    <ul class="flex items-end mb-4 overflow-auto border-b-2 border-gray-50 whitespace-nowrap">
      <li class="pb-2 mr-10 font-semibold text-gray-500 transition-all duration-300 cursor-pointer"
        :class="{ selected: 'Sentral' === selectedTitle }" @click="selectedTitle = 'Sentral'" v-if="!isRekap">
        Sentral
      </li>
      <li class="pb-2 mr-10 text-gray-500 transition-all duration-300 cursor-pointer"
        v-for="(tab, index) in props.tabsTitles " :key="index" @click="selectedTitle = tab.mesin;"
        :class="{ selected: tab.mesin === selectedTitle }">
        <div class="flex flex-row items-center space-x-2">
          <span class="font-semibold">{{ tab.mesin }}</span>
          <div v-if="tab.status_realisasi === 'Data belum terisi' || tab.status_realisasi === 'Data belum update'"
            class="border-2 border-[#FFE5E6] w-2.5 h-2.5 rounded-full  bg-warningColor">
          </div>
        </div>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from "vue";
import RekapService from "@/services/rekap-service";
const rekapService = new RekapService();
import { useRekapCheckRealisasi } from "@/store/storeRekapKertasKerja";
const store = useRekapCheckRealisasi();

const selectedTitle = ref('Sentral');

interface MesinItem {
  mesin: String
  nilai_asset_awal: Number
  tahun_operasi: any
  masa_manfaat: any
  sisa_masa_manfaat: any
  daya_terpasang: any
  daya_mampu: any
  kondisi_unit: any
}

interface Tab {
  mesin: string
  kode_mesin: string
  id_mesin: number
  status_fs: string
  status_realisasi: string
}

interface Props {
  isLihatGrafik: boolean
  tabsTitles: Tab[]
  isRekap: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLihatGrafik: false,
  tabsTitles: Array as () => Tab[],
  isRekap: false
});
console.log(props.tabsTitles)
onMounted(async () => {
  if (props.tabsTitles) {
    if (props.tabsTitles.length > 0) {
      if (props.isRekap) selectedTitle.value = props.tabsTitles[0].mesin;
      else selectedTitle.value = 'Sentral';
    }
  }
});

provide("selectedTitle", selectedTitle);
</script>

<style scoped>
ul li.selected {
  border-bottom-width: 4px;
  border-color: #0099AD;
  color: #0099AD;
}
</style>
