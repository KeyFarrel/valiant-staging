import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import App from '@/App.vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  RouterView: {
    name: 'RouterView',
    template: '<div data-testid="router-view">Router Content</div>'
  }
}));

// Mock Vue3Lottie
vi.mock('vue3-lottie', () => ({
  Vue3Lottie: {
    name: 'Vue3Lottie',
    props: ['animationData', 'width', 'height'],
    template: '<div data-testid="lottie">Animation</div>'
  }
}));

// Mock the store
vi.mock('@/store/storeGlobal', () => ({
  useConnectionStatusStore: vi.fn()
}));

// Mock lottie animation data
vi.mock('@/assets/lottie/no-connection.json', () => ({
  default: { animation: 'data' }
}));

describe('App.vue', () => {
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
    vi.clearAllMocks();
  });

  it('should render the component successfully', async () => {
    const { useConnectionStatusStore } = await vi.importMock('@/store/storeGlobal');
    (useConnectionStatusStore as any).mockReturnValue({
      isOnline: true
    });

    const wrapper = shallowMount(App, {
      global: {
        plugins: [pinia]
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should show offline modal when connection is lost', async () => {
    const { useConnectionStatusStore } = await vi.importMock('@/store/storeGlobal');
    (useConnectionStatusStore as any).mockReturnValue({
      isOnline: false
    });
    
    const wrapper = shallowMount(App, {
      global: {
        plugins: [pinia]
      }
    });

    expect(wrapper.html()).toContain('showmodal="true"');
  });

  it('should hide offline modal when connection is online', async () => {
    const { useConnectionStatusStore } = await vi.importMock('@/store/storeGlobal');
    (useConnectionStatusStore as any).mockReturnValue({
      isOnline: true
    });
    
    const wrapper = shallowMount(App, {
      global: {
        plugins: [pinia]
      }
    });

    expect(wrapper.html()).toContain('showmodal="false"');
  });
});