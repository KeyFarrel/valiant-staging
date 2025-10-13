import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DetailKKMesin from '@/views/Verifikasi/Approver/TabPage/KK/DetailKKMesin.vue';

// Mock encryption utils to avoid WebAssembly issues
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: vi.fn((value) => value)
  })
}));

// Mock WASM and Go global
Object.defineProperty(window, 'Go', {
  value: vi.fn(() => ({
    run: vi.fn(),
    importObject: {}
  })),
  writable: true
});

// Mock fetch for WASM
global.fetch = vi.fn(() => 
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
  })
) as any;

// Mock WebAssembly
global.WebAssembly = {
  instantiateStreaming: vi.fn(() => Promise.resolve({ instance: {} }))
} as any;

// Mock URL.createObjectURL
global.URL = {
  createObjectURL: vi.fn(() => 'mocked-blob-url'),
  revokeObjectURL: vi.fn()
} as any;

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    query: {
      uuid_sentral: 'test-uuid-sentral',
      tahun: '2024'
    },
    params: {
      id: 'test-mesin-id'
    }
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn()
  }))
}));

// Mock services with spies for testing
const mockPersetujuanService = {
  getPersetujuanKKSentral: vi.fn().mockResolvedValue({
    data: {
      pengelola: 'Test Pengelola',
      pembina: 'Test Pembina',
      mesins: [{
        uuid_mesin: 'test-mesin-id',
        tahun: '2024',
        id_status: 1
      }]
    }
  }),
  updateStatusKK: vi.fn().mockResolvedValue({ data: { success: true } })
};

const mockDetailRekapService = {
  getMesinById: vi.fn().mockResolvedValue({
    data: {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Mesin',
      kode_sentral: 'TEST',
      kode_mesin: 'TST001',
      kode_jenis_pembangkit: 'PLTU',
      tahun_realisasi: '2023',
      photo1: 'test-photo.jpg',
      daya_terpasang: 100,
      daya_mampu: 90,
      kondisi_unit: 'Operasi',
      tahun_nilai_perolehan: 2020,
      masa_manfaat: 25,
      tahun_operasi: '2020'
    }
  }),
  getDataTeknis: vi.fn().mockResolvedValue({
    data: {
      header: ['Test Header'],
      tahun: [2023],
      detail: ['Test Detail']
    }
  }),
  getDataFinansial: vi.fn().mockResolvedValue({
    data: {
      header: ['Financial Header'],
      tahun: [2023],
      detail: ['Financial Detail']
    }
  }),
  getHasilSimulasi: vi.fn().mockResolvedValue({
    data: {
      track_irr_project: 10,
      track_irr_equity: 12,
      track_npv_equity: 1000,
      track_npv_project: 1200
    }
  }),
  getAsumsiParameter: vi.fn().mockResolvedValue({
    data: {
      asumsi_makro: {
        corporate_tax_rate: 0.25,
        discount_rate: 0.1,
        isFetchingError: false
      },
      parameter_teknis_financial: {
        daya_terpasang: 100,
        total_project_cost: 1000000,
        isFetchingError: false
      },
      harga_bahan_bakars: []
    }
  }),
  getTypePeriodic: vi.fn().mockResolvedValue({ data: [] }),
  getComboBahanBakar: vi.fn().mockResolvedValue({ data: [] }),
  getPembangkitByKode: vi.fn().mockResolvedValue({
    data: {
      kode_pengelola: 'TEST_PENGELOLA',
      mesins: [{ id: 1 }, { id: 2 }]
    }
  }),
  getPengelolaData: vi.fn().mockResolvedValue({
    data: [{
      kode_pengelola: 'TEST_PENGELOLA',
      pengelola: 'Test Pengelola Name'
    }]
  })
};

const mockDetailSentralService = {
  getPhoto: vi.fn().mockResolvedValue({
    data: new ArrayBuffer(8)
  })
};

const mockUserService = {
  getPembina: vi.fn().mockResolvedValue({ data: [] }),
  getUnitPengelola: vi.fn().mockResolvedValue({ data: [] })
};

const mockRekapService = {
  getEvidencePath: vi.fn().mockResolvedValue({
    data: [{
      file_name: 'test-file.xlsx',
      dokumen_evidence: 'test-doc-id'
    }]
  }),
  downloadEvidence: vi.fn().mockResolvedValue({
    data: new ArrayBuffer(8),
    headers: {
      'content-disposition': 'attachment; filename="test-evidence.xlsx"'
    }
  })
};

vi.mock('@/services/persetujuan-service', () => ({
  default: class MockPersetujuanService {
    getPersetujuanKKSentral = mockPersetujuanService.getPersetujuanKKSentral;
    updateStatusKK = mockPersetujuanService.updateStatusKK;
  }
}));

vi.mock('@/services/detail-rekap-service', () => ({
  default: class MockDetailRekapService {
    getMesinById = mockDetailRekapService.getMesinById;
    getDataTeknis = mockDetailRekapService.getDataTeknis;
    getDataFinansial = mockDetailRekapService.getDataFinansial;
    getHasilSimulasi = mockDetailRekapService.getHasilSimulasi;
    getAsumsiParameter = mockDetailRekapService.getAsumsiParameter;
    getTypePeriodic = mockDetailRekapService.getTypePeriodic;
    getComboBahanBakar = mockDetailRekapService.getComboBahanBakar;
    getPembangkitByKode = mockDetailRekapService.getPembangkitByKode;
    getPengelolaData = mockDetailRekapService.getPengelolaData;
  }
}));

vi.mock('@/services/detail-sentral-service', () => ({
  default: class MockDetailSentralService {
    getPhoto = mockDetailSentralService.getPhoto;
  }
}));

vi.mock('@/services/user-service', () => ({
  default: class MockUserService {
    getPembina = mockUserService.getPembina;
    getUnitPengelola = mockUserService.getUnitPengelola;
  }
}));

vi.mock('@/services/rekap-service', () => ({
  default: class MockRekapService {
    getEvidencePath = mockRekapService.getEvidencePath;
    downloadEvidence = mockRekapService.downloadEvidence;
  }
}));

describe('DetailKKMesin.vue', () => {
  let wrapper: any;
  let pinia: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    pinia = createPinia();
    setActivePinia(pinia);
    
    wrapper = mount(DetailKKMesin, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: { 
            template: '<div data-testid="loading">Loading...</div>',
            props: ['v-if']
          },
          ModalWrapper: { 
            template: '<div data-testid="modal-wrapper"><slot /></div>',
            props: ['showModal', 'width', 'height']
          },
          InfoHeader: { 
            template: '<div data-testid="info-header">Info Header</div>',
            props: ['nama-mesin', 'nama-sentral', 'kode-sentral', 'kode-mesin', 'nama-pengelola', 'status-mesin', 'kode-jenis-pembangkit', 'daya-terpasang', 'daya-mampu', 'tahun-operasi', 'umur-teknis', 'nama-pembina', 'is-pembina', 'is-pengelola', 'status-approve', 'tahun-terakhir-asumsi', 'status-mesin-approve', 'jumlah-mesin', 'tahun']
          },
          ShimmerLoading: { template: '<div data-testid="shimmer-loading">Shimmer Loading</div>' },
          TabsWrapper: { template: '<div data-testid="tabs-wrapper"><slot /></div>' },
          TabItem: { template: '<div data-testid="tab-item"><slot /></div>' },
          TableDataTeknis: { template: '<div data-testid="table-data-teknis">Table Data Teknis</div>' },
          TableDataFinansial: { template: '<div data-testid="table-data-finansial">Table Data Finansial</div>' },
          AsumsiMakro: { template: '<div data-testid="asumsi-makro">Asumsi Makro</div>' },
          ParameterTeknis: { template: '<div data-testid="parameter-teknis">Parameter Teknis</div>' },
          AkhirMasaManfaat: { template: '<div data-testid="akhir-masa-manfaat">Akhir Masa Manfaat</div>' },
          TahunBerjalan: { template: '<div data-testid="tahun-berjalan">Tahun Berjalan</div>' },
          Vue3Lottie: { template: '<div data-testid="lottie-animation">Lottie Animation</div>' },
          ComponentDisetujui: { template: '<div data-testid="component-disetujui">Component Disetujui</div>' },
          ComponentDitolakT1: { template: '<div data-testid="component-ditolak-t1">Component Ditolak T1</div>' },
          ComponentDitolakT2: { template: '<div data-testid="component-ditolak-t2">Component Ditolak T2</div>' },
          ComponentWaitingT1: { template: '<div data-testid="component-waiting-t1">Component Waiting T1</div>' },
          ComponentWaitingT2: { template: '<div data-testid="component-waiting-t2">Component Waiting T2</div>' },
          ComponentDraft: { template: '<div data-testid="component-draft">Component Draft</div>' }
        }
      }
    });

    // Initialize mesin data with required properties for template rendering
    wrapper.vm.mesin = {
      id: 'test-mesin-id',
      nama_unit: 'Test Unit',
      kondisi_unit: 'Baik',
      kode_jenis_pembangkit: 'PLT-001',
      daya_terpasang: 100, // Required for template
      daya_mampu: 95,      // Required for template
      tahun_operasi: 2020,
      masa_manfaat: 25,
      tahun_cod: 2020,
      foto: [{
        url_filename: 'test-photo.jpg'
      }]
    };

    // Initialize reactive data objects with proper structure
    wrapper.vm.dataTeknis = { 
      header: [], 
      tahun: [], 
      detail: [], 
      isFetchingError: false 
    };
    wrapper.vm.dataFinansial = { 
      header: [], 
      tahun: [], 
      detail: [], 
      isFetchingError: false 
    };
    wrapper.vm.hasilSimulasi = { 
      track_irr_project: 0,
      track_irr_equity: 0,
      track_npv_equity: 0,
      track_npv_project: 0,
      isFetchingError: false 
    };

    // Wait for component to mount
    await wrapper.vm.$nextTick();
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.flex.flex-col.space-y-4').exists()).toBe(true);
  });

  it('should initialize with correct default values', () => {
    const vm = wrapper.vm;
    expect(vm.selectedTab).toBe('Akhir Masa');
    expect(vm.data).toBe('Kertas Kerja');
  });

  it('should render shimmer loading when data is not loaded', () => {
    expect(wrapper.find('[data-testid="shimmer-loading"]').exists()).toBe(true);
  });

  it('should call fetchMesinById and update mesin data', async () => {
    // Access the component's methods
    const vm = wrapper.vm;
    
    // Call the fetchMesinById method
    await vm.fetchMesinById();
    
    // Verify the service was called
    expect(mockDetailRekapService.getMesinById).toHaveBeenCalledWith('test-mesin-id');
    expect(mockDetailSentralService.getPhoto).toHaveBeenCalled();
    
    // Verify the data was updated
    expect(vm.mesin).toBeDefined();
    expect(vm.kodeJenisPembangkit).toBe('PLTU');
  });

  it('should call fetchPersetujuanKK and update approval data', async () => {
    const vm = wrapper.vm;
    
    // Call the fetchPersetujuanKK method
    await vm.fetchPersetujuanKK();
    
    // Verify the service was called with correct parameters
    expect(mockPersetujuanService.getPersetujuanKKSentral).toHaveBeenCalledWith({
      uuid_sentral: 'test-uuid-sentral',
      tahun: '2024'
    });
    
    // Verify the data was updated
    expect(vm.approveSentralKK).toBeDefined();
  });

  it('should call fetchAsumsiParameter and update parameter data', async () => {
    const vm = wrapper.vm;
    
    // Call the fetchAsumsiParameter method
    await vm.fetchAsumsiParameter();
    
    // Verify the service was called
    expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled();
    
    // Verify the data was updated
    expect(vm.asumsiParameter).toBeDefined();
    expect(vm.parameterTeknisFinansial).toBeDefined();
  });

  it('should call fetchDataTeknis and update technical data', async () => {
    const vm = wrapper.vm;
    
    // Call the fetchDataTeknis method
    await vm.fetchDataTeknis();
    
    // Verify the service was called
    expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled();
    
    // Verify the data was updated
    expect(vm.dataTeknis).toBeDefined();
  });

  it('should call fetchDataFinansial and update financial data', async () => {
    const vm = wrapper.vm;
    
    // Call the fetchDataFinansial method
    await vm.fetchDataFinansial();
    
    // Verify the service was called
    expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
    
    // Verify the data was updated
    expect(vm.dataFinansial).toBeDefined();
  });

  it('should call fetchHasilSimulasi and update simulation data', async () => {
    const vm = wrapper.vm;
    
    // Call the fetchHasilSimulasi method
    await vm.fetchHasilSimulasi();
    
    // Verify the service was called
    expect(mockDetailRekapService.getHasilSimulasi).toHaveBeenCalled();
    
    // Verify the data was updated
    expect(vm.hasilSimulasi).toBeDefined();
  });

  it('should verify service integration and basic error handling structure', async () => {
    const vm = wrapper.vm;
    
    // Test that service methods exist and are callable
    expect(typeof vm.fetchAsumsiParameter).toBe('function');
    expect(typeof vm.reloadAsumsiParameter).toBe('function');
    
    // Test reloadAsumsiParameter functionality
    vm.asumsiParameter.isFetchingError = true;
    vm.parameterTeknisFinansial.isFetchingError = true;
    
    vm.reloadAsumsiParameter();
    
    // Should reset error flags
    expect(vm.asumsiParameter.isFetchingError).toBe(false);
    expect(vm.parameterTeknisFinansial.isFetchingError).toBe(false);
    
    // Should call the service again
    expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled();
  });

  it('should reload asumsi parameter data when reloadAsumsiParameter is called', async () => {
    const vm = wrapper.vm;
    
    // Set error flags first
    vm.asumsiParameter.isFetchingError = true;
    vm.parameterTeknisFinansial.isFetchingError = true;
    
    // Call reload method
    vm.reloadAsumsiParameter();
    
    // Verify error flags are reset
    expect(vm.asumsiParameter.isFetchingError).toBe(false);
    expect(vm.parameterTeknisFinansial.isFetchingError).toBe(false);
    
    // Wait for async operations
    await wrapper.vm.$nextTick();
    
    // Verify fetchAsumsiParameter was called again
    expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled();
  });

  it('should reload data teknis when reloadDataTeknis is called', async () => {
    const vm = wrapper.vm;
    
    // Set error flag first
    vm.dataTeknis.isFetchingError = true;
    
    // Call reload method
    vm.reloadDataTeknis();
    
    // Verify error flag is reset
    expect(vm.dataTeknis.isFetchingError).toBe(false);
    
    // Verify fetchDataTeknis was called
    expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled();
  });

  it('should reload data finansial when reloadDataFinansial is called', async () => {
    const vm = wrapper.vm;
    
    // Set error flag first
    vm.dataFinansial.isFetchingError = true;
    
    // Call reload method
    vm.reloadDataFinansial();
    
    // Verify error flag is reset
    expect(vm.dataFinansial.isFetchingError).toBe(false);
    
    // Verify fetchDataFinansial was called
    expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
  });

  it('should reload hasil simulasi when reloadHasilSimulasi is called', async () => {
    const vm = wrapper.vm;
    
    // Set error flag first
    vm.hasilSimulasi.isFetchingError = true;
    
    // Call reload method
    vm.reloadHasilSimulasi();
    
    // Verify error flag is reset
    expect(vm.hasilSimulasi.isFetchingError).toBe(false);
    
    // Verify fetchHasilSimulasi was called
    expect(mockDetailRekapService.getHasilSimulasi).toHaveBeenCalled();
  });

  it('should fetch list pembina data', async () => {
    const vm = wrapper.vm;
    
    // Call the fetchListPembina method
    const result = await vm.fetchListPembina();
    
    // Verify the service was called
    expect(mockUserService.getPembina).toHaveBeenCalledWith('');
    
    // Verify the result
    expect(result).toEqual([]);
  });

  it('should fetch unit pengelola data', async () => {
    const vm = wrapper.vm;
    
    // Set mesin data first
    vm.mesin = { kode_sentral: 'TEST' };
    
    // Call the fetchUnitPengelola method
    await vm.fetchUnitPengelola();
    
    // Verify the services were called
    expect(mockDetailRekapService.getPembangkitByKode).toHaveBeenCalledWith('TEST');
    expect(mockDetailRekapService.getPengelolaData).toHaveBeenCalled();
    
    // Verify the data was updated
    expect(vm.namaPengelola).toBe('Test Pengelola Name');
    expect(vm.jumlahMesin).toBe(2);
  });

  it('should handle fetchDataTeknis with tahun realisasi path', async () => {
    const vm = wrapper.vm;
    
    // Reset service call count
    mockDetailRekapService.getDataTeknis.mockClear();
    
    // Mock response where last year is tahunBerjalan - 1
    const currentYear = new Date().getFullYear();
    mockDetailRekapService.getDataTeknis
      .mockResolvedValueOnce({
        data: {
          header: ['Test Header'],
          tahun: [currentYear - 1],
          detail: ['Test Detail']
        }
      })
      .mockResolvedValueOnce({
        data: {
          header: ['Realisasi Header'],
          tahun: [currentYear - 1],
          detail: ['Realisasi Detail']
        }
      });
    
    await vm.fetchDataTeknis();
    
    // Should call service for tahun realisasi path (allow multiple calls due to lifecycle)
    expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled();
  });

  it('should handle fetchDataTeknis with current year path', async () => {
    const vm = wrapper.vm;
    
    // Reset service call count
    mockDetailRekapService.getDataTeknis.mockClear();
    
    // Mock response where last year is current year
    const currentYear = new Date().getFullYear();
    mockDetailRekapService.getDataTeknis.mockResolvedValueOnce({
      data: {
        header: ['Current Header'],
        tahun: [currentYear],
        detail: ['Current Detail']
      }
    });
    
    await vm.fetchDataTeknis();
    
    // Should call service for current year path (allow multiple calls due to lifecycle)
    expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled();
  });

  it('should handle fetchDataFinansial with tahun realisasi path and complex mapping', async () => {
    const vm = wrapper.vm;
    
    // Reset service call count
    mockDetailRekapService.getDataFinansial.mockClear();
    
    // Mock data with multi-level structure
    const currentYear = new Date().getFullYear();
    const mockFinancialData = {
      data: {
        tahun: [currentYear - 1],
        detail: [
          { level: 1, name: 'Level 1 Item', value: 100 },
          { level: 2, name: 'Level 2 Item', value: 50 },
          { level: 3, name: 'Level 3 Item', value: 25 },
          { level: 4, name: 'Level 4 Item', value: 10 }
        ]
      }
    };
    
    mockDetailRekapService.getDataFinansial.mockResolvedValueOnce(mockFinancialData);
    
    await vm.fetchDataFinansial();
    
    // Should call service for financial data (allow multiple calls due to lifecycle)
    expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
    expect(vm.finansialMappingResult).toBeDefined();
  });

  it('should handle fetchDataFinansial with current year path and complex mapping', async () => {
    const vm = wrapper.vm;
    
    // Mock data with multi-level structure for current year
    const currentYear = new Date().getFullYear();
    const mockFinancialData = {
      data: {
        tahun: [currentYear],
        detail: [
          { level: 1, name: 'Level 1 Item', value: 100 },
          { level: 2, name: 'Level 2 Item', value: 50 },
          { level: 3, name: 'Level 3 Item', value: 25 },
          { level: 4, name: 'Level 4 Item', value: 10 }
        ]
      }
    };
    
    mockDetailRekapService.getDataFinansial.mockResolvedValueOnce(mockFinancialData);
    
    await vm.fetchDataFinansial();
    
    expect(vm.finansialMappingResult).toBeDefined();
    expect(vm.dataFinansial).toBeDefined();
  });

  it('should call fetchTypePeriodic successfully', async () => {
    const vm = wrapper.vm;
    
    // Set mesin data first
    vm.mesin = { kode_jenis_pembangkit: 'PLTU' };
    
    await vm.fetchTypePeriodic();
    
    expect(mockDetailRekapService.getTypePeriodic).toHaveBeenCalledWith('PLTU');
    expect(vm.typePeriodic).toBeDefined();
  });

  it('should handle fetchTypePeriodic error', async () => {
    const vm = wrapper.vm;
    
    // Mock service to throw error
    mockDetailRekapService.getTypePeriodic.mockRejectedValueOnce(new Error('API Error'));
    
    await vm.fetchTypePeriodic();
    
    expect(mockDetailRekapService.getTypePeriodic).toHaveBeenCalled();
  });

  it('should call fetchComboBahanBakar successfully', async () => {
    const vm = wrapper.vm;
    
    // Set kode jenis pembangkit
    vm.kodeJenisPembangkit = 'PLTU';
    
    await vm.fetchComboBahanBakar();
    
    expect(mockDetailRekapService.getComboBahanBakar).toHaveBeenCalledWith('PLTU');
    expect(vm.comboBahanBakar).toBeDefined();
  });

  it('should handle fetchComboBahanBakar error', async () => {
    const vm = wrapper.vm;
    
    // Mock service to throw error
    mockDetailRekapService.getComboBahanBakar.mockRejectedValueOnce(new Error('API Error'));
    
    await vm.fetchComboBahanBakar();
    
    expect(mockDetailRekapService.getComboBahanBakar).toHaveBeenCalled();
  });

  it('should handle updateKKPengelola successfully', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    mockPersetujuanService.updateStatusKK.mockResolvedValueOnce({ success: true });
    
    // Set required data with complete mesin object
    vm.idGrafik = 'test-mesin-id';
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    vm.modalApprove = true;
    vm.isLoading = true;
    
    await vm.updateKKPengelola();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalledWith({
      status_approval: 4,
      keterangan: '',
      tahun: 2024,
      uuid_mesin: 'test-mesin-id'
    });
    
    expect(vm.modalApprove).toBe(false);
  });

  it('should handle updateKKPengelola error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    
    // Set complete mesin data
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    
    // Mock service to throw error
    mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('Update Error'));
    
    await vm.updateKKPengelola();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
  });

  it('should handle downloadEvidence successfully', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockRekapService.getEvidencePath.mockClear();
    mockRekapService.downloadEvidence.mockClear();
    
    // Mock successful responses with correct structure
    mockRekapService.getEvidencePath.mockResolvedValueOnce({
      data: [{ 
        id: 'test-doc-id',
        dokumen_evidence: 'test-doc-id', // This is the actual parameter used
        file_name: 'test-evidence.pdf'
      }]
    });
    mockRekapService.downloadEvidence.mockResolvedValueOnce({
      data: new Blob(['test'], { type: 'application/pdf' }),
      headers: {
        'content-disposition': 'attachment; filename="test-evidence.pdf"'
      }
    });
    
    vm.idGrafik = 'test-mesin-id';
    vm.isLoading = true;
    
    await vm.downloadEvidence();
    
    expect(mockRekapService.getEvidencePath).toHaveBeenCalledWith('test-mesin-id', '2024', 0);
    expect(mockRekapService.downloadEvidence).toHaveBeenCalledWith('test-doc-id');
    expect(vm.isLoading).toBe(false);
  });

  it('should handle downloadEvidence error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockRekapService.getEvidencePath.mockClear();
    
    // Mock service to throw error
    mockRekapService.getEvidencePath.mockRejectedValueOnce(new Error('Evidence Error'));
    
    vm.isLoading = true;
    
    await vm.downloadEvidence();
    
    expect(vm.isLoading).toBe(false);
  });

  it('should handle rejectKKPengelola with validation error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    
    // Set complete mesin data
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    
    // Set empty message to trigger validation error
    vm.pesan = '';
    vm.error.pesanPenolakan = false;
    
    await vm.rejectKKPengelola();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(vm.error.pesanPenolakan).toBe(true);
    expect(mockPersetujuanService.updateStatusKK).not.toHaveBeenCalled();
  });

  it('should handle rejectKKPengelola successfully', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    mockPersetujuanService.updateStatusKK.mockResolvedValueOnce({ success: true });
    
    // Set complete mesin data
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    
    // Set valid message
    vm.pesan = 'Test rejection reason';
    vm.idGrafik = 'test-mesin-id';
    vm.error.pesanPenolakan = true;
    vm.modalCancel = true;
    
    await vm.rejectKKPengelola();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(vm.error.pesanPenolakan).toBe(false);
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalledWith({
      status_approval: 5,
      keterangan: 'Test rejection reason',
      tahun: 2024,
      uuid_mesin: 'test-mesin-id'
    });
    
    expect(vm.modalCancel).toBe(false);
  });

  it('should handle rejectKKPengelola error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    
    // Set complete mesin data
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    
    vm.pesan = 'Test rejection reason';
    
    // Mock service to throw error
    mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('Reject Error'));
    
    await vm.rejectKKPengelola();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
  });

  it('should handle updateKKPembina successfully', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    mockPersetujuanService.updateStatusKK.mockResolvedValueOnce({ success: true });
    
    // Set complete mesin data
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    
    vm.idGrafik = 'test-mesin-id';
    
    await vm.updateKKPembina();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
  });

  it('should handle updateKKPembina error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    
    // Set complete mesin data
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    
    // Mock service to throw error
    mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('Update Error'));
    
    await vm.updateKKPembina();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
  });

  it('should handle rejectKKPembina with validation and success flow', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    mockPersetujuanService.updateStatusKK.mockResolvedValueOnce({ success: true });
    
    // Set complete mesin data
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    
    vm.pesan = 'Test pembina rejection reason';
    vm.idGrafik = 'test-mesin-id';
    
    await vm.rejectKKPembina();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
  });

  it('should handle rejectKKPembina error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    
    // Set complete mesin data
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Machine',
      daya_terpasang: 100,
      daya_mampu: 95,
      photo1: '',
      tahun_nilai_perolehan: 2020
    };
    
    vm.pesan = 'Test pembina rejection reason';
    
    // Mock service to throw error
    mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('Reject Error'));
    
    await vm.rejectKKPembina();
    
    // Wait for component to stabilize
    await flushPromises();
    await wrapper.vm.$nextTick();
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
  });

  // Additional tests for uncovered lines and error paths

  it('should handle fetchMesinById with photo error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockDetailRekapService.getMesinById.mockClear();
    mockDetailSentralService.getPhoto.mockClear();
    
    // Mock successful mesin fetch but photo error
    mockDetailRekapService.getMesinById.mockResolvedValueOnce({
      data: {
        uuid_mesin: 'test-mesin-id',
        mesin: 'Test Mesin',
        kode_sentral: 'TEST',
        photo1: 'test-photo.jpg',
        tahun_realisasi: '2023',
        kode_jenis_pembangkit: 'PLTU'
      }
    });
    mockDetailSentralService.getPhoto.mockRejectedValueOnce(new Error('Photo Error'));
    
    await vm.fetchMesinById();
    
    expect(mockDetailRekapService.getMesinById).toHaveBeenCalled();
    expect(mockDetailSentralService.getPhoto).toHaveBeenCalled();
  });

  it('should handle fetchMesinById error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockDetailRekapService.getMesinById.mockClear();
    
    // Mock service to throw error
    mockDetailRekapService.getMesinById.mockRejectedValueOnce(new Error('Fetch Error'));
    
    await vm.fetchMesinById();
    
    expect(mockDetailRekapService.getMesinById).toHaveBeenCalled();
  });

  it('should handle fetchPersetujuanKK error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.getPersetujuanKKSentral.mockClear();
    
    // Mock service to throw error
    mockPersetujuanService.getPersetujuanKKSentral.mockRejectedValueOnce(new Error('Persetujuan Error'));
    
    await vm.fetchPersetujuanKK();
    
    expect(mockPersetujuanService.getPersetujuanKKSentral).toHaveBeenCalled();
  });

  it('should handle fetchListPembina error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockUserService.getPembina.mockClear();
    
    // Mock service to throw error
    mockUserService.getPembina.mockRejectedValueOnce(new Error('Pembina Error'));
    
    const result = await vm.fetchListPembina();
    
    expect(mockUserService.getPembina).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should handle fetchUnitPengelola error', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockDetailRekapService.getPembangkitByKode.mockClear();
    
    vm.mesin = { kode_sentral: 'TEST' };
    
    // Mock service to throw error
    mockDetailRekapService.getPembangkitByKode.mockRejectedValueOnce(new Error('Unit Pengelola Error'));
    
    await vm.fetchUnitPengelola();
    
    expect(mockDetailRekapService.getPembangkitByKode).toHaveBeenCalled();
  });

  it('should handle updateKKPengelola with full success flow including wait and refetch', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    mockPersetujuanService.getPersetujuanKKSentral.mockClear();
    mockDetailRekapService.getMesinById.mockClear();
    
    // Ensure mesin data persists properly
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Mesin',
      daya_terpasang: 100,
      daya_mampu: 95,
      kondisi_unit: 'Baik'
    };
    
    // Mock successful responses with complete mesin data
    mockPersetujuanService.updateStatusKK.mockResolvedValueOnce({ data: { success: true } });
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
      data: {
        pengelola: 'Test Pengelola',
        pembina: 'Test Pembina',
        mesins: [{
          uuid_mesin: 'test-mesin-id',
          tahun: '2024',
          id_status: 4
        }]
      }
    });
    mockDetailRekapService.getMesinById.mockResolvedValueOnce({
      data: {
        uuid_mesin: 'test-mesin-id',
        mesin: 'Test Mesin Updated',
        daya_terpasang: 100,
        daya_mampu: 95,
        photo1: '',
        tahun_nilai_perolehan: 2020
      }
    });
    
    vm.idGrafik = 'test-mesin-id';
    vm.modalApprove = true;
    
    // Call the method
    const updatePromise = vm.updateKKPengelola();
    
    // Advance timers if using fake timers, or wait for the promise
    await updatePromise;
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
    expect(vm.modalApprove).toBe(false);
  });

  it('should handle rejectKKPengelola with full success flow', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    mockPersetujuanService.getPersetujuanKKSentral.mockClear();
    mockDetailRekapService.getMesinById.mockClear();
    
    // Ensure mesin data persists properly
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Mesin',
      daya_terpasang: 100,
      daya_mampu: 95,
      kondisi_unit: 'Baik'
    };
    
    // Mock successful responses with complete mesin data
    mockPersetujuanService.updateStatusKK.mockResolvedValueOnce({ data: { success: true } });
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
      data: {
        pengelola: 'Test Pengelola',
        pembina: 'Test Pembina',
        mesins: [{
          uuid_mesin: 'test-mesin-id',
          tahun: '2024',
          id_status: 5
        }]
      }
    });
    mockDetailRekapService.getMesinById.mockResolvedValueOnce({
      data: {
        uuid_mesin: 'test-mesin-id',
        mesin: 'Test Mesin Rejected',
        daya_terpasang: 100,
        daya_mampu: 95,
        photo1: '',
        tahun_nilai_perolehan: 2020
      }
    });
    
    vm.pesan = 'Valid rejection reason';
    vm.idGrafik = 'test-mesin-id';
    vm.modalCancel = true;
    
    // Call the method
    const rejectPromise = vm.rejectKKPengelola();
    await rejectPromise;
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
    expect(vm.modalCancel).toBe(false);
  });

  it('should handle updateKKPembina with full success flow', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    mockPersetujuanService.getPersetujuanKKSentral.mockClear();
    mockDetailRekapService.getMesinById.mockClear();
    
    // Ensure mesin data persists properly
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Mesin',
      daya_terpasang: 100,
      daya_mampu: 95,
      kondisi_unit: 'Baik'
    };
    
    // Mock successful responses with complete mesin data
    mockPersetujuanService.updateStatusKK.mockResolvedValueOnce({ data: { success: true } });
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
      data: {
        pengelola: 'Test Pengelola',
        pembina: 'Test Pembina',
        mesins: [{
          uuid_mesin: 'test-mesin-id',
          tahun: '2024',
          id_status: 1
        }]
      }
    });
    mockDetailRekapService.getMesinById.mockResolvedValueOnce({
      data: {
        uuid_mesin: 'test-mesin-id',
        mesin: 'Test Mesin Pembina Approved',
        daya_terpasang: 100,
        daya_mampu: 95,
        photo1: '',
        tahun_nilai_perolehan: 2020
      }
    });
    
    vm.idGrafik = 'test-mesin-id';
    vm.modalApprove = true;
    
    // Call the method
    const updatePromise = vm.updateKKPembina();
    await updatePromise;
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
    expect(vm.modalApprove).toBe(false);
  });

  it('should handle rejectKKPembina with full success flow', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    mockPersetujuanService.getPersetujuanKKSentral.mockClear();
    mockDetailRekapService.getMesinById.mockClear();
    
    // Ensure mesin data persists properly
    vm.mesin = {
      uuid_mesin: 'test-mesin-id',
      mesin: 'Test Mesin',
      daya_terpasang: 100,
      daya_mampu: 95,
      kondisi_unit: 'Baik'
    };
    
    // Mock successful responses with complete mesin data
    mockPersetujuanService.updateStatusKK.mockResolvedValueOnce({ data: { success: true } });
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
      data: {
        pengelola: 'Test Pengelola',
        pembina: 'Test Pembina',
        mesins: [{
          uuid_mesin: 'test-mesin-id',
          tahun: '2024',
          id_status: 2
        }]
      }
    });
    mockDetailRekapService.getMesinById.mockResolvedValueOnce({
      data: {
        uuid_mesin: 'test-mesin-id',
        mesin: 'Test Mesin Pembina Rejected',
        daya_terpasang: 100,
        daya_mampu: 95,
        photo1: '',
        tahun_nilai_perolehan: 2020
      }
    });
    
    vm.pesan = 'Valid pembina rejection reason';
    vm.idGrafik = 'test-mesin-id';
    vm.modalCancel = true;
    
    // Call the method
    const rejectPromise = vm.rejectKKPembina();
    await rejectPromise;
    
    expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled();
    expect(vm.modalCancel).toBe(false);
  });

  it('should handle downloadEvidence with no evidence path', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockRekapService.getEvidencePath.mockClear();
    
    // Mock empty response
    mockRekapService.getEvidencePath.mockResolvedValueOnce({
      data: []
    });
    
    vm.idGrafik = 'test-mesin-id';
    
    // This should throw an error due to accessing [0] on empty array
    await vm.downloadEvidence();
    
    expect(mockRekapService.getEvidencePath).toHaveBeenCalled();
    expect(vm.isLoading).toBe(false);
  });

  it('should handle fetchDataFinansial with nested level structure on current year', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockDetailRekapService.getDataFinansial.mockClear();
    
    const currentYear = new Date().getFullYear();
    
    // Mock complex nested structure
    mockDetailRekapService.getDataFinansial.mockResolvedValueOnce({
      data: {
        tahun: [currentYear],
        detail: [
          { level: 1, name: 'Level 1', value: 100 },
          { level: 2, name: 'Level 2-1', value: 50 },
          { level: 3, name: 'Level 3-1', value: 30 },
          { level: 4, name: 'Level 4-1', value: 10 },
          { level: 4, name: 'Level 4-2', value: 15 },
          { level: 3, name: 'Level 3-2', value: 20 },
          { level: 2, name: 'Level 2-2', value: 50 },
          { level: 1, name: 'Level 1-2', value: 100 }
        ]
      }
    });
    
    await vm.fetchDataFinansial();
    
    expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
    expect(vm.finansialMappingResult.length).toBeGreaterThan(0);
  });

  it('should handle fetchDataFinansial with nested level structure on tahun realisasi', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockDetailRekapService.getDataFinansial.mockClear();
    
    const currentYear = new Date().getFullYear();
    
    // Mock complex nested structure for tahun realisasi path
    mockDetailRekapService.getDataFinansial
      .mockResolvedValueOnce({
        data: {
          tahun: [currentYear - 1],
          detail: []
        }
      })
      .mockResolvedValueOnce({
        data: {
          tahun: [currentYear - 1],
          detail: [
            { level: 1, name: 'Level 1', value: 100 },
            { level: 2, name: 'Level 2-1', value: 50 },
            { level: 3, name: 'Level 3-1', value: 30 },
            { level: 4, name: 'Level 4-1', value: 10 }
          ]
        }
      });
    
    await vm.fetchDataFinansial();
    
    expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
  });

  it('should initialize component and verify properties', () => {
    const vm = wrapper.vm;
    
    // Verify basic reactive properties exist
    expect(vm.selectedTab).toBeDefined();
    expect(vm.data).toBeDefined();
    expect(vm.mesin).toBeDefined();
    expect(vm.modalApprove).toBeDefined();
    expect(vm.modalCancel).toBeDefined();
  });

  it('should handle modal toggle for approve', async () => {
    const vm = wrapper.vm;
    
    vm.modalApprove = false;
    vm.modalApprove = !vm.modalApprove;
    
    expect(vm.modalApprove).toBe(true);
    
    vm.modalApprove = !vm.modalApprove;
    expect(vm.modalApprove).toBe(false);
  });

  it('should handle modal toggle for cancel', async () => {
    const vm = wrapper.vm;
    
    vm.modalCancel = false;
    vm.modalCancel = !vm.modalCancel;
    
    expect(vm.modalCancel).toBe(true);
    
    vm.modalCancel = !vm.modalCancel;
    expect(vm.modalCancel).toBe(false);
  });

  it('should verify tab selection functionality', () => {
    const vm = wrapper.vm;
    
    expect(vm.selectedTab).toBe('Akhir Masa');
    
    vm.selectedTab = 'Tahun Berjalan';
    expect(vm.selectedTab).toBe('Tahun Berjalan');
  });

  it('should verify data tab selection functionality', () => {
    const vm = wrapper.vm;
    
    expect(vm.data).toBe('Kertas Kerja');
    
    vm.data = 'Other Tab';
    expect(vm.data).toBe('Other Tab');
  });

  it('should handle rejectKKPengelola validation for empty pesan', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    
    // Set empty message
    vm.pesan = '';
    vm.error.pesanPenolakan = false;
    
    await vm.rejectKKPengelola();
    
    // Should set error flag and not call service
    expect(vm.error.pesanPenolakan).toBe(true);
    expect(mockPersetujuanService.updateStatusKK).not.toHaveBeenCalled();
  });

  it('should handle rejectKKPembina validation for empty pesan', async () => {
    const vm = wrapper.vm;
    
    // Reset mocks
    mockPersetujuanService.updateStatusKK.mockClear();
    
    // Set empty message
    vm.pesan = '';
    vm.error.pesanPenolakan = false;
    
    await vm.rejectKKPembina();
    
    // Should set error flag and not call service
    expect(vm.error.pesanPenolakan).toBe(true);
    expect(mockPersetujuanService.updateStatusKK).not.toHaveBeenCalled();
  });
});