import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import GrafikPage from '@/views/Data/GrafikPage.vue';

// Mock window.Go for WASM
Object.defineProperty(window, 'Go', {
  value: vi.fn().mockImplementation(function() { return {
    run: vi.fn(),
    importObject: {}
  }; }),
  writable: true
});

// Mock WebAssembly
global.WebAssembly = {
  instantiateStreaming: vi.fn().mockResolvedValue({
    instance: {}
  })
} as any;

// Mock fetch for WASM
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  status: 200
});

// Mock vue-router
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: () => ({
      params: { id: 'test-id' }
    }),
    useRouter: () => ({
      push: vi.fn()
    }),
    createRouter: vi.fn(() => ({
      push: vi.fn(),
      beforeEach: vi.fn()
    })),
    createWebHistory: vi.fn()
  };
});

// Mock the router import specifically
vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
    beforeEach: vi.fn()
  }
}));

// Mock the services
vi.mock('@/services/peta-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getSentralByKode: vi.fn().mockResolvedValue({
      data: {
        uuid_sentral: 'test-sentral-id',
        tahun_data: '2024',
        jumlah_mesin: 2,
        mesins: [
          {
            mesin: 'Mesin 1',
            uuid_mesin: 'mesin-1',
            tahun_data: '2024',
            photo1: 'photo1.jpg'
          },
          {
            mesin: 'Mesin 2', 
            uuid_mesin: 'mesin-2',
            tahun_data: '2024',
            photo1: 'photo2.jpg'
          }
        ]
      }
    }),
    getPetaSentral: vi.fn().mockResolvedValue({
      data: [
        {
          kode_sentral: 'test-kode',
          sentral: 'Test Sentral'
        }
      ]
    })
  }; })
}));

vi.mock('@/services/grafik-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getYearSentral: vi.fn().mockResolvedValue({
      data: [
        { tahun: 2022 },
        { tahun: 2023 },
        { tahun: 2024 }
      ]
    }),
    getYearMesin: vi.fn().mockResolvedValue({
      data: [
        { tahun: 2022 },
        { tahun: 2023 },
        { tahun: 2024 }
      ]
    })
  }; })
}));

vi.mock('@/services/detail-sentral-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getPhoto: vi.fn().mockResolvedValue({
      data: new ArrayBuffer(8)
    })
  }; })
}));

vi.mock('@/services/auth-service', () => ({
  default: vi.fn().mockImplementation(function() { return {}; })
}));

vi.mock('@/services/helper/year-picker-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    filterYears: vi.fn().mockReturnValue([])
  }; })
}));

// Mock app-encrypt-storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: vi.fn((value) => value),
    decryptValue: vi.fn((value) => value)
  })
}));

// Mock stores
vi.mock('@/store/storeTagGrafik', () => ({
  useTagSentral: () => ({
    currentTabSentral: 'WLC (Realisasi & Proyeksi)'
  }),
  useTagMesin: () => ({
    currentTabMesin: 'WLC (Realisasi & Proyeksi)'
  })
}));

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: () => ({
    levelAlias: 'test-level'
  })
}));

vi.mock('@/store/storeNavbar', () => ({
  useNavbarLabelStore: () => ({})
}));

vi.mock('@/store/storeMenu', () => ({
  useMenuStore: () => ({})
}));

// Mock other utilities
vi.mock('@/utils/os-detector', () => ({
  osDetector: {
    getOS: () => 'macOS'
  }
}));

vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn()
}));

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(function() { return {
    formatRupiah: vi.fn((value) => `Rp ${value}`)
  }; })
}));

describe('GrafikPage', () => {
  let wrapper: any;
  
  const mockRoute = {
    params: { id: 'test-id' }
  };

  const mockRouter = {
    push: vi.fn()
  };

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    
    wrapper = mount(GrafikPage, {
      global: {
        plugins: [pinia],
        mocks: {
          $route: mockRoute,
          $router: mockRouter
        },
        stubs: {
          Loading: true,
          SearchBox: true,
          ModalSearch: true,
          TagSentral: true,
          TagMesin: true,
          GrafikSentral: true,
          GrafikMesin: true,
          InfoSentral: true,
          InfoMesin: true,
          Chips: true,
          VueDatePicker: true
        }
      }
    });
  });

  it('should render component successfully', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.w-full.p-4.space-y-3.bg-white.border.rounded-md').exists()).toBe(true);
  });

  it('should toggle button when toggleButton is called', async () => {
    const initialHoverState = wrapper.vm.isHover;
    await wrapper.vm.toggleButton();
    expect(wrapper.vm.isHover).toBe(!initialHoverState);
  });

  it('should change selected title when changeTabMesin is called', async () => {
    const testMesin = 'Test Mesin';
    await wrapper.vm.changeTabMesin(testMesin);
    expect(wrapper.vm.selectedTitle).toBe(testMesin);
  });

  it('should toggle detail when toggleDetail is called', async () => {
    const initialState = wrapper.vm.isOver;
    await wrapper.vm.toggleDetail();
    expect(wrapper.vm.isOver).toBe(!initialState);
  });

  it('should toggle pembina hover when detailPembina is called', async () => {
    const initialState = wrapper.vm.pembinaHover;
    await wrapper.vm.detailPembina();
    expect(wrapper.vm.pembinaHover).toBe(!initialState);
  });

  it('should toggle message when showElement is called', async () => {
    const initialState = wrapper.vm.message;
    await wrapper.vm.showElement();
    expect(wrapper.vm.message).toBe(!initialState);
  });

  it('should open search modal when handleFocus is called', async () => {
    await wrapper.vm.handleFocus();
    expect(wrapper.vm.isSearchModalOpen).toBe(true);
  });

  it('should change tab when changeTab is called with different values', async () => {
    // Test tab 1
    await wrapper.vm.changeTab(1);
    expect(wrapper.vm.tabs).toBe('WLC (Realisasi & Proyeksi)');

    // Test tab 2
    await wrapper.vm.changeTab(2);
    expect(wrapper.vm.tabs).toBe('Planning / Feasibility Study');

    // Test tab 3
    await wrapper.vm.changeTab(3);
    expect(wrapper.vm.tabs).toBe('Planning & Realisasi + Proyeksi');

    // Test tab 4
    await wrapper.vm.changeTab(4);
    expect(wrapper.vm.tabs).toBe('Planning vs Realisasi s/d Tahun Berjalan');
  });

  it('should call handleChangeSentral function', async () => {
    const spy = vi.spyOn(wrapper.vm, 'handleChangeSentral');
    await wrapper.vm.handleChangeSentral();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle component lifecycle with props', async () => {
    const wrapperWithProps = mount(GrafikPage, {
      props: {
        tabsTitle: [
          { 
            mesin: 'Test Unit 1',
            kode_sentral: 'TST01',
            uuid_mesin: 1,
            sentral: 'Test Sentral',
            pengelola: 'Test Pengelola',
            pembina: 'Test Pembina',
            jenis_pembangkit: 'PLTU',
            data_terpasang: '100',
            data_mampu: '90',
            asset_awal: '1000000',
            sisa_masa_manfaat: 15,
            masa_manfaat: 25,
            tahun_data: '2024',
            tahun_nilai_perolehan: '2020',
            tahun: 2024,
            photo: 'photo1.jpg',
            photo1: 'photo1.jpg',
            photo2: 'photo2.jpg',
            length: 1
          }
        ]
      },
      global: {
        plugins: [createPinia()],
        mocks: {
          $route: mockRoute,
          $router: mockRouter
        },
        stubs: {
          Loading: true,
          SearchBox: true,
          ModalSearch: true,
          TagSentral: true,
          TagMesin: true,
          GrafikSentral: true,
          GrafikMesin: true,
          InfoSentral: true,
          InfoMesin: true,
          Chips: true,
          VueDatePicker: true
        }
      }
    });
    
    expect(wrapperWithProps.exists()).toBe(true);
  });
});
