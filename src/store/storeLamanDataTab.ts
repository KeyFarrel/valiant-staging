import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLamanDataTabStore = defineStore('tab', () => {
  const currentTab = ref('Anggaran');
  return { currentTab };
})

export const useLamanDataPeriodeStore = defineStore('periodeTahun', () => {
  const periodeInitial = ref();
  const periodeTahun = ref([2020, 2023]);
  return { periodeTahun, periodeInitial };
})