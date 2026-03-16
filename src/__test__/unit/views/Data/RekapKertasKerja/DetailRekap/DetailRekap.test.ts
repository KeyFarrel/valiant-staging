import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DetailRekap from '@/views/Data/RekapKertasKerja/DetailRekap/DetailRekap.vue';

// Mock router FIRST with inline function
vi.mock('@/router', () => ({
  default: {
    replace: vi.fn()
  }
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: { tahun: '2024' },
    params: { id: '1' }
  })
}));

// Define mock variables
const mockGetMesinById = vi.fn();
const mockGetAsumsiParameter = vi.fn();
const mockGetDataTeknis = vi.fn();
const mockGetDataFinansial = vi.fn();
const mockGetHasilSimulasi = vi.fn();
const mockGetComboBahanBakar = vi.fn();
const mockGetRealisasiProyeksiMesin = vi.fn();
const mockGetEvidencePath = vi.fn();
const mockDownloadEvidence = vi.fn();
const mockDownloadExcelKK = vi.fn();
const mockGetTahunRealisasi = vi.fn();
const mockGetListTahunAsumsi = vi.fn();
const mockGetPembangkitByKode = vi.fn();
const mockGetPengelolaData = vi.fn();
const mockGetTypePeriodic = vi.fn();
const mockGetPembina = vi.fn();

// Mock services with default export

vi.mock('@/services/rekap-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getRekap: vi.fn(() => Promise.resolve({ data: { result: 'success' } })),
    downloadEvidence: mockDownloadEvidence,
    getEvidencePath: mockGetEvidencePath,
    downloadExcelKK: mockDownloadExcelKK
  }; })
}));

vi.mock('@/services/detail-rekap-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getMesinById: mockGetMesinById,
    getAsumsiParameter: mockGetAsumsiParameter,
    getDataTeknis: mockGetDataTeknis,
    getDataFinansial: mockGetDataFinansial,
    getHasilSimulasi: mockGetHasilSimulasi,
    getComboBahanBakar: mockGetComboBahanBakar,
    getTahunRealisasi: mockGetTahunRealisasi,
    getListTahunAsumsi: mockGetListTahunAsumsi,
    getPembangkitByKode: mockGetPembangkitByKode,
    getPengelolaData: mockGetPengelolaData,
    getTypePeriodic: mockGetTypePeriodic
  }; })
}));

vi.mock('@/services/grafik-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getRealisasiProyeksiMesin: mockGetRealisasiProyeksiMesin
  }; })
}));

vi.mock('@/services/user-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getPembina: mockGetPembina
  }; })
}));

vi.mock('@/services/helper/year-picker-service', () => ({
  default: class YearPickerService {
    filterYears = vi.fn(() => ({}));
  }
}));

vi.mock('@/services/format/global-format', () => ({
  default: class GlobalFormat {
    formatNumberFiveDigits = vi.fn((num) => String(num).padStart(5, '0'));
  }
}));

// Setup WASM mocks
Object.defineProperty(global, 'window', {
  value: {
    ...global.window,
    Go: class Go {
      importObject = {};
      run = vi.fn();
    },
    URL: {
      createObjectURL: vi.fn(() => 'mock-url')
    }
  },
  writable: true
});

Object.defineProperty(window, 'Go', {
  value: class Go {
    importObject = {};
    run = vi.fn();
  },
  writable: true
});

vi.mock('@/services/helper/encryption', () => ({
  initWasm: vi.fn(() => Promise.resolve()),
  encryptWithWasm: vi.fn((value) => `encrypted-${value}`),
  decryptWithWasm: vi.fn((value) => value.replace('encrypted-', ''))
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    getValue: vi.fn(() => 'mocked-token'),
    encryptValue: vi.fn((value) => `encrypted-${value}`),
    decryptValue: vi.fn((value) => value.replace('encrypted-', ''))
  })
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
  })
) as any;

global.WebAssembly = {
  ...global.WebAssembly,
  instantiateStreaming: vi.fn(() => Promise.resolve({
    instance: {}
  }))
} as any;

vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn()
}));

describe('DetailRekap.vue', () => {
  let wrapper: any;

  const mockMesinData = {
    data: {
      uuid: 1,
      mesin: 'Test Mesin',
      kondisi_unit: 'Beroperasi',
      kode_jenis_pembangkit: 'PLTU',
      kode_sentral: 'SEN001',
      kode_mesin: 'MES001',
      daya_terpasang: 100,
      daya_mampu: 95,
      tahun_operasi: 2020,
      masa_manfaat: 25,
      tahun_asumsi: '2023',
      tahun_realisasi: '2023'
    }
  };

  const mockAsumsiParameterData = {
    data: {
      asumsi_makro: {
        corporate_tax_rate: 25,
        discount_rate: 10,
        interest_rate: 5.5,
        loan_tenor: 10,
        loan_portion: 70,
        equity_portion: 30
      },
      parameter_teknis_financial: {
        daya_terpasang: 100,
        daya_mampu_netto_mw: 95,
        auxiliary: 5,
        susut_trafo: 2,
        ps: 3,
        total_project_cost: 1000000,
        loan: 700000,
        equity: 300000,
        nphr: 2500,
        electricity_price_a_rp_per_kwbln: 1000,
        electricity_price_b_rp_per_kwbln: 1100,
        electricity_price_c_rp_per_kwh: 1200,
        electricity_price_d_rp_per_kwh: 1300
      },
      harga_bahan_bakars: [
        { kode_bahan_bakar: 'BBL001', harga_bahan_bakar: 1000, sfc: 0.35 }
      ]
    }
  };

  const defaultMountOptions = {
    global: {
      stubs: {
        Loading: true,
        InfoHeader: true,
        ShimmerLoading: true,
        TabsWrapper: true,
        TabItem: true,
        VueDatePicker: true,
        DraftComponentStatus: true,
        WaitingT1ComponentStatus: true,
        WaitingT2ComponentStatus: true,
        DitolakT1ComponentStatus: true,
        DitolakT2ComponentStatus: true,
        TahunBerjalan: true,
        AkhirMasaManfaat: true,
        AsumsiMakro: true,
        ParameterTeknis: true,
        TableDataTeknis: true,
        TableDataFinansial: true
      }
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockGetMesinById.mockResolvedValue(mockMesinData);
    mockGetAsumsiParameter.mockResolvedValue(mockAsumsiParameterData);
    mockGetDataTeknis.mockResolvedValue({ data: { header: [], tahun: [], detail: [] } });
    mockGetDataFinansial.mockResolvedValue({ data: { header: [], tahun: [], detail: [] } });
    mockGetHasilSimulasi.mockResolvedValue({ 
      data: {
        track_irr_project: 10,
        track_irr_equity: 12,
        track_npv_project: 100000,
        track_npv_equity: 50000,
        track_average_cf: 5000,
        track_average_eaf: 85,
        now_track_irr_project: 9,
        now_track_irr_equity: 11,
        now_track_npv_project: 90000,
        now_track_npv_equity: 45000,
        now_track_average_cf: 4500,
        now_track_average_eaf: 83
      }
    });
    mockGetComboBahanBakar.mockResolvedValue({ data: [] });
    mockGetRealisasiProyeksiMesin.mockResolvedValue({ data: { status: 'Disetujui' } });
    mockGetTahunRealisasi.mockResolvedValue({ data: [{ tahun: '2023' }, { tahun: '2024' }] });
    mockGetListTahunAsumsi.mockResolvedValue({ data: [{ tahun: '2020' }, { tahun: '2030' }] });
    mockGetPembangkitByKode.mockResolvedValue({ 
      data: { 
        kode_pengelola: 'PGL001',
        uuid_pembina: 'pembina-uuid-123'
      } 
    });
    mockGetPengelolaData.mockResolvedValue({ 
      data: [
        { kode_pengelola: 'PGL001', pengelola: 'Test Pengelola' }
      ] 
    });
    mockGetTypePeriodic.mockResolvedValue({ data: [] });
    mockGetPembina.mockResolvedValue({ 
      data: [
        { uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }
      ] 
    });
  });

  it('should render the component successfully', () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    expect(wrapper.exists()).toBe(true);
  });

  it('should fetch mesin data on mount', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockGetMesinById).toHaveBeenCalled();
  });

  it('should handle fetchMesinById error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetMesinById.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should download evidence successfully', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockGetEvidencePath.mockResolvedValue({ 
      data: [{ 
        file_name: 'evidence.xlsx',
        dokumen_evidence: 'path/to/evidence'
      }] 
    });
    mockDownloadEvidence.mockResolvedValue({
      data: mockBlob,
      headers: {
        'content-disposition': 'attachment; filename="evidence.xlsx"'
      }
    });

    // Mock document methods
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.idMesin = 1;
    await wrapper.vm.downloadEvidence();
    
    expect(mockGetEvidencePath).toHaveBeenCalled();
    expect(mockDownloadEvidence).toHaveBeenCalled();
    
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('should handle downloadEvidence error', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    mockGetEvidencePath.mockRejectedValue(new Error('Evidence not found'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.idMesin = 1;
    await wrapper.vm.downloadEvidence();
    
    expect(notifyError).toHaveBeenCalledWith('Evidence Tidak Ada', 5000);
  });

  it('should fetch asumsi parameter successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchAsumsiParameter();
    
    expect(mockGetAsumsiParameter).toHaveBeenCalled();
    expect(wrapper.vm.asumsiParameter.interest_rate).toBe(5.5);
  });

  it('should handle fetchAsumsiParameter error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetAsumsiParameter.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchAsumsiParameter();
    
    expect(wrapper.vm.asumsiParameter.isFetchingError).toBe(true);
    expect(wrapper.vm.parameterTeknisFinansial.isFetchingError).toBe(true);
    
    consoleErrorSpy.mockRestore();
  });

  it('should reload asumsi parameter', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    
    // Call reload function
    await wrapper.vm.reloadAsumsiParameter();
    
    // Check that fetch was called
    expect(mockGetAsumsiParameter).toHaveBeenCalled();
  });

  it('should fetch data teknis successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchDataTeknis();
    
    expect(mockGetDataTeknis).toHaveBeenCalled();
  });

  it('should handle fetchDataTeknis error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetDataTeknis.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchDataTeknis();
    
    expect(wrapper.vm.dataTeknis.isFetchingError).toBe(true);
    
    consoleErrorSpy.mockRestore();
  });

  it('should reload data teknis', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    
    await wrapper.vm.reloadDataTeknis();
    
    expect(mockGetDataTeknis).toHaveBeenCalled();
  });

  it('should fetch status persetujuan successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchStatusPersetujuan();
    
    expect(mockGetRealisasiProyeksiMesin).toHaveBeenCalled();
    expect(wrapper.vm.statusPersetujuan).toBe('Disetujui');
  });

  it('should handle fetchStatusPersetujuan error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetRealisasiProyeksiMesin.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchStatusPersetujuan();
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should fetch data finansial successfully and map correctly', async () => {
    const mockDataFinansialWithLevels = {
      data: {
        header: [],
        tahun: [],
        detail: [
          { level: 1, name: 'Level 1 Item' },
          { level: 2, name: 'Level 2 Item' },
          { level: 3, name: 'Level 3 Item' },
          { level: 4, name: 'Level 4 Item' }
        ]
      }
    };
    mockGetDataFinansial.mockResolvedValue(mockDataFinansialWithLevels);
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchDataFinansial();
    
    expect(mockGetDataFinansial).toHaveBeenCalled();
    expect(wrapper.vm.finansialMappingResult.length).toBeGreaterThan(0);
  });

  it('should handle fetchDataFinansial error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetDataFinansial.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchDataFinansial();
    
    expect(wrapper.vm.dataFinansial.isFetchingError).toBe(true);
    
    consoleErrorSpy.mockRestore();
  });

  it('should reload data finansial', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    
    await wrapper.vm.reloadDataFinansial();
    
    expect(mockGetDataFinansial).toHaveBeenCalled();
  });

  it('should fetch hasil simulasi successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchHasilSimulasi();
    
    expect(mockGetHasilSimulasi).toHaveBeenCalled();
    expect(wrapper.vm.hasilSimulasi.track_irr_project).toBe(10);
  });

  it('should handle fetchHasilSimulasi error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetHasilSimulasi.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.fetchHasilSimulasi();
    
    expect(wrapper.vm.hasilSimulasi.isFetchingError).toBe(true);
    
    consoleErrorSpy.mockRestore();
  });

  it('should reload hasil simulasi', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    
    await wrapper.vm.reloadHasilSimulasi();
    
    expect(mockGetHasilSimulasi).toHaveBeenCalled();
  });

  it('should fetch combo bahan bakar successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.kodeJenisPembangkit = 'PLTU';
    await wrapper.vm.fetchComboBahanBakar();
    
    expect(mockGetComboBahanBakar).toHaveBeenCalledWith('PLTU');
  });

  it('should handle fetchComboBahanBakar error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetComboBahanBakar.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.kodeJenisPembangkit = 'PLTU';
    await wrapper.vm.fetchComboBahanBakar();
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should download excel mesin successfully', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockDownloadExcelKK.mockResolvedValue({
      data: mockBlob,
      headers: {
        'content-disposition': 'attachment; filename="report.xlsx"'
      }
    });

    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    wrapper.vm.currentNamaMesin = 'Test Mesin';
    await wrapper.vm.handleDownloadExcelMesin();
    
    expect(mockDownloadExcelKK).toHaveBeenCalled();
    
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('should handle handleDownloadExcelMesin error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockDownloadExcelKK.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    wrapper.vm.idMesin = 1;
    wrapper.vm.selectedYear = '2024';
    await wrapper.vm.handleDownloadExcelMesin();
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should fetch tahun realisasi successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockGetTahunRealisasi).toHaveBeenCalled();
  });

  it('should handle fetchTahunRealisasiData error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetTahunRealisasi.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should fetch list tahun asumsi successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockGetListTahunAsumsi).toHaveBeenCalled();
  });

  it('should handle fetchListTahunAsumsi error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetListTahunAsumsi.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should fetch unit pengelola successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockGetPembangkitByKode).toHaveBeenCalled();
    expect(mockGetPengelolaData).toHaveBeenCalled();
    expect(mockGetPembina).toHaveBeenCalled();
  });

  it('should handle fetchUnitPengelola error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetPembangkitByKode.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should fetch type periodic successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockGetTypePeriodic).toHaveBeenCalled();
  });

  it('should handle fetchTypePeriodic error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetTypePeriodic.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle year change successfully', async () => {
    const router = await import('@/router');
    const routerReplaceSpy = vi.spyOn(router.default, 'replace');
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    wrapper.vm.selectedYear = '2025';
    wrapper.vm.idMesin = 1;
    
    await wrapper.vm.handleYearChange();
    
    expect(routerReplaceSpy).toHaveBeenCalled();
    expect(mockGetMesinById).toHaveBeenCalled();
  });

  it('should handle different approval statuses', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test Disetujui status (from mock)
    expect(wrapper.vm.statusPersetujuan).toBe('Disetujui');
  });

  it('should handle tab selection', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    expect(wrapper.vm.selectedTab).toBe('Akhir Masa');
    
    wrapper.vm.selectedTab = 'Tahun Berjalan';
    await nextTick();
    
    expect(wrapper.vm.selectedTab).toBe('Tahun Berjalan');
  });

  it('should fetch list pembina successfully', async () => {
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    const result = await wrapper.vm.fetchListPembina();
    
    expect(mockGetPembina).toHaveBeenCalledWith('');
    expect(result).toEqual([
      { uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }
    ]);
  });

  it('should handle fetchListPembina error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetPembina.mockRejectedValue(new Error('Network error'));
    
    wrapper = mount(DetailRekap, defaultMountOptions);
    
    await nextTick();
    
    await wrapper.vm.fetchListPembina();
    
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});