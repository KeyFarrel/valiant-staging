import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTagSentral = defineStore('currentTabSentral', () => {
  const currentTabSentral = ref("WLC (Realisasi & Proyeksi)");
  return { currentTabSentral };
})

export const useTagMesin = defineStore('currentTabMesin', () => {
  const currentTabMesin = ref("WLC (Realisasi & Proyeksi)");
  return { currentTabMesin };
})

export const useLamanDataPeriodeStore = defineStore('periodeTahun', () => {
  const periodeInitial = ref();
  const periodeTahun = ref([2020, 2023]);
  return { periodeTahun, periodeInitial };
})