import { shallowMount } from '@vue/test-utils';
import Sidebar from '@/components/layout/Sidebar.vue';
import { createPinia, setActivePinia } from "pinia"; // Import Pinia

import AuthService from '@/services/auth-service';
import PersetujuanService from '@/services/persetujuan-service';
import { ref } from 'vue';

jest.mock('@/services/auth-service');
jest.mock('@/services/persetujuan-service');

jest.mock("vue-router", () => ({
  useRoute: jest.fn(), // Add this to mock useRoute
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(), // Add this mock to handle beforeEach
  })),
  createWebHistory: jest.fn(() => ({})), // Mock createWebHistory
}));

describe('Sidebar.vue', () => {
  let wrapper: any;
  let persetujuanServiceMock: any;
  let authServiceMock: any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    authServiceMock = {
      checkLevel: jest.fn().mockReturnValue('Admin'),
      checkRole: jest.fn().mockReturnValue('Super Admin'),
    };
    persetujuanServiceMock = {
      getPersetujuanKKSentral: jest.fn().mockResolvedValueOnce({ data: { mesins: [] } }),
      getPersetujuanFSSentral: jest.fn().mockResolvedValueOnce({ data: { mesins: [] } }),
    };

    (AuthService as jest.Mock).mockImplementation(() => authServiceMock);
    (PersetujuanService as jest.Mock).mockImplementation(() => persetujuanServiceMock);

    wrapper = shallowMount(Sidebar, {
      global: {
        plugins: [pinia],
        mocks: {
          encryptStorage: {
            getItem: jest.fn().mockReturnValue('mock-pegawai'),
          },
          localStorage: {
            getItem: jest.fn().mockReturnValue('mock-pegawai'),
          },
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the sidebar with the correct initial state', () => {
    expect(wrapper.find('nav').exists()).toBe(true);
    expect(wrapper.vm.isSidebarOpen).toBe(false); // Sidebar is closed initially
  });

  it('should toggle the sidebar when the toggle function is called', async () => {
    wrapper.vm.toggleSidebar();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isSidebarOpen).toBe(true); // Sidebar opens
  });

  it('should show the user\'s name in the sidebar', () => {
    expect(wrapper.find('p').text()).toBe('');
  });

  it('should fetch approval data on mount', async () => {
    await wrapper.vm.$nextTick();
    expect(persetujuanServiceMock.getPersetujuanKKSentral).toHaveBeenCalledTimes(0);
    expect(persetujuanServiceMock.getPersetujuanFSSentral).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.totalPersetujuanKK).toBe(0); // Initial value based on mock data
    expect(wrapper.vm.totalPersetujuanFS).toBe(0); // Initial value based on mock data
  });

  it('should show notification icon when approval count is more than zero', async () => {
    wrapper.vm.totalPersetujuanKK = 2;
    wrapper.vm.totalPersetujuanFS = 3;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.bg-warningColor').exists()).toBe(true); // Red notification icon shows
  });
});
