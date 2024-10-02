import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import { useConnectionStatusStore } from '@/store/storeGlobal';
import { useIdle } from '@vueuse/core';
import AuthService from '@/services/auth-service';
const NoConnectionLottie = require('@/assets/lottie/no-connection.json');

// Mock useIdle from @vueuse/core
jest.mock('@vueuse/core', () => ({
  useIdle: jest.fn(),
}));

// Mock AuthService
jest.mock('@/services/auth-service');
const mockAuthService = new AuthService();

// Mock Pinia store
jest.mock('@/store/storeGlobal', () => ({
  useConnectionStatusStore: jest.fn(() => ({
    isOnline: true, // Mock the default state for isOnline
  })),
}));

globalThis.importMetaEnv = {
  MODE: "development",
};

describe('App.vue', () => {
  let wrapper: any;
  let mockStore: any;
  let mockIdle: any;

  beforeEach(() => {
    // Set up globalThis.importMetaEnv to mock import.meta.env

    // Mock the store and idle state
    mockStore = useConnectionStatusStore();
    mockIdle = {
      idle: false, // initially not idle
      lastActive: 0,
    };

    // Mock the useIdle hook
    (useIdle as jest.Mock).mockReturnValue(mockIdle);

    // Shallow mount the component
    wrapper = shallowMount(App, {
      global: {
        stubs: {
          RouterView: true, // Stub RouterView to avoid full router setup
          Vue3Lottie: true, // Stub Vue3Lottie for simplicity
        },
      },
    });
  });

  it('renders the RouterView component', () => {
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true);
  });

  it('renders the modal when store.isOnline is false', async () => {
    mockStore.isOnline = false; // Simulate offline state
    await wrapper.vm.$nextTick();

    const modalWrapper = wrapper.findComponent(ModalWrapper);
    expect(modalWrapper.exists()).toBe(true);
    expect(modalWrapper.props('showModal')).toBe(true);
  });

  it('hides the modal when store.isOnline is true', async () => {
    mockStore.isOnline = true; // Simulate online state
    await wrapper.vm.$nextTick();

    const modalWrapper = wrapper.findComponent(ModalWrapper);
    expect(modalWrapper.exists()).toBe(true);
    expect(modalWrapper.props('showModal')).toBe(false);
  });

  it('renders the Vue3Lottie component when the modal is shown', async () => {
    mockStore.isOnline = false; // Simulate offline state
    await wrapper.vm.$nextTick();

    const lottieComponent = wrapper.findComponent({ name: 'Vue3Lottie' });
    expect(lottieComponent.exists()).toBe(true);
    expect(lottieComponent.props('animationData')).toBe(NoConnectionLottie);
  });

  it('calls authService.logOut when idle for 10 minutes in production mode', async () => {
    // Set the mode to production
    globalThis.importMetaEnv.MODE = 'production';
    mockIdle.idle = true; // Simulate idle

    // Simulate watcher
    await wrapper.vm.$nextTick();

    expect(mockAuthService.logOut).toHaveBeenCalled();
  });

  it('does not call authService.logOut when not in production mode', async () => {
    // Set the mode to development
    globalThis.importMetaEnv.MODE = 'development';
    mockIdle.idle = true; // Simulate idle

    // Simulate watcher
    await wrapper.vm.$nextTick();

    expect(mockAuthService.logOut).not.toHaveBeenCalled();
  });
});
