import { setActivePinia, createPinia } from 'pinia';
import { useLamanDataTabStore, useLamanDataPeriodeStore } from '@/store/storeLamanDataTab';

describe('storeLamanDataTab', () => {
  beforeEach(() => {
    // Set up Pinia for testing
    setActivePinia(createPinia());
  });

  it('should initialize currentTab as "Anggaran"', () => {
    const tabStore = useLamanDataTabStore();

    // Check if the initial tab is "Anggaran"
    expect(tabStore.currentTab).toBe('Anggaran');
  });

  it('should allow changing currentTab', () => {
    const tabStore = useLamanDataTabStore();

    // Change the currentTab value
    tabStore.currentTab = 'Finansial';

    // Check if the value has been updated correctly
    expect(tabStore.currentTab).toBe('Finansial');
  });
});

describe('storeLamanDataPeriodeStore', () => {
  beforeEach(() => {
    // Set up Pinia for testing
    setActivePinia(createPinia());
  });

  it('should initialize periodeTahun with [2020, 2023]', () => {
    const periodeStore = useLamanDataPeriodeStore();

    // Check if periodeTahun is initialized correctly
    expect(periodeStore.periodeTahun).toEqual([2020, 2023]);
  });

  it('should allow updating periodeInitial', () => {
    const periodeStore = useLamanDataPeriodeStore();

    // Set a value for periodeInitial
    periodeStore.periodeInitial = 2021;

    // Check if periodeInitial has been updated
    expect(periodeStore.periodeInitial).toBe(2021);
  });
});
