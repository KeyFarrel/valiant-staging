import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useRekapSearchStore = defineStore('search_rekap', () => {
  const searchRekapQuery = ref<string>('');
  const selectedRekapSearchQuery = ref<string>('');
  return { searchRekapQuery, selectedRekapSearchQuery };
})

export const useRekapCheckRealisasi = defineStore('realisasi_status', () => {
  const realisasiList = ref<any[]>([]);
  return { realisasiList };
})

export const useRekapNavigationStore = defineStore('rekap-navigation', ()=>{
  const currentPage = ref<number>(1);
  const pageLimit = ref<number>(10);
  const scrollPosition = ref<{top: number, left: number}>({ top: 0, left: 0 });
  return { currentPage, pageLimit, scrollPosition };
})

// export const useBreadcrumbs = defineStore('breadcrumbs', () => {
//   const breadcrumbs = ref<any>();
//   return { breadcrumbs };
// })