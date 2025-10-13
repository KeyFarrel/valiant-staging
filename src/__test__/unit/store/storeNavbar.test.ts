import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref } from 'vue';

// Import real pinia for proper testing
vi.unmock('pinia');
import { createPinia, setActivePinia } from 'pinia';
import { useNavbarLabelStore } from '@/store/storeNavbar';

describe('useNavbarLabelStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with empty label', () => {
    const store = useNavbarLabelStore();
    expect(store.label).toBe('');
  });

  it('should allow setting a label value', () => {
    const store = useNavbarLabelStore();
    store.label = 'Test Label';
    expect(store.label).toBe('Test Label');
  });

  it('should allow setting undefined label', () => {
    const store = useNavbarLabelStore();
    store.label = undefined;
    expect(store.label).toBeUndefined();
  });
});