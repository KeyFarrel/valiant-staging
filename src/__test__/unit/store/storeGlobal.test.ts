import { setActivePinia, createPinia } from 'pinia';
import { useConnectionStatusStore } from '@/store/storeGlobal';
import { useOnline } from '@vueuse/core';
import { ref } from 'vue';

// Mocking the useOnline from @vueuse/core
jest.mock('@vueuse/core', () => ({
  useOnline: jest.fn()
}));

describe('useConnectionStatusStore', () => {
  beforeEach(() => {
    // Set up Pinia for testing
    setActivePinia(createPinia());
  });

  it('should return online status as true when online', () => {
    // Mock useOnline to return true
    (useOnline as jest.Mock).mockReturnValue(ref(true));

    const store = useConnectionStatusStore();

    // Check if isOnline is true
    expect(store.isOnline).toBe(true);
  });

  it('should return online status as false when offline', () => {
    // Mock useOnline to return false
    (useOnline as jest.Mock).mockReturnValue(ref(false));

    const store = useConnectionStatusStore();

    // Check if isOnline is false
    expect(store.isOnline).toBe(false);
  });
});
