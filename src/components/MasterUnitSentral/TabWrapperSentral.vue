<template>
  <div>
    <ul class="flex border-b-2 border-gray-50 mb-4 items-end whitespace-nowrap overflow-auto">
      <li class="mr-10 pb-2 cursor-pointer font-semibold text-gray-500 transition-all duration-300"
        :class="{ selected: 'Sentral' === selectedTitle }" @click="selectedTitle = 'Sentral'">
        Sentral
      </li>
      <li class="mr-10 pb-2 cursor-pointer font-semibold text-gray-500 transition-all duration-300"
        v-for="(tab, index) in props.tabsTitles " :key="index" @click="selectedTitle = tab.mesin;"
        :class="{ selected: tab.mesin === selectedTitle }">
        {{ tab.mesin }}
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
  mesin: String,
  nilai_asset_awal: Number,
  tahun_operasi: any
  masa_manfaat: any,
  sisa_masa_manfaat: any,
  daya_terpasang: any,
  daya_mampu: any,
  kondisi_unit: any,
}

interface Tab {
  mesin: string;
  kode_mesin: string;
  id_mesin: number;
}

const props = defineProps({
  isLihatGrafik: Boolean,
  tabsTitles: Array as () => Tab[],
});

onMounted(async () => {
  if (props.tabsTitles) {
    if (props.tabsTitles.length > 0) {
      selectedTitle.value = 'Sentral';
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
