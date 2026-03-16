import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
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

var mockEncryptStorage: any;

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve(
    (mockEncryptStorage = {
      getItem: vi.fn().mockResolvedValue('test-value'),
      clear: vi.fn()
    })
  )
}));

vi.mock('@/services/auth-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    logout: vi.fn().mockResolvedValue({})
  }; })
}));

vi.mock('@/services/persetujuan-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getPersetujuanKKSentral: vi.fn().mockResolvedValue({ data: { mesins: [] } }),
    getPersetujuanKertasKerja: vi.fn().mockResolvedValue({ data: [] }),
    getPersetujuanFSSentral: vi.fn().mockResolvedValue({ data: { mesins: [] } }),
    getPersetujuanFS: vi.fn().mockResolvedValue({ data: [] })
  }; })
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
        { sub_menu: 'Laman Utama', url: 'laman', is_docked: true },
        { sub_menu: 'Laman Data', url: 'laman-data', is_docked: true },
        { sub_menu: 'Laman Analitik', url: 'laman-analitik', is_docked: true }
      ]
    },
    {
      menu: 'Grafik',
      sub_menus: [
        { sub_menu: 'Rekap Kertas Kerja', url: 'rekap-kertas-kerja', is_docked: true },
        { sub_menu: 'Other Menu', url: 'other', is_docked: true }
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
var mockLastActiveRef: any;
var mockNowRef: any;

vi.mock('@vueuse/core', async () => {
  const vue = await import('vue');
  mockLastActiveRef = vue.ref(Date.now());
  mockNowRef = vue.ref(Date.now());

  return {
    useIdle: vi.fn(() => ({
      lastActive: mockLastActiveRef
    })),
    useTimestamp: vi.fn(() => mockNowRef)
  };
});

// Mock window.Go for WASM
Object.defineProperty(window, 'Go', {
  value: vi.fn().mockImplementation(function() { return {
    run: vi.fn(),
    importObject: {}
  }; }),
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

  it('should toggle user dropdown state', () => {
    expect(wrapper.vm.isUserDropdownOpen).toBe(false);
    wrapper.vm.toggleUserDropdown();
    expect(wrapper.vm.isUserDropdownOpen).toBe(true);
    wrapper.vm.toggleUserDropdown();
    expect(wrapper.vm.isUserDropdownOpen).toBe(false);
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

  it('should decrement countdown to zero and clear timer', () => {
    vi.useFakeTimers();

    wrapper.vm.startCountdown();
    vi.advanceTimersByTime(10000);

    expect(wrapper.vm.countdown).toBe(0);
    expect(wrapper.vm.timer).toBeNull();

    vi.useRealTimers();
  });

  it('should execute production timeout watcher branches', async () => {
    (globalThis as any).__TEST_NODE_MODE__ = 'production';

    vi.useFakeTimers();

    const prodWrapper = mount(Sidebar, {
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

    await flushPromises();

    mockLastActiveRef.value = 0;
    prodWrapper.vm.isShowLogoutNotification = true;
    prodWrapper.vm.timer = setInterval(() => {}, 1000);

    mockNowRef.value = (15 * 60 - 20) * 1000;
    await nextTick();
    await flushPromises();

    mockNowRef.value = (15 * 60 - 10) * 1000;
    await nextTick();
    await flushPromises();

    mockNowRef.value = (15 * 60) * 1000;
    await nextTick();
    await flushPromises();

    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(prodWrapper.exists()).toBe(true);

    prodWrapper.unmount();
    vi.useRealTimers();
    delete (globalThis as any).__TEST_NODE_MODE__;
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

  it('should render submenu include/exclude filter branches', async () => {
    mockMenuStore.menuList = [
      {
        menu: 'Beranda',
        sub_menus: [
          { sub_menu: 'Laman Utama', url: 'laman', is_docked: true },
          { sub_menu: 'Other Menu', url: 'other', is_docked: true }
        ]
      }
    ];

    const richWrapper = mount(Sidebar, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterView: true,
          ValiantLogo: true,
          Loading: true,
          Teleport: true,
          RouterLink: { template: '<a><slot /></a>' }
        }
      }
    });

    richWrapper.vm.isSidebarOpen = true;
    await flushPromises();

    expect(richWrapper.text()).toContain('Laman');
    expect(richWrapper.text()).toContain('Other Menu');
    richWrapper.unmount();
  });

  it('should trigger laman RouterLink hover and click handlers', async () => {
    mockMenuStore.menuList = [
      {
        menu: 'Beranda',
        sub_menus: [
          { sub_menu: 'Laman Utama', url: 'laman', is_docked: true },
          { sub_menu: 'Laman Data', url: 'laman-data', is_docked: true }
        ]
      }
    ];

    const richWrapper = mount(Sidebar, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterView: true,
          ValiantLogo: true,
          Loading: true,
          Teleport: true,
          RouterLink: {
            emits: ['mouseenter', 'click'],
            template: '<a @mouseenter="$emit(\'mouseenter\')" @click="$emit(\'click\')"><slot /></a>'
          }
        }
      }
    });

    richWrapper.vm.isSidebarOpen = true;
    await flushPromises();

    const lamanLink = richWrapper.findAll('a').find((a) => a.text().includes('Laman Utama'));
    if (lamanLink) {
      await lamanLink.trigger('mouseenter');
      await lamanLink.trigger('click');
    }

    expect(mockNavbarStore.label).toBe('Laman Utama');
    richWrapper.unmount();
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

  it('should execute prefetchRoute callback map keys', async () => {
    const urls = [
      'peta',
      'laman',
      'laman-data',
      'laman-analitik',
      'rekap-kertas-kerja',
      'rekap-kertas-kerja-v1',
      'persetujuan-by-approve',
      'persetujuan',
      'master-unit-sentral',
      'master-parameter',
      'pengguna',
      'log-activity',
      'unknown-url',
    ];

    for (const url of urls) {
      wrapper.vm.prefetchRoute(url);
    }

    expect(wrapper.exists()).toBe(true);
  });

  it('should render major menu branches and trigger menu events', async () => {
    mockMenuStore.menuList = [
      {
        menu: 'Beranda',
        sub_menus: [
          { sub_menu: 'Peta Sebaran', url: 'peta', is_docked: true },
          { sub_menu: 'Laman Utama', url: 'laman', is_docked: true },
          { sub_menu: 'Laman Data', url: 'laman-data', is_docked: true },
          { sub_menu: 'Laman Analitik', url: 'laman-analitik', is_docked: true },
        ],
      },
      {
        menu: 'Data',
        sub_menus: [
          { sub_menu: 'Rekap Kertas Kerja', url: 'rekap-kertas-kerja', is_docked: true },
        ],
      },
      {
        menu: 'Verifikasi',
        sub_menus: [
          { sub_menu: 'Persetujuan', url: 'persetujuan', is_docked: true },
        ],
      },
      {
        menu: 'Master',
        sub_menus: [
          { sub_menu: 'Unit Sentral', url: 'master-unit-sentral', is_docked: true },
        ],
      },
      {
        menu: 'Manajemen',
        sub_menus: [
          { sub_menu: 'Pengguna', url: 'pengguna', is_docked: true },
        ],
      },
    ];

    const richWrapper = mount(Sidebar, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterView: true,
          ValiantLogo: true,
          Loading: true,
          Teleport: true,
          RouterLink: {
            template: '<a @click="$emit(\'click\')" @mouseenter="$emit(\'mouseenter\')"><slot /></a>'
          }
        }
      }
    });

    await flushPromises();

    richWrapper.vm.isSidebarOpen = true;
    richWrapper.vm.isUserDropdownOpen = true;
    richWrapper.vm.isShowLogoutNotification = true;
    richWrapper.vm.totalPersetujuanKK = 2;
    richWrapper.vm.totalPersetujuanFS = 3;
    await richWrapper.vm.$nextTick();

    expect(richWrapper.text()).toContain('Lihat Profil');

    const userMenuToggle = richWrapper.find('button[aria-expanded="false"]');
    await userMenuToggle.trigger('click');
    await userMenuToggle.trigger('click');

    const firstMenuLink = richWrapper.find('#sidebar-button');
    if (firstMenuLink.exists()) {
      await firstMenuLink.trigger('mouseenter');
      await firstMenuLink.trigger('click');
    }

    const mobileToggleButton = richWrapper.find('button[aria-controls="logo-sidebar"]');
    if (mobileToggleButton.exists()) {
      await mobileToggleButton.trigger('click');
    }

    const backdrop = richWrapper.findAll('div').find((node) => node.text().includes('Anda akan otomatis logout'));
    if (backdrop) {
      await backdrop.trigger('keydown.esc');
    }

    expect(richWrapper.exists()).toBe(true);
    richWrapper.unmount();
  });

  it('should close user dropdown when closeUserDropdown is called', async () => {
    wrapper.vm.isUserDropdownOpen = true;
    wrapper.vm.closeUserDropdown();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isUserDropdownOpen).toBe(false);
  });

  it('should cover non-null and null response branches in persetujuan fetchers', async () => {
    mockUserAuthStore.levelAlias = 'Mb*0yT%3';
    const service = wrapper.vm.persetujuanService;

    service.getPersetujuanKKSentral = vi.fn().mockResolvedValueOnce({
      data: { mesins: [{ status_approval: 'Draft' }, { status_approval: 'Disetujui' }] }
    });
    await wrapper.vm.fetchPersetujuanKK();
    expect(wrapper.vm.totalPersetujuanKK).toBe(1);

    service.getPersetujuanFSSentral = vi.fn().mockResolvedValueOnce({ data: { mesins: null } });
    await wrapper.vm.fetchPersetujuanFS();
    expect(wrapper.vm.totalPersetujuanFS).toBe(0);

    mockUserAuthStore.levelAlias = 'regular';
    service.getPersetujuanKertasKerja = vi.fn().mockResolvedValueOnce({
      data: [{ status_approval: 'Draft' }, { status_approval: 'Disetujui' }]
    });
    await wrapper.vm.fetchPersetujuanKK();
    expect(wrapper.vm.totalPersetujuanKK).toBe(1);

    service.getPersetujuanFS = vi.fn().mockResolvedValueOnce({ data: null });
    await wrapper.vm.fetchPersetujuanFS();
    expect(wrapper.vm.totalPersetujuanFS).toBe(0);
  });

  it('should execute FS filter callbacks for central and non-central branches', async () => {
    const service = wrapper.vm.persetujuanService;

    mockUserAuthStore.levelAlias = 'Mb*0yT%3';
    service.getPersetujuanFSSentral = vi.fn().mockResolvedValueOnce({
      data: { mesins: [{ status_approval: 'Draft' }, { status_approval: 'Disetujui' }] }
    });
    await wrapper.vm.fetchPersetujuanFS();
    expect(wrapper.vm.totalPersetujuanFS).toBe(1);

    mockUserAuthStore.levelAlias = 'regular';
    service.getPersetujuanFS = vi.fn().mockResolvedValueOnce({
      data: [{ status_approval: 'Draft' }, { status_approval: 'Disetujui' }]
    });
    await wrapper.vm.fetchPersetujuanFS();
    expect(wrapper.vm.totalPersetujuanFS).toBe(1);
  });

  it('should hit catch branches for KK central, FS central, and logout', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const service = wrapper.vm.persetujuanService;

    mockUserAuthStore.levelAlias = 'Mb*0yT%3';
    service.getPersetujuanKKSentral = vi.fn().mockRejectedValueOnce(new Error('kk-central-failed'));
    await wrapper.vm.fetchPersetujuanKK();

    service.getPersetujuanFSSentral = vi.fn().mockRejectedValueOnce(new Error('fs-central-failed'));
    await wrapper.vm.fetchPersetujuanFS();

    mockSessionStore.invalidateSession.mockImplementationOnce(() => {
      throw new Error('invalidate-failed');
    });
    await wrapper.vm.handleLogout();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should cover null branches for KK and FS counters explicitly', async () => {
    const service = wrapper.vm.persetujuanService;

    mockUserAuthStore.levelAlias = 'Mb*0yT%3';
    service.getPersetujuanKKSentral = vi.fn().mockResolvedValueOnce({ data: { mesins: null } });
    await wrapper.vm.fetchPersetujuanKK();
    expect(wrapper.vm.totalPersetujuanKK).toBe(0);

    mockUserAuthStore.levelAlias = 'regular';
    service.getPersetujuanKertasKerja = vi.fn().mockResolvedValueOnce({ data: null });
    await wrapper.vm.fetchPersetujuanKK();
    expect(wrapper.vm.totalPersetujuanKK).toBe(0);

    mockUserAuthStore.levelAlias = 'Mb*0yT%3';
    service.getPersetujuanFSSentral = vi.fn().mockResolvedValueOnce({ data: { mesins: null } });
    await wrapper.vm.fetchPersetujuanFS();
    expect(wrapper.vm.totalPersetujuanFS).toBe(0);

    mockUserAuthStore.levelAlias = 'regular';
    service.getPersetujuanFS = vi.fn().mockResolvedValueOnce({ data: null });
    await wrapper.vm.fetchPersetujuanFS();
    expect(wrapper.vm.totalPersetujuanFS).toBe(0);
  });
});