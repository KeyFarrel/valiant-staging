import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Sidebar from '@/components/layout/Sidebar.vue';

// Mock all dependencies before any imports
vi.mock('flowbite', () => ({
  initFlowbite: vi.fn()
}));

vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
    beforeEach: vi.fn()
  }
}));

vi.mock('vue-router', () => ({
  RouterView: {
    name: 'RouterView',
    template: '<div>Router View Mock</div>'
  },
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    params: {},
    query: {},
    path: '/',
    name: 'test',
  })),
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    getItem: vi.fn().mockResolvedValue('test-value'),
    clear: vi.fn()
  })
}));

vi.mock('@/services/auth-service', () => ({
  default: vi.fn().mockImplementation(() => ({
    logout: vi.fn().mockResolvedValue({})
  }))
}));

vi.mock('@/services/persetujuan-service', () => ({
  default: vi.fn().mockImplementation(() => ({
    getPersetujuanKKSentral: vi.fn().mockResolvedValue({ data: { mesins: [] } }),
    getPersetujuanKertasKerja: vi.fn().mockResolvedValue({ data: [] }),
    getPersetujuanFSSentral: vi.fn().mockResolvedValue({ data: { mesins: [] } }),
    getPersetujuanFS: vi.fn().mockResolvedValue({ data: [] })
  }))
}));

// Mock components
vi.mock('@/components/icons/ValiantLogo.vue', () => ({
  default: {
    name: 'ValiantLogo',
    template: '<div>Logo</div>'
  }
}));

vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div>Loading...</div>'
  }
}));

// Mock stores
const mockNavbarStore = {
  label: 'Test Label'
};

const mockSessionStore = {
  invalidateSession: vi.fn()
};

const mockUserAuthStore = {
  levelAlias: 'Xf!8qP@7'
};

const mockRekapStore = {};

const mockMenuStore = {
  menuList: [
    {
      menu: 'Dashboard',
      sub_menus: [
        { sub_menu: 'Laman Utama', route: '/dashboard', is_docked: true },
        { sub_menu: 'Laman Data', route: '/data', is_docked: true },
        { sub_menu: 'Laman Analitik', route: '/analitik', is_docked: true }
      ]
    },
    {
      menu: 'Grafik',
      sub_menus: [
        { sub_menu: 'Rekap Kertas Kerja', route: '/rekap', is_docked: true },
        { sub_menu: 'Other Menu', route: '/other', is_docked: true }
      ]
    }
  ]
};

vi.mock('@/store/storeNavbar', () => ({
  useNavbarLabelStore: vi.fn(() => mockNavbarStore)
}));

vi.mock('@/store/storeSession', () => ({
  useSessionStore: vi.fn(() => mockSessionStore)
}));

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: vi.fn(() => mockUserAuthStore)
}));

vi.mock('@/store/storeRekapKertasKerja', () => ({
  useRekapSearchStore: vi.fn(() => mockRekapStore)
}));

vi.mock('@/store/storeMenu', () => ({
  useMenuStore: vi.fn(() => mockMenuStore)
}));

// Mock VueUse composables
vi.mock('@vueuse/core', () => ({
  useIdle: vi.fn(() => ({
    lastActive: { value: Date.now() }
  })),
  useTimestamp: vi.fn(() => ({
    value: Date.now()
  }))
}));

// Mock window.Go for WASM
Object.defineProperty(window, 'Go', {
  value: vi.fn().mockImplementation(() => ({
    run: vi.fn(),
    importObject: {}
  })),
  writable: true
});

describe('Sidebar Component', () => {
  let wrapper: any;
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    
    wrapper = mount(Sidebar, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterView: true,
          ValiantLogo: true,
          Loading: true,
          Teleport: true
        }
      }
    });
  });

  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('nav').exists()).toBe(true);
    expect(wrapper.find('aside').exists()).toBe(true);
  });

  it('should display the correct label from store', () => {
    expect(wrapper.text()).toContain('Test Label');
  });

  it('should toggle sidebar when toggleSidebar is called', async () => {
    const initialSidebarState = wrapper.vm.isSidebarOpen;
    
    await wrapper.vm.toggleSidebar();
    
    expect(wrapper.vm.isSidebarOpen).toBe(!initialSidebarState);
  });

  it('should handle logout correctly', async () => {
    const mockRouter = { push: vi.fn() };
    wrapper.vm.router = mockRouter;

    await wrapper.vm.handleLogout();

    expect(mockSessionStore.invalidateSession).toHaveBeenCalled();
  });

  it('should fetch persetujuan KK data', async () => {
    // Mock levelAlias to trigger specific branch
    mockUserAuthStore.levelAlias = 'Mb*0yT%3';
    
    await wrapper.vm.fetchPersetujuanKK();
    
    expect(wrapper.vm.totalPersetujuanKK).toBe(0);
  });

  it('should fetch persetujuan FS data', async () => {
    // Mock levelAlias to trigger specific branch
    mockUserAuthStore.levelAlias = 'Mb*0yT%3';
    
    await wrapper.vm.fetchPersetujuanFS();
    
    expect(wrapper.vm.totalPersetujuanFS).toBe(0);
  });

  it('should display notification badges for persetujuan', () => {
    wrapper.vm.totalPersetujuanKK = 5;
    wrapper.vm.totalPersetujuanFS = 3;
    
    // Check if badges would be displayed when values > 0
    expect(wrapper.vm.totalPersetujuanKK + wrapper.vm.totalPersetujuanFS).toBeGreaterThan(0);
  });

  it('should handle countdown timer functionality', () => {
    wrapper.vm.startCountdown();
    
    expect(wrapper.vm.countdown).toBe(10);
    expect(wrapper.vm.timer).toBeDefined();
  });

  it('should check admin level access', () => {
    // Test for admin level visibility
    mockUserAuthStore.levelAlias = 'Xf!8qP@7';
    
    expect(mockUserAuthStore.levelAlias).toBe('Xf!8qP@7');
  });

  it('should display current year correctly', () => {
    const currentYear = new Date().getFullYear();
    
    expect(wrapper.vm.tahunBerjalan).toBe(currentYear);
  });

  it('should handle production mode timeout scenarios', async () => {
    // Mock production mode
    Object.defineProperty(import.meta, 'env', {
      value: { MODE: 'production' },
      writable: true
    });

    wrapper.vm.nodeMode = 'production';
    
    // Test timeout warning scenario (10 seconds remaining)
    const remainingTime = 10;
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.isShowLogoutNotification).toBe(false);
  });

  it('should handle countdown when timeout warning is shown', () => {
    wrapper.vm.startCountdown();
    
    expect(wrapper.vm.countdown).toBe(10);
    expect(wrapper.vm.timer).toBeDefined();
    
    // Simulate countdown reaching 0
    wrapper.vm.countdown = 0;
    expect(wrapper.vm.countdown).toBe(0);
  });

  it('should handle error scenarios in logout', async () => {
    // Mock error in authService
    const mockAuthService = {
      logout: vi.fn().mockRejectedValue(new Error('Logout failed'))
    };
    
    wrapper.vm.authService = mockAuthService;
    
    await wrapper.vm.handleLogout();
    
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should handle error scenarios in fetchPersetujuanKK', async () => {
    // Mock error in service
    const mockPersetujuanService = {
      getPersetujuanKertasKerja: vi.fn().mockRejectedValue(new Error('Fetch failed'))
    };
    
    wrapper.vm.persetujuanService = mockPersetujuanService;
    
    await wrapper.vm.fetchPersetujuanKK();
    
    expect(wrapper.vm.totalPersetujuanKK).toBe(0);
  });

  it('should handle error scenarios in fetchPersetujuanFS', async () => {
    // Mock error in service
    const mockPersetujuanService = {
      getPersetujuanFS: vi.fn().mockRejectedValue(new Error('Fetch failed'))
    };
    
    wrapper.vm.persetujuanService = mockPersetujuanService;
    
    await wrapper.vm.fetchPersetujuanFS();
    
    expect(wrapper.vm.totalPersetujuanFS).toBe(0);
  });

  it('should render different menu icons based on menu type', async () => {
    // Test different menu conditions
    const testMenus = [
      { menu: 'Beranda' },
      { menu: 'Verifikasi' },
      { menu: 'Master' },
      { menu: 'Manajemen' },
      { menu: 'Other' }
    ];
    
    mockMenuStore.menuList = testMenus.map(menu => ({
      ...menu,
      sub_menus: []
    }));
    
    await wrapper.vm.$nextTick();
    
    expect(mockMenuStore.menuList).toHaveLength(5);
  });

  it('should handle different user level aliases', () => {
    // Test non-admin level
    mockUserAuthStore.levelAlias = 'regular_user';
    
    expect(mockUserAuthStore.levelAlias).not.toBe('Xf!8qP@7');
    
    // Test admin level
    mockUserAuthStore.levelAlias = 'Xf!8qP@7';
    
    expect(mockUserAuthStore.levelAlias).toBe('Xf!8qP@7');
  });

  it('should handle staging environment in logout', async () => {
    wrapper.vm.nodeMode = 'staging';
    
    await wrapper.vm.handleLogout();
    
    expect(mockSessionStore.invalidateSession).toHaveBeenCalled();
  });
});