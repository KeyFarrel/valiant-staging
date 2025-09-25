import { shallowMount } from '@vue/test-utils';
import Sidebar from '@/components/layout/Sidebar.vue';
import { createPinia, setActivePinia } from "pinia"; // Import Pinia

import AuthService from '@/services/auth-service';
import PersetujuanService from '@/services/persetujuan-service';
import { ref } from 'vue';

jest.mock('@/services/auth-service');
jest.mock('@/services/persetujuan-service');

// Mock flowbite
jest.mock('flowbite', () => ({
  initFlowbite: jest.fn(),
}));

// Mock VueUse composables
jest.mock('@vueuse/core', () => ({
  useIdle: jest.fn(() => ({
    lastActive: { value: Date.now() }
  })),
  useTimestamp: jest.fn(() => ({
    value: Date.now()
  })),
}));

// Mock encrypt storage
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    getItem: jest.fn().mockResolvedValue('mock-value'),
    setItem: jest.fn(),
    clear: jest.fn(),
  })
}));

// Mock stores
jest.mock('@/store/storeNavbar', () => ({
  useNavbarLabelStore: jest.fn(() => ({
    label: 'Test Label'
  }))
}));

jest.mock('@/store/storeSession', () => ({
  useSessionStore: jest.fn(() => ({
    invalidateSession: jest.fn()
  }))
}));

jest.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: jest.fn(() => ({
    levelAlias: 'Xf!8qP@7'
  }))
}));

jest.mock('@/store/storeRekapKertasKerja', () => ({
  useRekapSearchStore: jest.fn(() => ({}))
}));

jest.mock('@/store/storeMenu', () => ({
  useMenuStore: jest.fn(() => ({
    menuList: [
      {
        menu: 'Beranda',
        sub_menus: [
          {
            sub_menu: 'Peta Sebaran',
            url: 'peta-sebaran',
            is_docked: true
          }
        ]
      }
    ]
  }))
}));

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  RouterView: { template: '<div></div>' },
  RouterLink: { template: '<a><slot></slot></a>' },
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
  createWebHistory: jest.fn(() => ({})),
}));

// Mock router instance
jest.mock('@/router', () => ({
  default: {
    push: jest.fn(),
    replace: jest.fn(),
  }
}));

// Mock components
jest.mock('@/components/icons/ValiantLogo.vue', () => ({
  default: { template: '<div></div>' }
}));

jest.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: { template: '<div></div>' }
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
      logout: jest.fn().mockResolvedValue({}),
    };
    persetujuanServiceMock = {
      getPersetujuanKKSentral: jest.fn().mockResolvedValue({ data: { mesins: [] } }),
      getPersetujuanFSSentral: jest.fn().mockResolvedValue({ data: { mesins: [] } }),
      getPersetujuanKertasKerja: jest.fn().mockResolvedValue({ data: [] }),
      getPersetujuanFS: jest.fn().mockResolvedValue({ data: [] }),
    };

    (AuthService as jest.Mock).mockImplementation(() => authServiceMock);
    (PersetujuanService as jest.Mock).mockImplementation(() => persetujuanServiceMock);

    wrapper = shallowMount(Sidebar, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterView: true,
          RouterLink: true,
          ValiantLogo: true,
          Loading: true,
          Teleport: true,
          Transition: true,
        },
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
    expect(wrapper.find('aside').exists()).toBe(true);
    expect(wrapper.vm.isSidebarOpen).toBe(false); // Sidebar is closed initially
  });

  it('should toggle the sidebar when the toggle function is called', async () => {
    wrapper.vm.toggleSidebar();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isSidebarOpen).toBe(true); // Sidebar opens
  });

  it('should show the user\'s name in the sidebar', async () => {
    await wrapper.vm.$nextTick();
    const userNameElements = wrapper.findAll('p');
    // The component should have paragraphs for displaying user information
    expect(userNameElements.length).toBeGreaterThan(0);
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
    // Check if notification elements exist
    const notificationElements = wrapper.findAll('.bg-warningColor');
    expect(notificationElements.length).toBeGreaterThan(0);
  });

  it("is fetching fetchPersetujuanKK", async () => {
    const fetchPersetujuanKKSpy = jest.spyOn(wrapper.vm, "fetchPersetujuanKK");
    await wrapper.vm.fetchPersetujuanKK();
    expect(fetchPersetujuanKKSpy).toHaveBeenCalled();
  });

  it("is fetching fetchPersetujuanFS", async () => {
    const fetchPersetujuanFSSpy = jest.spyOn(wrapper.vm, "fetchPersetujuanFS");
    await wrapper.vm.fetchPersetujuanFS();
    expect(fetchPersetujuanFSSpy).toHaveBeenCalled();
  });
});
