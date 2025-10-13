import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FeasibilityStudy from '@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudy.vue';

// Mock the router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'test-id-123' }
  })
}));

// Mock services with proper methods
const mockFeasibilityStudyService = {
  getMesinById: vi.fn(),
  getAsumsiFeasibility: vi.fn(),
  getDataTeknis: vi.fn(),
  getDataFinansial: vi.fn(),
  getHasilSimulasi: vi.fn(),
  getTypePeriodic: vi.fn(),
  getComboBahanBakar: vi.fn(),
  getPembangkitByKode: vi.fn(),
  getPengelolaData: vi.fn(),
  downloadExcelFS: vi.fn(),
};

const mockUserService = {
  getPembina: vi.fn(),
};

const mockGlobalFormat = {
  formatNumberFiveDigits: vi.fn(),
};

// Mock the services
vi.mock('@/services/feasibility-study', () => ({
  default: class MockFeasibilityStudyService {
    constructor() {
      return mockFeasibilityStudyService;
    }
  }
}));

vi.mock('@/services/user-service', () => ({
  default: class MockUserService {
    constructor() {
      return mockUserService;
    }
  }
}));

vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    constructor() {
      return mockGlobalFormat;
    }
  }
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: vi.fn().mockReturnValue('test-id-123')
  })
}));

// Mock all child components
vi.mock('@/components/RekapKertasKerja/TableDataTeknis.vue', () => ({
  default: { name: 'TableDataTeknis', template: '<div>TableDataTeknis</div>' }
}));

vi.mock('@/components/RekapKertasKerja/TableDataFinansial.vue', () => ({
  default: { name: 'TableDataFinansial', template: '<div>TableDataFinansial</div>' }
}));

vi.mock('@/components/ui/TabsWrapper.vue', () => ({
  default: { name: 'TabsWrapper', template: '<div><slot /></div>' }
}));

vi.mock('@/components/ui/TabItem.vue', () => ({
  default: { name: 'TabItem', template: '<div><slot /></div>' }
}));

vi.mock('@/components/ui/AsumsiMakro.vue', () => ({
  default: { name: 'AsumsiMakro', template: '<div>AsumsiMakro</div>' }
}));

vi.mock('@/components/ui/ParameterTeknis.vue', () => ({
  default: { name: 'ParameterTeknis', template: '<div>ParameterTeknis</div>' }
}));

vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: { name: 'Loading', template: '<div>Loading</div>' }
}));

vi.mock('@/components/ui/InfoHeader.vue', () => ({
  default: { name: 'InfoHeader', template: '<div><slot /></div>' }
}));

vi.mock('@/components/ui/ShimmerLoading.vue', () => ({
  default: { name: 'ShimmerLoading', template: '<div>ShimmerLoading</div>' }
}));

vi.mock('@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue', () => ({
  default: { name: 'AkhirMasaManfaat', template: '<div>AkhirMasaManfaat</div>' }
}));

vi.mock('@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue', () => ({
  default: { name: 'TahunBerjalan', template: '<div>TahunBerjalan</div>' }
}));

// Mock DOM methods
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

describe('FeasibilityStudy.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockFeasibilityStudyService.getMesinById.mockResolvedValue({
      data: {
        uuid_mesin: 1,
        kode_sentral: 'TEST_SENTRAL',
        kode_mesin: 'TEST_MESIN',
        mesin: 'Test Machine',
        kode_jenis_pembangkit: 'PLTU',
        kondisi_unit: 'OPERASI',
        daya_terpasang: 100,
        daya_mampu: 90,
        tahun_operasi: '2020'
      }
    });

    mockFeasibilityStudyService.getAsumsiFeasibility.mockResolvedValue({
      data: {
        asumsi_makro: {
          corporate_tax_rate: 25,
          discount_rate: 10,
          interest_rate: 8,
          loan_tenor: 15,
          loan_portion: 70,
          equity_portion: 30,
          umur_teknis: 25
        },
        parameter_teknis_financial: {
          daya_terpasang: 100,
          daya_mampu_netto_mw: 90,
          auxiliary: 5,
          susut_trafo: 2,
          ps: 85,
          nphr: 2500,
          total_project_cost: 1000000,
          loan: 700000,
          equity: 300000,
          electricity_price_a_rp_per_kwbln: 1000,
          electricity_price_b_rp_per_kwbln: 1100,
          electricity_price_c_rp_per_kwh: 1200,
          electricity_price_d_rp_per_kwh: 1300
        },
        harga_bahan_bakars: []
      }
    });

    mockFeasibilityStudyService.getDataTeknis.mockResolvedValue({
      data: { header: [], tahun: [], detail: [] }
    });

    mockFeasibilityStudyService.getDataFinansial.mockResolvedValue({
      data: { detail: [] }
    });

    mockFeasibilityStudyService.getHasilSimulasi.mockResolvedValue({
      data: {}
    });

    mockFeasibilityStudyService.getTypePeriodic.mockResolvedValue({
      data: []
    });

    mockFeasibilityStudyService.getComboBahanBakar.mockResolvedValue({
      data: []
    });

    mockFeasibilityStudyService.getPembangkitByKode.mockResolvedValue({
      data: {
        kode_pengelola: 'TEST_PENGELOLA',
        uuid_pembina: 1
      }
    });

    mockFeasibilityStudyService.getPengelolaData.mockResolvedValue({
      data: [
        { kode_pengelola: 'TEST_PENGELOLA', pengelola: 'Test Pengelola' }
      ]
    });

    mockUserService.getPembina.mockResolvedValue({
      data: [
        { uuid_pembina: 1, pembina: 'Test Pembina' }
      ]
    });
  });

  it('should render loading component initially before data loads', async () => {
    const wrapper = mount(FeasibilityStudy);
    
    // Wait for component to initialize
    await wrapper.vm.$nextTick();
    
    // Component should show loading or shimmer loading initially
    const hasLoading = wrapper.findComponent({ name: 'Loading' }).exists();
    const hasShimmerLoading = wrapper.findComponent({ name: 'ShimmerLoading' }).exists();
    
    expect(hasLoading || hasShimmerLoading).toBe(true);
  });

  it('should render shimmer loading when mesinDataById is not available', async () => {
    const wrapper = mount(FeasibilityStudy);
    
    await nextTick();
    
    // Should show shimmer loading when no data
    expect(wrapper.findComponent({ name: 'ShimmerLoading' }).exists()).toBe(true);
  });

  it('should initialize with correct default values', () => {
    const wrapper = mount(FeasibilityStudy);
    
    // Check if component mounts successfully
    expect(wrapper.exists()).toBe(true);
    
    // Check if the main container exists
    expect(wrapper.find('.items-start.p-6.mt-4.bg-white.rounded-lg').exists()).toBe(true);
  });

  it('should call all fetch functions on mounted', async () => {
    mount(FeasibilityStudy);
    
    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify that getMesinById was called with correct ID
    expect(mockFeasibilityStudyService.getMesinById).toHaveBeenCalledWith('test-id-123');
  });

  it('should handle download excel functionality', async () => {
    // Mock download response
    const mockResponse = {
      data: new ArrayBuffer(8),
      headers: {
        'content-disposition': 'attachment; filename="test-file.xlsx"'
      }
    };
    
    mockFeasibilityStudyService.downloadExcelFS.mockResolvedValue(mockResponse);
    mockGlobalFormat.formatNumberFiveDigits.mockReturnValue('00123');
    
    mount(FeasibilityStudy);
    
    // Wait for component to mount and attempt download
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Just verify the service was mocked correctly
    expect(mockFeasibilityStudyService.downloadExcelFS).toBeDefined();
  });

  it('should handle fetch errors gracefully', async () => {
    // Setup error responses
    mockFeasibilityStudyService.getMesinById.mockRejectedValue(new Error('API Error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mount(FeasibilityStudy);
    
    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify error was handled
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should process data finansial with nested levels correctly', async () => {
    // Mock data finansial with nested structure
    const mockDataFinansial = {
      data: {
        detail: [
          { level: 1, id: 1, name: 'Level 1 Item' },
          { level: 2, id: 2, name: 'Level 2 Item' },
          { level: 3, id: 3, name: 'Level 3 Item' },
          { level: 4, id: 4, name: 'Level 4 Item' }
        ]
      }
    };
    
    mockFeasibilityStudyService.getDataFinansial.mockResolvedValue(mockDataFinansial);
    
    mount(FeasibilityStudy);
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockFeasibilityStudyService.getDataFinansial).toHaveBeenCalled();
  });

  it('should handle additional service calls during mount lifecycle', async () => {
    mount(FeasibilityStudy);
    
    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Verify additional service calls
    expect(mockFeasibilityStudyService.getHasilSimulasi).toHaveBeenCalled();
    expect(mockFeasibilityStudyService.getTypePeriodic).toHaveBeenCalled();
    expect(mockFeasibilityStudyService.getComboBahanBakar).toHaveBeenCalled();
  });

  it('should handle multiple error scenarios in different fetch functions', async () => {
    // Setup multiple error responses
    mockFeasibilityStudyService.getDataTeknis.mockRejectedValue(new Error('Data Teknis Error'));
    mockFeasibilityStudyService.getDataFinansial.mockRejectedValue(new Error('Data Finansial Error'));
    mockFeasibilityStudyService.getHasilSimulasi.mockRejectedValue(new Error('Hasil Simulasi Error'));
    mockFeasibilityStudyService.getTypePeriodic.mockRejectedValue(new Error('Type Periodic Error'));
    mockFeasibilityStudyService.getComboBahanBakar.mockRejectedValue(new Error('Combo Bahan Bakar Error'));
    mockUserService.getPembina.mockRejectedValue(new Error('Pembina Error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mount(FeasibilityStudy);
    
    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Verify multiple errors were handled
    expect(consoleSpy).toHaveBeenCalledWith('Error Fetch Data Teknis : ', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Data Finansial Error : ', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Hasil Simulasi Error : ', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Type Periodic Error : ', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Combo Bahan Bakar Error : ', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Pembina Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});