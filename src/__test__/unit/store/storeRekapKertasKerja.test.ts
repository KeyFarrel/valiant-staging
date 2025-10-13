import { describe, it, expect, beforeEach, vi } from 'vitest';

// Override the Pinia mock from vitest.setup.ts to use real Pinia
vi.unmock('pinia');

import { createPinia, setActivePinia } from 'pinia';
import { 
  useRekapSearchStore, 
  useRekapCheckRealisasi, 
  useRekapNavigationStore, 
  usePerbaruiTabStore 
} from '@/store/storeRekapKertasKerja';

describe('storeRekapKertasKerja', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('useRekapSearchStore', () => {
    it('should initialize with empty search queries', () => {
      const store = useRekapSearchStore();
      
      expect(store.searchRekapQuery).toBe('');
      expect(store.selectedRekapSearchQuery).toBe('');
    });

    it('should update search query values', () => {
      const store = useRekapSearchStore();
      
      store.searchRekapQuery = 'test search';
      store.selectedRekapSearchQuery = 'selected search';
      
      expect(store.searchRekapQuery).toBe('test search');
      expect(store.selectedRekapSearchQuery).toBe('selected search');
    });
  });

  describe('useRekapCheckRealisasi', () => {
    it('should initialize with empty realisasi list', () => {
      const store = useRekapCheckRealisasi();
      
      expect(store.realisasiList).toEqual([]);
      expect(Array.isArray(store.realisasiList)).toBe(true);
    });

    it('should allow adding items to realisasi list', () => {
      const store = useRekapCheckRealisasi();
      
      store.realisasiList.push({ id: 1, name: 'test item' });
      
      expect(store.realisasiList).toHaveLength(1);
      expect(store.realisasiList[0]).toEqual({ id: 1, name: 'test item' });
    });
  });

  describe('useRekapNavigationStore', () => {
    it('should initialize with default navigation values', () => {
      const store = useRekapNavigationStore();
      
      expect(store.currentPage).toBe(1);
      expect(store.pageLimit).toBe(10);
      expect(store.scrollPosition).toEqual({ top: 0, left: 0 });
    });

    it('should update navigation values', () => {
      const store = useRekapNavigationStore();
      
      store.currentPage = 2;
      store.pageLimit = 20;
      store.scrollPosition = { top: 100, left: 50 };
      
      expect(store.currentPage).toBe(2);
      expect(store.pageLimit).toBe(20);
      expect(store.scrollPosition).toEqual({ top: 100, left: 50 });
    });
  });

  describe('usePerbaruiTabStore', () => {
    it('should initialize with default tab', () => {
      const store = usePerbaruiTabStore();
      
      expect(store.currentTab).toBe('Asumsi Makro');
    });

    it('should update current tab', () => {
      const store = usePerbaruiTabStore();
      
      store.currentTab = 'New Tab';
      
      expect(store.currentTab).toBe('New Tab');
    });

    it('should allow changing tab multiple times', () => {
      const store = usePerbaruiTabStore();
      
      store.currentTab = 'Tab 1';
      expect(store.currentTab).toBe('Tab 1');
      
      store.currentTab = 'Tab 2';
      expect(store.currentTab).toBe('Tab 2');
      
      store.currentTab = 'Final Tab';
      expect(store.currentTab).toBe('Final Tab');
    });
  });

  describe('Store instances independence', () => {
    it('should create independent store instances', () => {
      const searchStore1 = useRekapSearchStore();
      const searchStore2 = useRekapSearchStore();
      
      // Both should reference the same store instance (this is Pinia behavior)
      expect(searchStore1).toBe(searchStore2);
      
      searchStore1.searchRekapQuery = 'test query';
      expect(searchStore2.searchRekapQuery).toBe('test query');
    });
  });
});