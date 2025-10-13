import { describe, it, expect, vi } from 'vitest';

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useOnline: vi.fn()
}));

// Mock Pinia
vi.mock('pinia', () => ({
  defineStore: vi.fn((name, setup) => {
    return () => setup();
  })
}));

// Mock computed from Vue
vi.mock('vue', () => ({
  computed: vi.fn((fn) => ({ value: fn() }))
}));

describe('useConnectionStatusStore', () => {
  it('should create store with online status when connected', async () => {
    const { useOnline } = await import('@vueuse/core');
    const { computed } = await import('vue');
    
    // Mock online status as true
    (useOnline as any).mockReturnValue({ value: true });
    (computed as any).mockImplementation((fn: any) => fn());
    
    const { useConnectionStatusStore } = await import('@/store/storeGlobal');
    const store = useConnectionStatusStore();
    
    expect(store).toBeDefined();
    expect(store.isOnline).toBe(true);
  });

  it('should create store with offline status when disconnected', async () => {
    const { useOnline } = await import('@vueuse/core');
    const { computed } = await import('vue');
    
    // Mock online status as false
    (useOnline as any).mockReturnValue({ value: false });
    (computed as any).mockImplementation((fn: any) => fn());
    
    const { useConnectionStatusStore } = await import('@/store/storeGlobal');
    const store = useConnectionStatusStore();
    
    expect(store).toBeDefined();
    expect(store.isOnline).toBe(false);
  });

  it('should call useOnline composable', async () => {
    const { useOnline } = await import('@vueuse/core');
    const { computed } = await import('vue');
    
    (useOnline as any).mockReturnValue({ value: true });
    (computed as any).mockImplementation((fn: any) => fn());
    
    const { useConnectionStatusStore } = await import('@/store/storeGlobal');
    useConnectionStatusStore();
    
    expect(useOnline).toHaveBeenCalled();
  });
});