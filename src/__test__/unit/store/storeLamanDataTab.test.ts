import { describe, it, expect, beforeEach, vi } from 'vitest';

// Import real Pinia instead of mocked version
vi.mock('pinia', async () => {
  const actual = await vi.importActual('pinia');
  return actual;
});

import { createPinia, setActivePinia } from 'pinia';
import { useLamanDataTabStore, useLamanDataPeriodeStore } from '@/store/storeLamanDataTab';

describe('storeLamanDataTab', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('useLamanDataTabStore', () => {
    it('should initialize with default currentTab value', () => {
      const store = useLamanDataTabStore();
      expect(store.currentTab).toBe('Anggaran');
    });

    it('should allow changing currentTab value', () => {
      const store = useLamanDataTabStore();
      store.currentTab = 'Operasional';
      expect(store.currentTab).toBe('Operasional');
    });
  });

  describe('useLamanDataPeriodeStore', () => {
    it('should initialize with default values', () => {
      const store = useLamanDataPeriodeStore();
      expect(store.periodeTahun).toEqual([2020, 2023]);
      expect(store.periodeInitial).toBeUndefined();
    });
  });
});