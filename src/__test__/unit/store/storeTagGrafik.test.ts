import { setActivePinia, createPinia } from 'pinia';
import { useTagSentral, useTagMesin, useLamanDataPeriodeStore } from '@/store/storeTagGrafik';

describe('storeTagGrafik', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize currentTabSentral with default value', () => {
    const tagSentralStore = useTagSentral();

    expect(tagSentralStore.currentTabSentral).toBe("WLC (Realisasi & Proyeksi)");
  });

  it('should update currentTabSentral', () => {
    const tagSentralStore = useTagSentral();

    tagSentralStore.currentTabSentral = "New Tab Sentral";
    expect(tagSentralStore.currentTabSentral).toBe("New Tab Sentral");
  });

  it('should initialize currentTabMesin with default value', () => {
    const tagMesinStore = useTagMesin();

    expect(tagMesinStore.currentTabMesin).toBe("WLC (Realisasi & Proyeksi)");
  });

  it('should update currentTabMesin', () => {
    const tagMesinStore = useTagMesin();

    tagMesinStore.currentTabMesin = "New Tab Mesin";
    expect(tagMesinStore.currentTabMesin).toBe("New Tab Mesin");
  });

  it('should initialize periodeTahun with default values', () => {
    const lamanDataPeriodeStore = useLamanDataPeriodeStore();

    expect(lamanDataPeriodeStore.periodeTahun).toEqual([2020, 2023]);
    expect(lamanDataPeriodeStore.periodeInitial).toBeUndefined();
  });

  it('should update periodeTahun and periodeInitial', () => {
    const lamanDataPeriodeStore = useLamanDataPeriodeStore();

    lamanDataPeriodeStore.periodeTahun = [2021, 2024];
    lamanDataPeriodeStore.periodeInitial = 2021;

    expect(lamanDataPeriodeStore.periodeTahun).toEqual([2021, 2024]);
    expect(lamanDataPeriodeStore.periodeInitial).toBe(2021);
  });
});
