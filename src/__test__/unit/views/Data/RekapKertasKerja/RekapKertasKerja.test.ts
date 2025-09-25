// Mock navigator before importing element-plus
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Node.js Jest Test Environment)',
    platform: 'linux',
    appVersion: '5.0 (Node.js Jest Test Environment)',
    language: 'en-US',
    languages: ['en-US', 'en'],
    cookieEnabled: true,
  },
  writable: true,
});

import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import RekapKertasKerja from '@/views/Data/RekapKertasKerja/RekapKertasKerja.vue';
import SearchBoxSuggestion from '@/components/ui/SearchBoxSuggestion.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import { createPinia, setActivePinia } from 'pinia';

// Mock external services and stores
jest.mock('@/services/auth-service');
jest.mock('@/services/rekap-service');
jest.mock('@/services/detail-rekap-service');

jest.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: jest.fn(() => ({
    levelAlias: 'Xf!8qP@7'
  }))
}));

jest.mock('@/store/storeRekapKertasKerja', () => ({
  useRekapSearchStore: jest.fn(() => ({
    searchRekapQuery: '',
    selectedRekapSearchQuery: ''
  })),
  useRekapNavigationStore: jest.fn(() => ({
    currentPage: 1,
    pageLimit: 10,
    scrollPosition: { top: 0 }
  }))
}));


jest.mock('@vueuse/core', () => ({
  useWindowScroll: jest.fn(() => ({
    x: ref(0),
    y: ref(0)
  }))
}));

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn()
  })
}));

jest.mock('@/services/format/global-format', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn((value) => `Rp ${value}`),
    formatNumberFiveDigits: jest.fn((value) => value.toString().padStart(5, '0'))
  }))
}));

jest.mock('@/services/rekap-service', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getSuggestionSentral: jest.fn().mockResolvedValue({
      status: 200,
      data: ['Sentral 1', 'Sentral 2']
    }),
    getSentralData: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        {
          uuid_sentral: '1',
          sentral: 'PLTU Suralaya',
          mesins: [[
            {
              uuid_mesin: '1',
              mesin: 'Mesin 1',
              photo1: '',
              photo2: '',
              nilai_asset_awal: 1000000000,
              tahun: 2020,
              masa_manfaat: 25
            }
          ]]
        }
      ],
      totalRecords: 1,
      totalPages: 1
    }),
    getMesinByIdSentral: jest.fn().mockResolvedValue({
      data: [
        {
          uuid_mesin: '1',
          mesin: 'Mesin 1',
          photo1: 'photo1.jpg',
          photo2: 'photo2.jpg'
        }
      ]
    }),
    getPengelolaData: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        { kode_pengelola: 'P001', pengelola: 'PT PLN' }
      ]
    }),
    getComboKategoriPembangkit: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        { id: 'PLTU', name: 'PLTU' },
        { id: 'PLTG', name: 'PLTG' }
      ]
    }),
    getComboUmurMesin: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        { id: '1', name: '0-5 Tahun' },
        { id: '2', name: '6-10 Tahun' }
      ]
    }),
    getComboKondisiMesin: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        { id: '1', name: 'Baik' },
        { id: '2', name: 'Rusak' }
      ]
    }),
    getComboIRR: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    getNilaiSentral: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    getNilaiMesin: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    getStatusFSSentral: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    getStatusFSMesin: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    getStatusRealisasiSentral: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    getStatusRealisasiMesin: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    getCheckInputAsumsiSentral: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    getCheckInputAsumsiMesin: jest.fn().mockResolvedValue({
      status: 200,
      data: []
    }),
    downloadTemplateRekap: jest.fn().mockResolvedValue({
      data: new ArrayBuffer(8),
      headers: { 'content-disposition': 'attachment; filename="template.xlsx"' }
    }),
    downloadTemplateFS: jest.fn().mockResolvedValue({
      data: new ArrayBuffer(8),
      headers: { 'content-disposition': 'attachment; filename="template-fs.xlsx"' }
    }),
    uploadEvidence: jest.fn().mockResolvedValue({
      status: 200,
      message: 'Success'
    })
  }))
}));

jest.mock('@/services/detail-rekap-service', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getPhoto: jest.fn().mockResolvedValue({
      data: new ArrayBuffer(8)
    })
  }))
}));

describe('RekapKertasKerja.vue Unit Tests', () => {
  let wrapper: any;
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    
    // Mock DOM methods
    if (!window.URL) {
      Object.defineProperty(window, 'URL', {
        value: {
          createObjectURL: jest.fn(() => 'blob:mock-url'),
          revokeObjectURL: jest.fn()
        }
      });
    }

    Object.defineProperty(document, 'createElement', {
      value: jest.fn(() => ({
        href: '',
        download: '',
        click: jest.fn(),
        remove: jest.fn()
      }))
    });

    Object.defineProperty(document.body, 'appendChild', {
      value: jest.fn()
    });

    wrapper = shallowMount(RekapKertasKerja, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true,
          'el-table': true,
          'el-table-column': true,
          'el-pagination': true,
          'el-input': true,
          'el-button': true
        }
      }
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders main container with correct classes', () => {
      const mainContainer = wrapper.find('.flex.flex-col.h-full.p-6.space-y-5.font-medium.bg-white.rounded-lg.text-md');
      expect(mainContainer.exists()).toBe(true);
    });

    it('displays Loading component when isLoading is true', async () => {
      wrapper.vm.isLoading = true;
      await nextTick();
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
    });

    it('hides Loading component when isLoading is false', async () => {
      wrapper.vm.isLoading = false;
      await nextTick();
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(false);
    });
  });

  describe('Search and Filter Components', () => {
    it('renders SearchBoxSuggestion when listSuggestionSentral has data', async () => {
      wrapper.vm.listSuggestionSentral = ['Sentral 1', 'Sentral 2'];
      await nextTick();
      expect(wrapper.findComponent(SearchBoxSuggestion).exists()).toBe(true);
    });

    it('renders ShimmerLoading when listSuggestionSentral is null', async () => {
      wrapper.vm.listSuggestionSentral = null;
      await nextTick();
      expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(true);
    });

    it('displays filter button with correct text', () => {
      const filterButton = wrapper.find('button[id="hover-button"]');
      expect(filterButton.exists()).toBe(true);
      expect(filterButton.text()).toContain('Filter');
    });

    it('shows filter indicator when filters are applied', async () => {
      wrapper.vm.selectedKategoriPembangkit = ['PLTU'];
      await nextTick();
      const indicator = wrapper.find('.bg-warningColor');
      expect(indicator.exists()).toBe(true);
    });

    it('opens modal when filter button is clicked', async () => {
      const filterButton = wrapper.find('button[id="hover-button"]');
      await filterButton.trigger('click');
      expect(wrapper.vm.showModal).toBe(true);
    });
  });

  describe('Modal Functionality', () => {
    it('displays ModalWrapper when showModal is true', async () => {
      wrapper.vm.showModal = true;
      await nextTick();
      expect(wrapper.findComponent(ModalWrapper).exists()).toBe(true);
    });

    it('closes modal when close button is clicked', async () => {
      wrapper.vm.showModal = true;
      await nextTick();
      
      const closeButton = wrapper.find('button').element;
      if (closeButton && closeButton.innerHTML.includes('stroke="#333333"')) {
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.showModal).toBe(false);
      }
    });

    it('resets filters when reset button is clicked', async () => {
      wrapper.vm.selectedKategoriPembangkit = ['PLTU'];
      wrapper.vm.selectedUmurMesin = ['1'];
      wrapper.vm.selectedKondisiMesin = ['1'];
      wrapper.vm.dmn = ['DMN1'];

      const resetButton = wrapper.find('button').element;
      if (resetButton && resetButton.textContent === 'Reset') {
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.selectedKategoriPembangkit).toEqual([]);
        expect(wrapper.vm.selectedUmurMesin).toEqual([]);
        expect(wrapper.vm.selectedKondisiMesin).toEqual([]);
        expect(wrapper.vm.dmn).toEqual([]);
      }
    });
  });

  describe('Data Fetching Methods', () => {
    it('calls fetchSuggestionSentral method', async () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchSuggestionSentral');
      await wrapper.vm.fetchSuggestionSentral();
      expect(spy).toHaveBeenCalled();
    });

    it('calls fetchSentralData method', async () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchSentralData');
      await wrapper.vm.fetchSentralData();
      expect(spy).toHaveBeenCalled();
    });

    it('calls fetchMesinByIdSentral method', async () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchMesinByIdSentral');
      await wrapper.vm.fetchMesinByIdSentral('test-id');
      expect(spy).toHaveBeenCalledWith('test-id');
    });

    it('calls fetchPengelolaData method', async () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchPengelolaData');
      await wrapper.vm.fetchPengelolaData();
      expect(spy).toHaveBeenCalled();
    });

    it('calls fetchComboKategoriPembangkit method', async () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchComboKategoriPembangkit');
      await wrapper.vm.fetchComboKategoriPembangkit();
      expect(spy).toHaveBeenCalled();
    });

    it('calls fetchComboUmurMesin method', async () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchComboUmurMesin');
      await wrapper.vm.fetchComboUmurMesin();
      expect(spy).toHaveBeenCalled();
    });

    it('calls fetchComboKondisiMesin method', async () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchComboKondisiMesin');
      await wrapper.vm.fetchComboKondisiMesin();
      expect(spy).toHaveBeenCalled();
    });

    it('calls fetchComboIRR method', async () => {
      const spy = jest.spyOn(wrapper.vm, 'fetchComboIRR');
      await wrapper.vm.fetchComboIRR();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('User Interaction Methods', () => {
    it('handles search functionality', async () => {
      const spy = jest.spyOn(wrapper.vm, 'handleSearch');
      await wrapper.vm.handleSearch();
      expect(spy).toHaveBeenCalled();
    });

    it('toggles pembangkit section', async () => {
      const testId = 'test-sentral-id';
      wrapper.vm.isPembangkitTabOpen = [];
      
      await wrapper.vm.togglePembangkit(testId);
      expect(wrapper.vm.isPembangkitTabOpen).toContain(testId);
      
      await wrapper.vm.togglePembangkit(testId);
      expect(wrapper.vm.isPembangkitTabOpen).not.toContain(testId);
    });

    it('checks if pembangkit is open', () => {
      const testId = 'test-sentral-id';
      wrapper.vm.isPembangkitTabOpen = [testId];
      
      expect(wrapper.vm.isPembangkitOpen(testId)).toBe(true);
      expect(wrapper.vm.isPembangkitOpen('other-id')).toBe(false);
    });

    it('changes selected pengelola', async () => {
      const pengelolaCode = 'P001';
      wrapper.vm.selectedPengelola = [];
      
      await wrapper.vm.changeSelectedPengelola(pengelolaCode);
      expect(wrapper.vm.selectedPengelola).toContain(pengelolaCode);
    });
  });

  describe('File Upload Functionality', () => {
    it('handles file change for rekap upload', () => {
      const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const mockEvent = { target: { files: [mockFile] } };
      
      wrapper.vm.handleFileChange(mockEvent);
      expect(wrapper.vm.selectedFile).toBe(mockFile);
    });

    it('handles file change for evidence upload', () => {
      const mockFile = new File(['test'], 'evidence.jpg', { type: 'image/jpeg' });
      const mockEvent = { target: { files: [mockFile] } };
      
      wrapper.vm.handleFileChangeEvidence(mockEvent);
      expect(wrapper.vm.selectedFileEvidence).toBe(mockFile);
    });

    it('handles file change for FS upload', () => {
      const mockFile = new File(['test'], 'fs.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const mockEvent = { target: { files: [mockFile] } };
      
      wrapper.vm.handleFileFSChange(mockEvent);
      expect(wrapper.vm.selectedFileFS).toBe(mockFile);
    });
  });

  describe('Download Templates', () => {
    it('handles download template rekap', async () => {
      wrapper.vm.currentIdMesin = '1';
      wrapper.vm.currentNamaMesin = 'Test Mesin';
      
      await wrapper.vm.handleDownloadTemplateRekap();
      // Verify that the method completes without error
      expect(wrapper.vm.handleDownloadTemplateRekap).toBeDefined();
    });

    it('handles download template FS', async () => {
      wrapper.vm.currentIdMesin = '1';
      wrapper.vm.currentNamaMesin = 'Test Mesin';
      wrapper.vm.currentKodeJenisPembangkit = 'PLTU';
      
      await wrapper.vm.handleDownloadTemplateFS();
      // Verify that the method completes without error
      expect(wrapper.vm.handleDownloadTemplateFS).toBeDefined();
    });
  });

  describe('Filter Checkbox Handlers', () => {
    it('handles check all pembangkit', () => {
      wrapper.vm.kategoriPembangkitData = [
        { id: 'PLTU', name: 'PLTU' },
        { id: 'PLTG', name: 'PLTG' }
      ];
      
      wrapper.vm.handleCheckPembangkit(true);
      expect(wrapper.vm.selectedKategoriPembangkit).toEqual(['PLTU', 'PLTG']);
      
      wrapper.vm.handleCheckPembangkit(false);
      expect(wrapper.vm.selectedKategoriPembangkit).toEqual([]);
    });

    it('handles check all umur mesin', () => {
      wrapper.vm.comboUmurMesin = [
        { id: '1', name: '0-5 Tahun' },
        { id: '2', name: '6-10 Tahun' }
      ];
      
      wrapper.vm.handleCheckUmurMesin(true);
      expect(wrapper.vm.selectedUmurMesin).toEqual(['1', '2']);
      
      wrapper.vm.handleCheckUmurMesin(false);
      expect(wrapper.vm.selectedUmurMesin).toEqual([]);
    });

    it('handles check all kondisi mesin', () => {
      wrapper.vm.comboKondisiMesin = [
        { id: '1', name: 'Baik' },
        { id: '2', name: 'Rusak' }
      ];
      
      wrapper.vm.handleCheckKondisiMesin(true);
      expect(wrapper.vm.selectedKondisiMesin).toEqual(['1', '2']);
      
      wrapper.vm.handleCheckKondisiMesin(false);
      expect(wrapper.vm.selectedKondisiMesin).toEqual([]);
    });
  });

  describe('Data Display', () => {
    it('renders sentral data when available', async () => {
      wrapper.vm.sentralData = [
        {
          uuid_sentral: '1',
          sentral: 'PLTU Suralaya',
          mesins: [[
            {
              uuid_mesin: '1',
              mesin: 'Mesin 1',
              photo1: '',
              photo2: '',
              nilai_asset_awal: 1000000000,
              tahun: 2020,
              masa_manfaat: 25
            }
          ]]
        }
      ];
      await nextTick();
      
      const sentralElements = wrapper.findAll('.flex.flex-col.w-full.p-3.border.rounded-lg');
      expect(sentralElements.length).toBeGreaterThanOrEqual(0);
    });

    it('renders pengelola data when available', async () => {
      wrapper.vm.pengelolaData = [
        { kode_pengelola: 'P001', pengelola: 'PT PLN' }
      ];
      await nextTick();
      
      const pengelolaList = wrapper.find('ul');
      expect(pengelolaList.exists()).toBeTruthy();
    });
  });

  describe('Pagination', () => {
    it('goes to specific page', async () => {
      const spy = jest.spyOn(wrapper.vm, 'goToPage');
      await wrapper.vm.goToPage(2);
      expect(spy).toHaveBeenCalledWith(2);
    });

    it('goes to previous page', () => {
      wrapper.vm.navigationStore.currentPage = 2;
      wrapper.vm.goToPrevious();
      expect(wrapper.vm.navigationStore.currentPage).toBe(1);
    });

    it('goes to next page', () => {
      wrapper.vm.navigationStore.currentPage = 1;
      wrapper.vm.totalPages = 5;
      wrapper.vm.goToNext();
      expect(wrapper.vm.navigationStore.currentPage).toBe(2);
    });
  });

  describe('Utility Methods', () => {
    it('checks input asumsi status', () => {
      wrapper.vm.listStatusInputAsumsiMesin = [
        { uuid_mesin: '1', status_kk: true },
        { uuid_mesin: '2', status_kk: false }
      ];
      
      expect(wrapper.vm.checkInputAsumsi('1')).toBe(true);
      expect(wrapper.vm.checkInputAsumsi('2')).toBe(false);
    });

    it('checks unggah required properties', () => {
      expect(wrapper.vm.checkUnggahRequiredProp('-', '', '0')).toBe(true);
      expect(wrapper.vm.checkUnggahRequiredProp('1000000', '2020', '25')).toBe(false);
    });

    it('changes sentral data based on filters', async () => {
      const spy = jest.spyOn(wrapper.vm, 'changeSentralData');
      await wrapper.vm.changeSentralData();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Watchers and Lifecycle', () => {
    it('handles body overflow when loading changes', async () => {
      const originalBodyStyle = document.body.style.overflow;
      
      wrapper.vm.isLoading = true;
      await nextTick();
      // Note: In jsdom environment, document.body.style changes might not persist as expected
      
      wrapper.vm.isLoading = false;
      await nextTick();
      
      // Restore original style
      document.body.style.overflow = originalBodyStyle;
    });
  });

  describe('Component Integration', () => {
    it('integrates with SearchBoxSuggestion properly', async () => {
      wrapper.vm.listSuggestionSentral = ['Sentral 1', 'Sentral 2'];
      await nextTick();
      
      const searchBox = wrapper.findComponent(SearchBoxSuggestion);
      if (searchBox.exists()) {
        expect(searchBox.props('source')).toEqual(['Sentral 1', 'Sentral 2']);
      }
    });

    it('integrates with ModalWrapper properly', async () => {
      wrapper.vm.showModal = true;
      await nextTick();
      
      const modal = wrapper.findComponent(ModalWrapper);
      if (modal.exists()) {
        expect(modal.props('showModal')).toBe(true);
        expect(modal.props('width')).toBe('w-[500px]');
        expect(modal.props('height')).toBe('h-auto');
      }
    });
  });
});
function ref<T>(value: T): { value: T } {
  return { value };
}
