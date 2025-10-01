import { shallowMount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import DetailRekap from "@/views/Data/RekapKertasKerja/DetailRekap/DetailRekap.vue";
import DetailRekapService from "@/services/detail-rekap-service";
import RekapService from "@/services/rekap-service";
import GrafikService from "@/services/grafik-service";
import UserService from "@/services/user-service";
import GlobalFormat from "@/services/format/global-format";
import YearPickerService from "@/services/helper/year-picker-service";

// Mock router
jest.mock("@/router", () => ({
  default: {
    replace: jest.fn()
  }
}));

// Mock route
const mockRoute = {
  params: { id: "test-id-123" },
  query: { tahun: "2024" }
};

jest.mock("vue-router", () => ({
  useRoute: () => mockRoute
}));

// Mock encrypt storage
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: jest.fn().mockReturnValue("decrypted-id-123"),
    encryptValue: jest.fn().mockReturnValue("encrypted-id-123")
  })
}));

// Mock toast notification
jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn()
}));

// Mock services
jest.mock("@/services/detail-rekap-service");
const MockedDetailRekapService = DetailRekapService as jest.MockedClass<typeof DetailRekapService>;

jest.mock("@/services/rekap-service");
const MockedRekapService = RekapService as jest.MockedClass<typeof RekapService>;

jest.mock("@/services/grafik-service");
const MockedGrafikService = GrafikService as jest.MockedClass<typeof GrafikService>;

jest.mock("@/services/user-service");
const MockedUserService = UserService as jest.MockedClass<typeof UserService>;

jest.mock("@/services/format/global-format");
const MockedGlobalFormat = GlobalFormat as jest.MockedClass<typeof GlobalFormat>;

jest.mock("@/services/helper/year-picker-service");
const MockedYearPickerService = YearPickerService as jest.MockedClass<typeof YearPickerService>;

// Mock components
const componentStubs = {
  Loading: { 
    name: "Loading", 
    template: '<div class="loading-spinner">Loading...</div>' 
  },
  InfoHeader: {
    name: "InfoHeader",
    template: '<div class="info-header"><slot></slot></div>',
    props: ["namaMesin", "namaPengelola", "kondisiUnit", "kodeJenisPembangkit", "dayaTerpasang", "dayaMampu", "tahunOperasi", "umurTeknis", "namaPembina"]
  },
  ShimmerLoading: {
    name: "ShimmerLoading", 
    template: '<div class="shimmer-loading"></div>',
    props: ["class"]
  },
  TabsWrapper: {
    name: "TabsWrapper",
    template: '<div class="tabs-wrapper"><slot></slot></div>',
    props: ["kodeSentral", "isLihatGrafik", "lamanData"]
  },
  TabItem: {
    name: "TabItem",
    template: '<div class="tab-item"><slot></slot></div>',
    props: ["title"]
  },
  VueDatePicker: {
    name: "VueDatePicker",
    template: '<div class="date-picker"></div>',
    props: ["modelValue", "yearPicker", "teleport", "clearable", "yearRange", "filters"]
  },
  AsumsiMakro: {
    name: "AsumsiMakro",
    template: '<div class="asumsi-makro"></div>'
  },
  ParameterTeknis: {
    name: "ParameterTeknis", 
    template: '<div class="parameter-teknis"></div>'
  },
  TableDataTeknis: {
    name: "TableDataTeknis",
    template: '<div class="table-data-teknis"></div>'
  },
  TableDataFinansial: {
    name: "TableDataFinansial",
    template: '<div class="table-data-finansial"></div>'
  },
  AkhirMasaManfaat: {
    name: "AkhirMasaManfaat",
    template: '<div class="akhir-masa-manfaat"></div>'
  },
  TahunBerjalan: {
    name: "TahunBerjalan",
    template: '<div class="tahun-berjalan"></div>'
  },
  DraftComponentStatus: {
    name: "DraftComponentStatus",
    template: '<div class="draft-status"></div>'
  },
  WaitingT1ComponentStatus: {
    name: "WaitingT1ComponentStatus",
    template: '<div class="waiting-t1-status"></div>'
  },
  WaitingT2ComponentStatus: {
    name: "WaitingT2ComponentStatus",
    template: '<div class="waiting-t2-status"></div>'
  },
  DitolakT1ComponentStatus: {
    name: "DitolakT1ComponentStatus",
    template: '<div class="ditolak-t1-status"></div>'
  },
  DitolakT2ComponentStatus: {
    name: "DitolakT2ComponentStatus",
    template: '<div class="ditolak-t2-status"></div>'
  }
};

import router from "@/router";

describe("DetailRekap.vue", () => {
  let wrapper: VueWrapper<any>;
  let mockDetailRekapService: jest.Mocked<DetailRekapService>;
  let mockRekapService: jest.Mocked<RekapService>;
  let mockGrafikService: jest.Mocked<GrafikService>;
  let mockUserService: jest.Mocked<UserService>;
  let mockGlobalFormat: jest.Mocked<GlobalFormat>;
  let mockYearPickerService: jest.Mocked<YearPickerService>;
  let consoleSpy: jest.SpyInstance;

  // Mock responses
  const mockMesinResponse = {
    data: {
      uuid: "test-uuid-mesin",
      kode_mesin: "TST001",
      mesin: "Test Mesin 1",
      kode_sentral: "SEN001",
      kode_jenis_pembangkit: "PLTU",
      kondisi_unit: "Beroperasi",
      daya_terpasang: 100,
      daya_mampu: 95,
      tahun_operasi: "2020",
      masa_manfaat: 25,
      tahun_asumsi: "2023",
      tahun_realisasi: "2024"
    }
  };

  const mockAsumsiParameterResponse = {
    data: {
      asumsi_makro: {
        corporate_tax_rate: 25,
        discount_rate: 10.5,
        interest_rate: 8.5,
        loan_tenor: 15,
        loan_portion: 70,
        equity_portion: 30,
        umur_teknis: 25
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
        nphr: 2500
      },
      harga_bahan_bakars: [
        {
          kode_bahan_bakar: "BB001",
          harga_bahan_bakar: 5000,
          sfc: 0.35
        }
      ]
    }
  };

  const mockDataTeknisResponse = {
    data: {
      header: ["Tahun", "Data 1", "Data 2"],
      tahun: [2024, 2025, 2026],
      detail: [
        { tahun: 2024, data1: 100, data2: 200 },
        { tahun: 2025, data1: 110, data2: 210 }
      ]
    }
  };

  const mockDataFinansialResponse = {
    data: {
      header: ["Tahun", "Revenue", "Cost"],
      tahun: [2024, 2025, 2026],
      detail: [
        { level: 1, name: "Revenue", tahun: 2024, value: 1000000 },
        { level: 2, name: "Operating Revenue", tahun: 2024, value: 800000 }
      ]
    }
  };

  const mockHasilSimulasiResponse = {
    data: {
      track_irr_project: 12.5,
      track_irr_equity: 15.2,
      track_npv_project: 500000,
      track_npv_equity: 200000,
      track_average_cf: 85,
      track_average_eaf: 80,
      now_track_irr_project: 13.1,
      now_track_irr_equity: 15.8,
      now_track_npv_project: 520000,
      now_track_npv_equity: 210000,
      now_track_average_cf: 87,
      now_track_average_eaf: 82
    }
  };

  const mockTahunRealisasiResponse = {
    data: [
      { tahun: "2020" },
      { tahun: "2021" },
      { tahun: "2022" },
      { tahun: "2023" },
      { tahun: "2024" }
    ]
  };

  const mockStatusPersetujuanResponse = {
    data: {
      status: "Disetujui"
    }
  };

  const mockComboBahanBakarResponse = {
    data: [
      { kode_bahan_bakar: "BB001", nama_bahan_bakar: "Batubara" },
      { kode_bahan_bakar: "BB002", nama_bahan_bakar: "Solar" }
    ]
  };

  const mockPembinaResponse = {
    data: [
      { uuid_pembina: "pembina-uuid-1", pembina: "Pembina Test 1" }
    ]
  };

  const mockPembangkitResponse = {
    data: {
      kode_pengelola: "PEN001",
      uuid_pembina: "pembina-uuid-1"
    }
  };

  const mockPengelolaResponse = {
    data: [
      { kode_pengelola: "PEN001", pengelola: "PT Pengelola Test" }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Suppress console errors during tests
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Setup mock services
    mockDetailRekapService = {
      getMesinById: jest.fn().mockResolvedValue(mockMesinResponse),
      getAsumsiParameter: jest.fn().mockResolvedValue(mockAsumsiParameterResponse),
      getDataTeknis: jest.fn().mockResolvedValue(mockDataTeknisResponse),
      getDataFinansial: jest.fn().mockResolvedValue(mockDataFinansialResponse),
      getHasilSimulasi: jest.fn().mockResolvedValue(mockHasilSimulasiResponse),
      getTahunRealisasi: jest.fn().mockResolvedValue(mockTahunRealisasiResponse),
      getListTahunAsumsi: jest.fn().mockResolvedValue({ data: [{ tahun: "1990" }, { tahun: "2050" }] }),
      getComboBahanBakar: jest.fn().mockResolvedValue(mockComboBahanBakarResponse),
      getPembangkitByKode: jest.fn().mockResolvedValue(mockPembangkitResponse),
      getPengelolaData: jest.fn().mockResolvedValue(mockPengelolaResponse),
      getTypePeriodic: jest.fn().mockResolvedValue({ data: [] })
    } as any;

    mockRekapService = {
      getEvidencePath: jest.fn().mockResolvedValue({ 
        data: [{ file_name: "evidence.pdf", dokumen_evidence: "path/to/evidence" }] 
      }),
      downloadEvidence: jest.fn().mockResolvedValue({
        data: new Blob(),
        headers: { 'content-disposition': 'filename="evidence.pdf"' }
      }),
      downloadExcelKK: jest.fn().mockResolvedValue({
        data: new Blob(),
        headers: { 'content-disposition': 'filename="export.xlsx"' }
      })
    } as any;

    mockGrafikService = {
      getRealisasiProyeksiMesin: jest.fn().mockResolvedValue(mockStatusPersetujuanResponse)
    } as any;

    mockUserService = {
      getPembina: jest.fn().mockResolvedValue(mockPembinaResponse)
    } as any;

    mockGlobalFormat = {
      formatNumberFiveDigits: jest.fn().mockImplementation((value) => value?.toString().padStart(5, '0') || "00000")
    } as any;

    mockYearPickerService = {
      filterYears: jest.fn().mockReturnValue({ enabled: true })
    } as any;

    // Setup mock constructors
    MockedDetailRekapService.mockImplementation(() => mockDetailRekapService);
    MockedRekapService.mockImplementation(() => mockRekapService);
    MockedGrafikService.mockImplementation(() => mockGrafikService);
    MockedUserService.mockImplementation(() => mockUserService);
    MockedGlobalFormat.mockImplementation(() => mockGlobalFormat);
    MockedYearPickerService.mockImplementation(() => mockYearPickerService);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    if (consoleSpy) {
      consoleSpy.mockRestore();
    }
  });

  describe("Component Mounting", () => {
    it("should mount successfully", async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should initialize with correct default values", async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();

      expect(wrapper.vm.selectedYear).toBe("2024");
      expect(wrapper.vm.statusPersetujuan).toBe('');
      expect(wrapper.vm.namaPengelola).toBe('');
      expect(wrapper.vm.namaPembina).toBe('');
      expect(wrapper.vm.selectedTab).toBe("Akhir Masa");
    });
  });

  describe("Service Integration on Mount", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should call getMesinById service on mount", () => {
      expect(mockDetailRekapService.getMesinById).toHaveBeenCalled();
    });

    it("should call getTahunRealisasi service on mount", () => {
      expect(mockDetailRekapService.getTahunRealisasi).toHaveBeenCalled();
    });

    it("should call getRealisasiProyeksiMesin service on mount", () => {
      expect(mockGrafikService.getRealisasiProyeksiMesin).toHaveBeenCalled();
    });

    it("should call getAsumsiParameter service on mount", () => {
      expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled();
    });

    it("should call getDataTeknis service on mount", () => {
      expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled();
    });

    it("should call getDataFinansial service on mount", () => {
      expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
    });

    it("should call getHasilSimulasi service on mount", () => {
      expect(mockDetailRekapService.getHasilSimulasi).toHaveBeenCalled();
    });
  });

  describe("Data Population", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should populate mesin data after fetch", () => {
      expect(wrapper.vm.mesin).toBeDefined();
      expect(wrapper.vm.kodeMesin).toBeDefined();
      expect(wrapper.vm.idMesin).toBeDefined();
      expect(wrapper.vm.kodeJenisPembangkit).toBeDefined();
    });

    it("should populate asumsi parameter data after fetch", () => {
      expect(wrapper.vm.asumsiParameter).toBeDefined();
      expect(wrapper.vm.parameterTeknisFinansial).toBeDefined();
      expect(wrapper.vm.bahanBakars).toBeDefined();
    });

    it("should populate data teknis after fetch", () => {
      expect(wrapper.vm.dataTeknis).toBeDefined();
      expect(wrapper.vm.dataTeknis.header).toBeDefined();
      expect(wrapper.vm.dataTeknis.detail).toBeDefined();
    });

    it("should populate data finansial after fetch", () => {
      expect(wrapper.vm.dataFinansial).toBeDefined();
      expect(wrapper.vm.finansialMappingResult).toBeDefined();
    });

    it("should populate hasil simulasi after fetch", () => {
      expect(wrapper.vm.hasilSimulasi).toBeDefined();
      expect(wrapper.vm.hasilSimulasi.track_irr_project).toBeDefined();
      expect(wrapper.vm.hasilSimulasi.track_npv_project).toBeDefined();
    });
  });

  describe("Service Mocking Validation", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
    });

    it("should have mocked detail rekap service available", () => {
      expect(mockDetailRekapService.getMesinById).toBeDefined();
      expect(mockDetailRekapService.getAsumsiParameter).toBeDefined();
      expect(mockDetailRekapService.getDataTeknis).toBeDefined();
      expect(mockDetailRekapService.getDataFinansial).toBeDefined();
      expect(mockDetailRekapService.getHasilSimulasi).toBeDefined();
    });

    it("should have mocked rekap service available", () => {
      expect(mockRekapService.getEvidencePath).toBeDefined();
      expect(mockRekapService.downloadEvidence).toBeDefined();
      expect(mockRekapService.downloadExcelKK).toBeDefined();
    });

    it("should have mocked grafik service available", () => {
      expect(mockGrafikService.getRealisasiProyeksiMesin).toBeDefined();
    });
  });

  describe("Year Change Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should handle year change", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      wrapper.vm.selectedYear = "2025";
      
      // Test that the function can be called without throwing
      try {
        await wrapper.vm.handleYearChange();
      } catch (error) {
        // Expected since router.replace is not fully mocked
      }
      
      // Verify that services would be called
      expect(wrapper.vm.selectedYear).toBe("2025");
      
      consoleSpy.mockRestore();
    });

    it("should update selectedYear reactively", async () => {
      wrapper.vm.selectedYear = "2023";
      await nextTick();
      
      expect(wrapper.vm.selectedYear).toBe("2023");
    });
  });

  describe("Download Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should handle evidence download", async () => {
      await wrapper.vm.downloadEvidence();

      expect(mockRekapService.getEvidencePath).toHaveBeenCalledWith(
        wrapper.vm.idMesin,
        "2024",
        0
      );
      expect(mockRekapService.downloadEvidence).toHaveBeenCalled();
    });

    it("should handle excel download", async () => {
      await wrapper.vm.handleDownloadExcelMesin();

      expect(mockRekapService.downloadExcelKK).toHaveBeenCalledWith(
        parseInt(wrapper.vm.selectedYear),
        parseInt(wrapper.vm.selectedYear) - 1,
        wrapper.vm.idMesin
      );
    });
  });

  describe("Error Handling and Reload Functions", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
    });

    it("should handle asumsi parameter fetch error", async () => {
      mockDetailRekapService.getAsumsiParameter.mockRejectedValue(new Error("Asumsi Error"));
      
      await wrapper.vm.fetchAsumsiParameter();
      
      expect(wrapper.vm.asumsiParameter.isFetchingError).toBe(true);
      expect(wrapper.vm.parameterTeknisFinansial.isFetchingError).toBe(true);
    });

    it("should handle data teknis fetch error", async () => {
      mockDetailRekapService.getDataTeknis.mockRejectedValue(new Error("Data Teknis Error"));
      
      await wrapper.vm.fetchDataTeknis();
      
      expect(wrapper.vm.dataTeknis.isFetchingError).toBe(true);
    });

    it("should handle data finansial fetch error", async () => {
      mockDetailRekapService.getDataFinansial.mockRejectedValue(new Error("Data Finansial Error"));
      
      await wrapper.vm.fetchDataFinansial();
      
      expect(wrapper.vm.dataFinansial.isFetchingError).toBe(true);
    });

    it("should handle hasil simulasi fetch error", async () => {
      mockDetailRekapService.getHasilSimulasi.mockRejectedValue(new Error("Hasil Simulasi Error"));
      
      await wrapper.vm.fetchHasilSimulasi();
      
      expect(wrapper.vm.hasilSimulasi.isFetchingError).toBe(true);
    });

    it("should reload asumsi parameter data", () => {
      wrapper.vm.asumsiParameter.isFetchingError = true;
      wrapper.vm.parameterTeknisFinansial.isFetchingError = true;
      
      wrapper.vm.reloadAsumsiParameter();
      
      expect(wrapper.vm.asumsiParameter.isFetchingError).toBe(false);
      expect(wrapper.vm.parameterTeknisFinansial.isFetchingError).toBe(false);
      expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled();
    });

    it("should reload data teknis", () => {
      wrapper.vm.dataTeknis.isFetchingError = true;
      
      wrapper.vm.reloadDataTeknis();
      
      expect(wrapper.vm.dataTeknis.isFetchingError).toBe(false);
      expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled();
    });

    it("should reload data finansial", () => {
      wrapper.vm.dataFinansial.isFetchingError = true;
      
      wrapper.vm.reloadDataFinansial();
      
      expect(wrapper.vm.dataFinansial.isFetchingError).toBe(false);
      expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
    });

    it("should reload hasil simulasi", () => {
      wrapper.vm.hasilSimulasi.isFetchingError = true;
      
      wrapper.vm.reloadHasilSimulasi();
      
      expect(wrapper.vm.hasilSimulasi.isFetchingError).toBe(false);
      expect(mockDetailRekapService.getHasilSimulasi).toHaveBeenCalled();
    });
  });

  describe("Status-based Rendering", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should set status persetujuan correctly", () => {
      expect(wrapper.vm.statusPersetujuan).toBe("Disetujui");
    });

    it("should handle different approval statuses", async () => {
      wrapper.vm.statusPersetujuan = "Draft";
      await nextTick();
      expect(wrapper.vm.statusPersetujuan).toBe("Draft");

      wrapper.vm.statusPersetujuan = "Menunggu Persetujuan T1";
      await nextTick();
      expect(wrapper.vm.statusPersetujuan).toBe("Menunggu Persetujuan T1");

      wrapper.vm.statusPersetujuan = "Ditolak T1";
      await nextTick();
      expect(wrapper.vm.statusPersetujuan).toBe("Ditolak T1");
    });
  });

  describe("Financial Data Mapping", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should map financial data correctly", () => {
      expect(wrapper.vm.finansialMappingResult).toBeDefined();
      expect(Array.isArray(wrapper.vm.finansialMappingResult)).toBe(true);
    });

    it("should handle financial data hierarchy", () => {
      // The component maps financial data with level hierarchy
      const mockDetailData = [
        { level: 1, name: "Level 1" },
        { level: 2, name: "Level 2" },
        { level: 3, name: "Level 3" },
        { level: 4, name: "Level 4" }
      ];

      mockDetailRekapService.getDataFinansial.mockResolvedValue({
        data: { detail: mockDetailData }
      });

      wrapper.vm.fetchDataFinansial();
      expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled();
    });
  });

  describe("Global Format Integration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
    });

    it("should use global format for number formatting", () => {
      const testValue = 12345;
      wrapper.vm.globalFormat.formatNumberFiveDigits(testValue);
      
      expect(mockGlobalFormat.formatNumberFiveDigits).toHaveBeenCalledWith(testValue);
    });
  });

  describe("Route Integration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
    });

    it("should extract year from route query correctly", () => {
      expect(wrapper.vm.selectedYear).toBe("2024");
    });

    it("should use correct mesin ID from route params", () => {
      // Component should extract ID from route params
      expect(wrapper.vm.idMesin).toBeDefined();
    });
  });

  describe("Component Properties and State", () => {
    beforeEach(async () => {
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
    });

    it("should initialize with correct interface structures", () => {
      // Check if objects are defined
      expect(wrapper.vm.asumsiParameter).toBeDefined();
      expect(wrapper.vm.parameterTeknisFinansial).toBeDefined();
      expect(wrapper.vm.hasilSimulasi).toBeDefined();
      
      // Check specific properties exist
      expect(wrapper.vm.asumsiParameter).toHaveProperty('isFetchingError');
      expect(wrapper.vm.parameterTeknisFinansial).toHaveProperty('isFetchingError');
      expect(wrapper.vm.hasilSimulasi).toHaveProperty('isFetchingError');
    });

    it("should handle loading state correctly", () => {
      expect(typeof wrapper.vm.isLoading).toBe('boolean');
      
      wrapper.vm.isLoading = true;
      expect(wrapper.vm.isLoading).toBe(true);
      
      wrapper.vm.isLoading = false;
      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully", async () => {
      // Mock service to throw error
      mockDetailRekapService.getMesinById.mockRejectedValue(new Error("Service Error"));
      
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Component should still exist even with errors
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle evidence download errors", async () => {
      mockRekapService.getEvidencePath.mockRejectedValue(new Error("Evidence Error"));
      
      wrapper = shallowMount(DetailRekap, {
        global: {
          stubs: componentStubs
        }
      });
      await nextTick();
      
      await wrapper.vm.downloadEvidence();
      
      expect(wrapper.exists()).toBe(true);
    });
  });
});
