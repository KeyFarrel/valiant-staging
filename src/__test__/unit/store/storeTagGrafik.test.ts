import { describe, it, expect, beforeEach, vi } from 'vitest';

// Remove Pinia mock for this specific test file
vi.unmock('pinia');

// Import Pinia and stores after unmocking
import { createPinia, setActivePinia } from 'pinia';
import { useTagSentral, useTagMesin, useLamanDataPeriodeStore } from '@/store/storeTagGrafik';

describe('storeTagGrafik', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
  });

  describe('useTagSentral', () => {
    it('should initialize with default currentTabSentral value', () => {
      const store = useTagSentral();
      
      expect(store.currentTabSentral).toBe("WLC (Realisasi & Proyeksi)");
      expect(typeof store.currentTabSentral).toBe('string');
    });

    it('should be able to update currentTabSentral value', () => {
      const store = useTagSentral();
      
      // Test reactivity by changing the value
      store.currentTabSentral = "New Tab Value";
      expect(store.currentTabSentral).toBe("New Tab Value");
    });
  });

  describe('useTagMesin', () => {
    it('should initialize with default currentTabMesin value', () => {
      const store = useTagMesin();
      
      expect(store.currentTabMesin).toBe("WLC (Realisasi & Proyeksi)");
      expect(typeof store.currentTabMesin).toBe('string');
    });

    it('should be able to update currentTabMesin value', () => {
      const store = useTagMesin();
      
      // Test reactivity by changing the value
      store.currentTabMesin = "Updated Tab";
      expect(store.currentTabMesin).toBe("Updated Tab");
    });
  });

  describe('useLamanDataPeriodeStore', () => {
    it('should initialize with default periode values', () => {
      const store = useLamanDataPeriodeStore();
      
      expect(store.periodeInitial).toBeUndefined();
      expect(store.periodeTahun).toEqual([2020, 2023]);
      expect(Array.isArray(store.periodeTahun)).toBe(true);
      expect(store.periodeTahun).toHaveLength(2);
    });

    it('should be able to update periode values', () => {
      const store = useLamanDataPeriodeStore();
      
      // Test updating periodeInitial
      store.periodeInitial = 2022;
      expect(store.periodeInitial).toBe(2022);
      
      // Test updating periodeTahun
      store.periodeTahun = [2024, 2025];
      expect(store.periodeTahun).toEqual([2024, 2025]);
      expect(store.periodeTahun).toHaveLength(2);
    });

    it('should handle different array lengths for periodeTahun', () => {
      const store = useLamanDataPeriodeStore();
      
      // Test with different array length
      store.periodeTahun = [2020, 2021, 2022];
      expect(store.periodeTahun).toHaveLength(3);
      expect(store.periodeTahun).toEqual([2020, 2021, 2022]);
    });
  });
});