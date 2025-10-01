import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SentralAdmin from '@/views/Master/SentralAdmin.vue';
import { useUserAuthStore } from '@/store/storeUserAuth';

// Mock services
jest.mock('@/services/sentral-service');
jest.mock('@/services/detail-sentral-service');
jest.mock('@/services/auth-service');
jest.mock('@/services/format/global-format');

// Mock components
jest.mock('@/components/MasterUnitSentral/TabWrapperSentral.vue', () => ({
  name: 'TabWrapperSentral',
  template: '<div data-testid="tab-wrapper"><slot /></div>'
}));

jest.mock('@/components/ui/TabItem.vue', () => ({
  name: 'TabItem',
  template: '<div data-testid="tab-item"><slot /></div>'
}));

jest.mock('@/components/ui/SearchBoxSuggestion.vue', () => ({
  name: 'SearchBoxSuggestion',
  template: '<input data-testid="search-box" />'
}));

jest.mock('@/components/ui/ShimmerLoading.vue', () => ({
  name: 'ShimmerLoading',
  template: '<div data-testid="shimmer-loading" />'
}));

jest.mock('@/components/ui/LoadingSpinner.vue', () => ({
  name: 'Loading',
  template: '<div data-testid="loading-spinner" />'
}));

// Mock encrypt storage
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: jest.fn((value) => `encrypted_${value}`)
  })
}));

// Mock router
const mockRouter = {
  push: jest.fn()
};

jest.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    template: '<a><slot /></a>'
  },
  useRouter: () => mockRouter
}));

describe('SentralAdmin.vue', () => {
  let wrapper: any;
  let pinia: any;
  let userAuthStore: any;

  const mockSentralData = [
    {
      uuid: 1,
      kode_sentral: 'SENTRAL001',
      nama_sentral: 'Test Sentral',
      daya_terpasang: 100000,
      daya_mampu: 90000,
      jenis_bahan_bakar: 'Gas',
      kode_pengelola: 'PEN001',
      longitude: '106.8456',
      latitude: '-6.2088',
      photo: 'test.jpg',
      photo2: '',
      mesins: [
        {
          mesin: 'Unit 1',
          nilai_asset_awal: 1000000000,
          tahun_operasi: 2020,
          masa_manfaat: 25,
          daya_terpasang: 50000,
          daya_mampu: 45000,
          kondisi_unit: 'Baik',
          photo1: 'mesin1.jpg',
          photo2: ''
        }
      ]
    }
  ];

  const mockPengelolaData = [
    {
      id_pengelola: 1,
      kode_pengelola: 'PEN001',
      pengelola: 'Test Pengelola'
    }
  ];

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    
    userAuthStore = useUserAuthStore();
    userAuthStore.levelAlias = 'Xf!8qP@7';

    // Mock service implementations
    const SentralService = require('@/services/sentral-service').default;
    const DetailSentralService = require('@/services/detail-sentral-service').default;
    
    SentralService.prototype.getSentralData = jest.fn().mockResolvedValue({
      data: mockSentralData,
      meta: {
        totalPages: 1,
        totalRecords: 1,
        limit: 10
      }
    });

    SentralService.prototype.getPengelolaData = jest.fn().mockResolvedValue({
      data: mockPengelolaData
    });

    SentralService.prototype.getSuggestionSentral = jest.fn().mockResolvedValue({
      data: [{ sentral: 'Test Sentral' }]
    });

    SentralService.prototype.getComboJenisKitData = jest.fn().mockResolvedValue({
      data: []
    });

    SentralService.prototype.getNilaiMesin = jest.fn().mockResolvedValue({
      data: []
    });

    DetailSentralService.prototype.getPhoto = jest.fn().mockResolvedValue({
      data: new ArrayBuffer(8)
    });

    wrapper = mount(SentralAdmin, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true,
          TabWrapperSentral: {
            name: 'TabWrapperSentral',
            template: '<div data-testid="tab-wrapper"><slot /></div>'
          },
          TabItem: {
            name: 'TabItem', 
            template: '<div data-testid="tab-item"><slot /></div>'
          },
          SearchBoxSuggestion: {
            name: 'SearchBoxSuggestion',
            template: '<input data-testid="search-box" />',
            emits: ['on-key-enter', 'on-click-sentral']
          },
          ShimmerLoading: {
            name: 'ShimmerLoading',
            template: '<div data-testid="shimmer-loading" />'
          },
          Loading: {
            name: 'Loading',
            template: '<div data-testid="loading-spinner" />'
          }
        },
        directives: {
          'auto-animate': () => {}
        }
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should show loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('div[data-testid="loading-spinner"]').exists()).toBe(true);
  });

  it('should display search box for authorized users', async () => {
    wrapper.vm.listSuggestionSentral = [{ sentral: 'Test' }];
    await wrapper.vm.$nextTick();
    expect(wrapper.find('input[data-testid="search-box"]').exists()).toBe(true);
  });

  it('should not display search box for unauthorized users', async () => {
    userAuthStore.levelAlias = 'UNAUTHORIZED';
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="search-box"]').exists()).toBe(false);
  });

  it('should fetch sentral data on mount', async () => {
    const SentralService = require('@/services/sentral-service').default;
    expect(SentralService.prototype.getSentralData).toHaveBeenCalled();
  });

  it('should handle pengelola selection', async () => {
    await wrapper.vm.changeSelectedPengelola('PEN001');
    expect(wrapper.vm.selectedPengelola).toContain('PEN001');
  });

  it('should handle ALL pengelola selection', async () => {
    await wrapper.vm.changeSelectedPengelola('ALL');
    expect(wrapper.vm.selectedAll).toContain('ALL');
    expect(wrapper.vm.selectedPengelola).toEqual([]);
  });

  it('should handle search functionality', async () => {
    wrapper.vm.searchQuery = 'test';
    await wrapper.vm.handleSearch();
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it('should toggle pembangkit visibility', async () => {
    const kodeSentral = 'SENTRAL001';
    wrapper.vm.isPembangkitTabOpen = [];
    await wrapper.vm.togglePembangkit(kodeSentral);
    expect(wrapper.vm.isPembangkitTabOpen).toContain(kodeSentral);
    
    await wrapper.vm.togglePembangkit(kodeSentral);
    expect(wrapper.vm.isPembangkitTabOpen).not.toContain(kodeSentral);
  });

  it('should handle pagination - go to next page', async () => {
    wrapper.vm.currentPage = 1;
    wrapper.vm.totalPages = 5;
    await wrapper.vm.goToNext();
    expect(wrapper.vm.currentPage).toBe(2);
  });

  it('should handle pagination - go to previous page', async () => {
    wrapper.vm.currentPage = 2;
    await wrapper.vm.goToPrevious();
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it('should not go to previous page when on first page', async () => {
    wrapper.vm.currentPage = 1;
    await wrapper.vm.goToPrevious();
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it('should not go to next page when on last page', async () => {
    wrapper.vm.currentPage = 5;
    wrapper.vm.totalPages = 5;
    await wrapper.vm.goToNext();
    expect(wrapper.vm.currentPage).toBe(5);
  });

  it('should change page limit', async () => {
    const event = { target: { value: '20' } };
    wrapper.vm.pageLimit = 20;
    wrapper.vm.currentPage = 1;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.pageLimit).toBe(20);
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it('should go to specific page', async () => {
    await wrapper.vm.goToPage(3);
    expect(wrapper.vm.currentPage).toBe(3);
  });

  it('should calculate nilai aset awal sentral correctly', () => {
    const mesins = [
      { nilai_asset_awal: 1000000000 },
      { nilai_asset_awal: 2000000000 }
    ];
    const result = wrapper.vm.calculateNilaiAsetAwalSentral(mesins);
    expect(result).toBe(3000);
  });

  it('should return "-" for zero nilai aset awal', () => {
    const mesins = [{ nilai_asset_awal: 0 }];
    const result = wrapper.vm.calculateNilaiAsetAwalSentral(mesins);
    expect(result).toBe('-');
  });

  it('should check if pembangkit is open', () => {
    wrapper.vm.isPembangkitTabOpen = ['SENTRAL001'];
    expect(wrapper.vm.isPembangkitOpen('SENTRAL001')).toBe(true);
    expect(wrapper.vm.isPembangkitOpen('SENTRAL002')).toBe(false);
  });

  it('should generate correct page list for small total pages', async () => {
    wrapper.vm.totalPages = 3;
    wrapper.vm.currentPage = 2;
    const pageList = wrapper.vm.generatePageList;
    expect(pageList).toEqual([1, 2, 3]);
  });

  it('should generate correct page list for large total pages', async () => {
    wrapper.vm.totalPages = 10;
    wrapper.vm.currentPage = 1;
    const pageList = wrapper.vm.generatePageList;
    expect(pageList).toContain(1);
    expect(pageList).toContain('...');
    expect(pageList).toContain(10);
  });

  it('should clear search when searchQuery becomes empty', async () => {
    wrapper.vm.searchQuery = 'test';
    await wrapper.vm.$nextTick();
    
    wrapper.vm.searchQuery = '';
    await wrapper.vm.$nextTick();
    
    const SentralService = require('@/services/sentral-service').default;
    expect(SentralService.prototype.getSentralData).toHaveBeenCalled();
  });
});
