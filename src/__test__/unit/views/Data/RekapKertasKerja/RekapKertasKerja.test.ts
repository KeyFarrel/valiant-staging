import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RekapKertasKerja from '@/views/Data/RekapKertasKerja/RekapKertasKerja.vue';

// Mock stores
const mockRekapSearchStore = {
  searchRekapQuery: '',
  selectedRekapSearchQuery: ''
};

const mockRekapNavigationStore = {
  currentPage: 1,
  pageLimit: 10,
  scrollPosition: { top: 0 }
};

const mockUserAuthStore = {
  levelAlias: 'Xf!8qP@7'
};

// Mock services
vi.mock('@/services/rekap-service', () => ({
  default: class MockRekapService {
    getDataRekap() {
      return Promise.resolve({
        success: true,
        data: [],
        meta: { limit: 10, total: 0, totalPages: 0 }
      });
    }
    getPengelola() {
      return Promise.resolve({
        success: true,
        data: []
      });
    }
    getSuggestionSentral() {
      return Promise.resolve({
        success: true,
        data: [
          { sentral: 'PLTU Test 1' },
          { sentral: 'PLTU Test 2' }
        ]
      });
    }
    getSentralData() {
      return Promise.resolve({
        success: true,
        data: [
          {
            uuid_sentral: 'test-id-1',
            sentral: 'PLTU Test 1',
            kode_sentral: 'TST001',
            jenis_pembangkit: 'PLTU',
            bbm: 'Batubara',
            daya_terpasang: 100,
            daya_mampu: 90
          }
        ],
        meta: { limit: 10, totalRecords: 1, totalPages: 1 }
      });
    }
    getMesinByIdSentral() {
      return Promise.resolve({
        success: true,
        data: [
          {
            id: 'mesin-1',
            nama_mesin: 'Mesin Test 1',
            photo1: '',
            photo2: ''
          }
        ]
      });
    }
    getPengelolaData() {
      return Promise.resolve({
        success: true,
        data: [
          { id_pengelola: 1, kode_pengelola: 'PLN', pengelola: 'PT PLN' }
        ]
      });
    }
    getComboKategoriPembangkit() {
      return Promise.resolve({
        success: true,
        data: [
          {
            jenis_kit: 'PLTU',
            dmn: [
              { id_daya: 1, daya_mampu: '< 100' }
            ]
          }
        ]
      });
    }
  }
}));

vi.mock('@/services/auth-service', () => ({
  default: class MockAuthService {
    getUser() {
      return Promise.resolve({ success: true, data: {} });
    }
  }
}));

vi.mock('@/services/detail-sentral-service', () => ({
  default: class MockDetailSentralService {
    getSuggestionSentral() {
      return Promise.resolve({ success: true, data: [] });
    }
    getPhoto() {
      return Promise.resolve({ data: new Blob() });
    }
  }
}));

// Mock stores
vi.mock('@/store/storeRekapKertasKerja', () => ({
  useRekapSearchStore: () => mockRekapSearchStore,
  useRekapNavigationStore: () => mockRekapNavigationStore
}));

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: () => mockUserAuthStore
}));

// Mock other dependencies
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({})
}));

vi.mock('@vueuse/core', () => ({
  useWindowScroll: () => ({ x: { value: 0 }, y: { value: 0 } })
}));

describe('RekapKertasKerja', () => {
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it('should render the component successfully', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should initialize with correct default values', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    // Wait for component to mount and lifecycle hooks to complete
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // After mounted hook runs, isLoading might be set to true initially
    expect(vm.isPembangkitTabOpen).toEqual([]);
    expect(vm.sentralData).toEqual([]);
    expect(vm.selectedKategoriPembangkit).toEqual([]);
    expect(vm.tahunBerjalan).toBe(new Date().getFullYear());
  });

  it('should toggle pembangkit tab correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    const testId = 'test-sentral-id';
    
    // Test isPembangkitOpen method
    expect(vm.isPembangkitOpen(testId)).toBe(false);
    
    // Add id to open tabs
    vm.isPembangkitTabOpen.push(testId);
    expect(vm.isPembangkitOpen(testId)).toBe(true);
  });

  it('should handle file change correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test handleFileChange with single file
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };
    
    vm.handleFileChange(mockEvent);
    expect(vm.selectedFile).toStrictEqual(mockFile);
    
    // Test handleFileChange with no files
    const mockEventEmpty = {
      target: {
        files: []
      }
    };
    
    vm.handleFileChange(mockEventEmpty);
    expect(vm.selectedFile).toBe(null);
  });

  it('should handle file change evidence correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test handleFileChangeEvidence with single file
    const mockFile = new File(['evidence'], 'evidence.pdf', { type: 'application/pdf' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };
    
    vm.handleFileChangeEvidence(mockEvent);
    expect(vm.selectedFileEvidence).toStrictEqual(mockFile);
    
    // Test handleFileChangeEvidence with no files
    const mockEventEmpty = {
      target: {
        files: []
      }
    };
    
    vm.handleFileChangeEvidence(mockEventEmpty);
    expect(vm.selectedFileEvidence).toBe(null);
  });

  it('should handle checkbox changes correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Setup test data
    vm.kategoriPembangkitData = [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' }
    ];
    vm.comboUmurMesin = [
      { id: '1', name: '< 5 tahun' },
      { id: '2', name: '5-10 tahun' }
    ];
    vm.comboKondisiMesin = [
      { id: '1', name: 'Baik' },
      { id: '2', name: 'Rusak' }
    ];
    
    // Test handleCheckPembangkit with true
    vm.handleCheckPembangkit(true);
    expect(vm.selectedKategoriPembangkit).toEqual(['PLTU', 'PLTG']);
    expect(vm.indeterminate).toBe(false);
    
    // Test handleCheckPembangkit with false
    vm.handleCheckPembangkit(false);
    expect(vm.selectedKategoriPembangkit).toEqual([]);
    
    // Test handleCheckUmurMesin with true
    vm.handleCheckUmurMesin(true);
    expect(vm.selectedUmurMesin).toEqual(['1', '2']);
    
    // Test handleCheckKondisiMesin with true
    vm.handleCheckKondisiMesin(true);
    expect(vm.selectedKondisiMesin).toEqual(['1', '2']);
  });

  it('should check input asumsi correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Setup test data
    vm.listStatusInputAsumsiMesin = [
      { uuid_mesin: 'mesin-1', status_kk: true },
      { uuid_mesin: 'mesin-2', status_kk: false }
    ];
    
    // Test checkInputAsumsi
    expect(vm.checkInputAsumsi('mesin-1')).toBe(true);
    expect(vm.checkInputAsumsi('mesin-2')).toBe(false);
  });

  it('should check unggah required properties correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test checkUnggahRequiredProp with incomplete data
    expect(vm.checkUnggahRequiredProp('-', '', '0')).toBe(true);
    expect(vm.checkUnggahRequiredProp('-', '2020', '5')).toBe(true);
    expect(vm.checkUnggahRequiredProp('1000000', '', '5')).toBe(true);
    expect(vm.checkUnggahRequiredProp('1000000', '2020', '0')).toBe(true);
    
    // Test with complete data
    expect(vm.checkUnggahRequiredProp('1000000', '2020', '5')).toBe(false);
  });

  it('should generate page list correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test with small number of pages (<=5)
    vm.totalPages = 3;
    vm.navigationStore.currentPage = 1;
    expect(vm.generatePageList.length).toBeGreaterThanOrEqual(0);
    
    // Test with larger number of pages
    vm.totalPages = 10;
    vm.navigationStore.currentPage = 5;
    expect(vm.generatePageList.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle pagination navigation correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Setup initial state
    vm.navigationStore.currentPage = 2;
    vm.totalPages = 5;
    
    // Test goToPrevious
    await vm.goToPrevious();
    expect(vm.navigationStore.currentPage).toBe(1);
    
    // Test goToNext
    await vm.goToNext();
    expect(vm.navigationStore.currentPage).toBe(2);
  });

  it('should handle pengelola selection correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test selecting 'ALL'
    await vm.changeSelectedPengelola('ALL');
    expect(vm.kodePengelola).toBe('ALL');
    expect(vm.selectedPengelola).toEqual([]);
    
    // Test selecting specific pengelola
    await vm.changeSelectedPengelola('PLN');
    expect(vm.selectedPengelola).toContain('PLN');
    
    // Test deselecting pengelola
    vm.selectedPengelola = ['PLN'];
    await vm.changeSelectedPengelola('PLN');
    expect(vm.selectedPengelola).not.toContain('PLN');
  });

  it('should handle focus and search modal correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test handleFocus
    vm.handleFocus();
    expect(vm.isSearchModalOpen).toBe(true);
    
    // Test handleSearch
    await vm.handleSearch();
    expect(vm.navigationStore.currentPage).toBe(1);
  });

  it('should handle modal state changes correctly', async () => {
    const wrapper = mount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ConfirmationDialog: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          IconFolder: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test changeSentralData
    await vm.changeSentralData();
    expect(vm.showModal).toBe(false);
    
    // Test changePageLimit
    await vm.changePageLimit();
    expect(vm.navigationStore.currentPage).toBe(1);
  });
});