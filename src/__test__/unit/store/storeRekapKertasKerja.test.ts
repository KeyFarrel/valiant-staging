import { setActivePinia, createPinia } from 'pinia';
import { useRekapSearchStore, useRekapCheckRealisasi, useRekapNavigationStore, usePerbaruiTabStore } from '@/store/storeRekapKertasKerja';

describe('storeRekapKertasKerja', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize searchRekapQuery and selectedRekapSearchQuery as empty strings in useRekapSearchStore', () => {
    const rekapSearchStore = useRekapSearchStore();

    expect(rekapSearchStore.searchRekapQuery).toBe('');
    expect(rekapSearchStore.selectedRekapSearchQuery).toBe('');
  });

  it('should initialize realisasiList as an empty array in useRekapCheckRealisasi', () => {
    const rekapCheckRealisasiStore = useRekapCheckRealisasi();

    expect(rekapCheckRealisasiStore.realisasiList).toEqual([]);
  });

  it('should initialize currentPage, pageLimit, and scrollPosition in useRekapNavigationStore', () => {
    const rekapNavigationStore = useRekapNavigationStore();

    expect(rekapNavigationStore.currentPage).toBe(1);
    expect(rekapNavigationStore.pageLimit).toBe(10);
    expect(rekapNavigationStore.scrollPosition).toEqual({ top: 0, left: 0 });
  });

  it('should initialize currentTab as "Asumsi Makro" in usePerbaruiTabStore', () => {
    const perbaruiTabStore = usePerbaruiTabStore();

    expect(perbaruiTabStore.currentTab).toBe('Asumsi Makro');
  });

  it('should allow updating currentPage and pageLimit in useRekapNavigationStore', () => {
    const rekapNavigationStore = useRekapNavigationStore();

    rekapNavigationStore.currentPage = 2;
    rekapNavigationStore.pageLimit = 20;

    expect(rekapNavigationStore.currentPage).toBe(2);
    expect(rekapNavigationStore.pageLimit).toBe(20);
  });

  it('should allow updating currentTab in usePerbaruiTabStore', () => {
    const perbaruiTabStore = usePerbaruiTabStore();

    perbaruiTabStore.currentTab = 'Data Finansial';

    expect(perbaruiTabStore.currentTab).toBe('Data Finansial');
  });
});
