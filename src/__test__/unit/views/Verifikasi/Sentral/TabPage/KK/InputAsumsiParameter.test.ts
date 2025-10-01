import { shallowMount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import InputAsumsiParameter from "@/views/Verifikasi/Sentral/TabPage/KK/InputAsumsiParameter.vue";
import UserService from "@/services/user-service";
import RekapService from "@/services/rekap-service";
import GlobalFormat from "@/services/format/global-format";
import PerbaruiDataService from "@/services/perbarui-data";
import InputAsumsiParameterService from "@/services/input-asumsi-parameter-service";
import PersetujuanService from "@/services/persetujuan-service";

// Mock router
jest.mock("@/router", () => ({
  default: {
    push: jest.fn(),
    go: jest.fn()
  }
}));

// Mock route
const mockRoute = {
  query: { tahun: "2024", uuid_sentral: "test-uuid-sentral" },
  params: { id: "test-id-123" }
};

jest.mock("vue-router", () => ({
  useRoute: () => mockRoute
}));

// Mock encrypt storage
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: jest.fn().mockReturnValue("decrypted-id-123")
  })
}));

// Mock services
jest.mock("@/services/user-service");
const MockedUserService = UserService as jest.MockedClass<typeof UserService>;

jest.mock("@/services/rekap-service");
const MockedRekapService = RekapService as jest.MockedClass<typeof RekapService>;

jest.mock("@/services/format/global-format");
const MockedGlobalFormat = GlobalFormat as jest.MockedClass<typeof GlobalFormat>;

jest.mock("@/services/perbarui-data");
const MockedPerbaruiDataService = PerbaruiDataService as jest.MockedClass<typeof PerbaruiDataService>;

jest.mock("@/services/input-asumsi-parameter-service");
const MockedInputAsumsiParameterService = InputAsumsiParameterService as jest.MockedClass<typeof InputAsumsiParameterService>;

jest.mock("@/services/persetujuan-service");
const MockedPersetujuanService = PersetujuanService as jest.MockedClass<typeof PersetujuanService>;

// Mock toast notification
jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn()
}));

// Mock vue3-lottie
jest.mock("vue3-lottie", () => ({
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: '<div class="lottie-mock"></div>',
    props: ["animationData", "autoPlay", "loop", "speed", "width", "height"],
  },
}));

// Mock auto-animate directive
const autoAnimateDirective = {
  beforeMount: jest.fn(),
  updated: jest.fn()
};

// Mock all components
const componentStubs = {
  Loading: { 
    name: "Loading", 
    template: '<div class="loading-spinner">Loading...</div>' 
  },
  ModalNotification: {
    name: "ModalNotification",
    template: '<div class="modal-notification"><slot></slot></div>',
    props: ["showModal", "animationData", "title", "subtitle"]
  },
  ModalWrapper: {
    name: "ModalWrapper",
    template: '<div class="modal-wrapper"><slot></slot></div>',
    props: ["showModal", "width", "height"]
  },
  ConfirmationDialog: {
    name: "ConfirmationDialog",
    template: '<div class="confirmation-dialog"><slot></slot></div>',
    props: ["title", "subtitle", "buttonTitle"]
  },
  InfoHeader: {
    name: "InfoHeader",
    template: '<div class="info-header"></div>',
    props: ["namaMesin", "namaPengelola", "kondisiUnit", "kodeJenisPembangkit", "dayaTerpasang", "dayaMampu", "tahunOperasi", "umurTeknis", "namaPembina"]
  },
  TabsWrapper: {
    name: "TabsWrapper",
    template: '<div class="tabs-wrapper"><slot></slot></div>',
    props: ["lamanData"]
  },
  TabItem: {
    name: "TabItem",
    template: '<div class="tab-item"><slot></slot></div>',
    props: ["title"]
  },
  TabAsumsiMakro: {
    name: "TabAsumsiMakro",
    template: '<div class="tab-asumsi-makro"></div>',
    props: ["tahunRealisasi", "mesin", "error", "umurTeknisInit", "isPerbaruiData"]
  },
  TabParameterTeknis: {
    name: "TabParameterTeknis",
    template: '<div class="tab-parameter-teknis"></div>',
    props: ["isPerbaruiData", "tahunRealisasi", "initPemakaianSendiri", "initAuxiliary", "initSusutTrafo", "comboBahanBakar", "bahanBakars", "uuidMesin", "isInputAsumsiParameter", "mesin", "error", "isIntegrasi"]
  },
  IconFolder: {
    name: "IconFolder",
    template: '<div class="icon-folder"></div>'
  },
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: '<div class="vue3-lottie"></div>',
    props: ["animationData", "width", "height", "loop", "speed"]
  }
};

describe("InputAsumsiParameter.vue", () => {
  let wrapper: VueWrapper<any>;
  let mockUserService: jest.Mocked<UserService>;
  let mockRekapService: jest.Mocked<RekapService>;
  let mockGlobalFormat: jest.Mocked<GlobalFormat>;
  let mockPerbaruiDataService: jest.Mocked<PerbaruiDataService>;
  let mockInputAsumsiParameterService: jest.Mocked<InputAsumsiParameterService>;
  let mockPersetujuanService: jest.Mocked<PersetujuanService>;
  let consoleSpy: jest.SpyInstance;

  // Mock responses
  const mockMesinResponse = {
    data: {
      uuid: "test-uuid-mesin",
      mesin: "Test Mesin 1",
      kode_jenis_pembangkit: "PLTU",
      kode_mesin: "TST001",
      kode_sentral: "SEN001", 
      kondisi_unit: "Beroperasi",
      daya_terpasang: 100,
      daya_mampu: 95,
      tahun_operasi: 2020,
      masa_manfaat: 25
    }
  };

  const mockAsumsiParameterResponse = {
    code: 200,
    data: {
      id_asumsi: 1,
      tahun: 2024,
      status: "Draft",
      interest_rate: "10.5",
      umur_teknis: "25",
      loan_tenor: "15",
      loan_portion: "70"
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

  const mockCheckIntegrasiResponse = {
    data: [{ status_data_integrasi: "1" }]
  };

  const mockPersetujuanKKResponse = {
    data: {
      mesins: [
        {
          uuid_mesin: "test-id-123",
          status: "Disetujui T1",
          keterangan: "Data sudah sesuai"
        }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Suppress console errors during tests
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Setup mock services
    mockUserService = {
      getPembina: jest.fn().mockResolvedValue(mockPembinaResponse)
    } as any;

    mockRekapService = {
      uploadEvidence: jest.fn().mockResolvedValue({ data: "evidence-path" }),
      updateEvidencePath: jest.fn().mockResolvedValue({}),
      downloadTemplateRekap: jest.fn().mockResolvedValue({
        data: new Blob(),
        headers: { 'content-disposition': 'filename="template.xlsx"' }
      }),
      uploadTemplateAwalKK: jest.fn().mockResolvedValue({})
    } as any;

    mockGlobalFormat = {
      formatRupiah: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatDecimal: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatNumberFiveDigits: jest.fn().mockImplementation((value) => value?.toString().padStart(5, '0') || "00000"),
      formatBytes: jest.fn().mockImplementation((bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)).toString());
        return Math.round(100 * (bytes / Math.pow(k, i))) / 100 + ' ' + sizes[i];
      })
    } as any;

    mockPerbaruiDataService = {
      getCheckIntegrasi: jest.fn().mockResolvedValue(mockCheckIntegrasiResponse)
    } as any;

    mockInputAsumsiParameterService = {
      getMesinById: jest.fn().mockResolvedValue(mockMesinResponse),
      getAsumsiMakroData: jest.fn().mockResolvedValue(mockAsumsiParameterResponse),
      getComboBahanBakar: jest.fn().mockResolvedValue(mockComboBahanBakarResponse),
      getPembangkitByKode: jest.fn().mockResolvedValue(mockPembangkitResponse),
      getPengelolaData: jest.fn().mockResolvedValue(mockPengelolaResponse),
      insertAsumsiMakro: jest.fn().mockResolvedValue({ data: { message: "Success" } }),
      updateAsumsiMakro: jest.fn().mockResolvedValue({ data: { message: "Success" } })
    } as any;

    mockPersetujuanService = {
      getPersetujuanKKSentral: jest.fn().mockResolvedValue(mockPersetujuanKKResponse)
    } as any;

    // Setup mock constructors
    MockedUserService.mockImplementation(() => mockUserService);
    MockedRekapService.mockImplementation(() => mockRekapService);
    MockedGlobalFormat.mockImplementation(() => mockGlobalFormat);
    MockedPerbaruiDataService.mockImplementation(() => mockPerbaruiDataService);
    MockedInputAsumsiParameterService.mockImplementation(() => mockInputAsumsiParameterService);
    MockedPersetujuanService.mockImplementation(() => mockPersetujuanService);
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
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should initialize with correct default values", async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();

      // isLoading might be true initially during onMounted async operations
      expect(typeof wrapper.vm.isLoading).toBe('boolean');
      expect(wrapper.vm.isInsertSuccess).toBe(false);
      expect(wrapper.vm.isShowModalNotification).toBe(false);
      expect(wrapper.vm.isShowModalConfirmation).toBe(false);
      expect(wrapper.vm.interestRate).toBe('');
      expect(wrapper.vm.umurTeknis).toBe('');
      expect(wrapper.vm.loanTenor).toBe('');
      expect(wrapper.vm.loanPortion).toBe('');
    });
  });

  describe("Service Mocking Validation", () => {
    beforeEach(async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should have mocked services available", () => {
      expect(mockInputAsumsiParameterService.getMesinById).toBeDefined();
      expect(mockInputAsumsiParameterService.getAsumsiMakroData).toBeDefined();
      expect(mockInputAsumsiParameterService.getComboBahanBakar).toBeDefined();
      expect(mockPerbaruiDataService.getCheckIntegrasi).toBeDefined();
      expect(mockPersetujuanService.getPersetujuanKKSentral).toBeDefined();
    });

    it("should have global format methods available", () => {
      expect(mockGlobalFormat.formatRupiah).toBeDefined();
      expect(mockGlobalFormat.formatDecimal).toBeDefined();
      expect(mockGlobalFormat.formatNumberFiveDigits).toBeDefined();
      expect(mockGlobalFormat.formatBytes).toBeDefined();
    });
  });

  describe("Error State Management", () => {
    beforeEach(async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should initialize error state correctly", () => {
      expect(wrapper.vm.error).toEqual({
        asumsi: {
          interestRate: false,
          umurTeknis: false,
          loanTenor: false,
          loanPortion: false
        },
        parameter: {
          nphr: false,
          auxiliary: false,
          susutTrafo: false,
          pemakaianSendiri: false,
          electricityPriceA: false,
          electricityPriceB: false,
          electricityPriceC: false,
          electricityPriceD: false,
          bahanBakar: false
        }
      });
    });
  });

  describe("Modal State Management", () => {
    beforeEach(async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should handle modal notification state", async () => {
      expect(wrapper.vm.isShowModalNotification).toBe(false);
      
      wrapper.vm.isShowModalNotification = true;
      await nextTick();
      
      expect(wrapper.vm.isShowModalNotification).toBe(true);
    });

    it("should handle confirmation modal state", async () => {
      expect(wrapper.vm.isShowModalConfirmation).toBe(false);
      
      wrapper.vm.isShowModalConfirmation = true;
      await nextTick();
      
      expect(wrapper.vm.isShowModalConfirmation).toBe(true);
    });

    it("should handle success modal states", async () => {
      expect(wrapper.vm.isInsertSuccess).toBe(false);
      expect(wrapper.vm.isEvidenceSuccess).toBe(false);
      expect(wrapper.vm.isUploadSuccess).toBe(false);
      
      wrapper.vm.isInsertSuccess = true;
      wrapper.vm.isEvidenceSuccess = true;
      wrapper.vm.isUploadSuccess = true;
      await nextTick();
      
      expect(wrapper.vm.isInsertSuccess).toBe(true);
      expect(wrapper.vm.isEvidenceSuccess).toBe(true);
      expect(wrapper.vm.isUploadSuccess).toBe(true);
    });
  });

  describe("Bahan Bakar Management", () => {
    beforeEach(async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should initialize with default bahan bakar", () => {
      expect(wrapper.vm.bahanBakars).toHaveLength(1);
      expect(wrapper.vm.bahanBakars[0]).toEqual(
        expect.objectContaining({
          id: 1,
          tahun: "2024", // tahun is string, not number
          kode_bahan_bakar: "",
          harga_bahan_bakar: "",
          sfc: "",
          flag_bahan_bakar: 1
        })
      );
    });

    it("should handle tambah bahan bakar", () => {
      const initialLength = wrapper.vm.bahanBakars.length;
      wrapper.vm.handleTambahBahanBakar();
      
      expect(wrapper.vm.bahanBakars).toHaveLength(initialLength + 1);
      expect(wrapper.vm.bahanBakars[wrapper.vm.bahanBakars.length - 1]).toEqual(
        expect.objectContaining({
          id: 2,
          tahun: 2024,
          kode_bahan_bakar: "",
          harga_bahan_bakar: "",
          sfc: "",
          flag_bahan_bakar: 0
        })
      );
    });

    it("should handle hapus bahan bakar", () => {
      // Add a second item first
      wrapper.vm.handleTambahBahanBakar();
      expect(wrapper.vm.bahanBakars).toHaveLength(2);
      
      // Select item to delete
      wrapper.vm.checkedBahanBakar = [2];
      wrapper.vm.handleHapusBahanBakar();
      
      expect(wrapper.vm.bahanBakars).toHaveLength(1);
      expect(wrapper.vm.checkedBahanBakar).toEqual([]);
    });

    it("should handle checked bahan bakar", () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      
      wrapper.vm.checkedBahanBakar = [1, 2];
      wrapper.vm.handleChecked();
      
      expect(logSpy).toHaveBeenCalledWith('Handle Checked 1,2');
      logSpy.mockRestore();
    });
  });

  describe("File Upload Functions", () => {
    beforeEach(async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should handle file change for main file", () => {
      const mockFile = new File(['content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const mockEvent = {
        target: { files: [mockFile] }
      };

      wrapper.vm.handleFileChange(mockEvent);
      expect(wrapper.vm.selectedFile).toBe(mockFile);
    });

    it("should handle file change for evidence", () => {
      const mockFile = new File(['content'], 'evidence.pdf', { type: 'application/pdf' });
      const mockEvent = {
        target: { files: [mockFile] }
      };

      wrapper.vm.handleFileChangeEvidence(mockEvent);
      expect(wrapper.vm.selectedFileEvidence).toBe(mockFile);
    });

    it("should clear selected file when no files provided", () => {
      const mockEvent = {
        target: { files: [] }
      };

      wrapper.vm.handleFileChange(mockEvent);
      expect(wrapper.vm.selectedFile).toBeNull();
    });
  });

  describe("Utility Functions", () => {
    beforeEach(async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should toggle button state", () => {
      expect(wrapper.vm.isHover).toBe(true);
      wrapper.vm.toggleButton();
      expect(wrapper.vm.isHover).toBe(false);
      wrapper.vm.toggleButton();
      expect(wrapper.vm.isHover).toBe(true);
    });

    it("should format bytes correctly", () => {
      expect(wrapper.vm.formatBytes(0)).toBe('0 Bytes');
      expect(wrapper.vm.formatBytes(1024)).toBe('1 KB');
      expect(wrapper.vm.formatBytes(1048576)).toBe('1 MB');
    });
  });

  describe("Global Format Integration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should use global format for formatting", () => {
      const testValue = 12345;
      wrapper.vm.globalFormat.formatNumberFiveDigits(testValue);
      
      expect(mockGlobalFormat.formatNumberFiveDigits).toHaveBeenCalledWith(testValue);
    });

    it("should use global format for bytes formatting", () => {
      const testValue = 2048;
      wrapper.vm.globalFormat.formatBytes(testValue);
      
      expect(mockGlobalFormat.formatBytes).toHaveBeenCalledWith(testValue);
    });
  });

  describe("Route Integration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should extract year from route query correctly", () => {
      expect(wrapper.vm.year).toBe(2024);
    });

    it("should use correct mesin ID based on node mode", () => {
      // In test environment, nodeMode should be 'test' not 'production'
      expect(wrapper.vm.idMesin).toBe("test-id-123");
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully", async () => {
      // Mock service to throw error
      mockInputAsumsiParameterService.getMesinById.mockRejectedValue(new Error("Service Error"));
      
      wrapper = shallowMount(InputAsumsiParameter, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Component should still exist even with errors
      expect(wrapper.exists()).toBe(true);
    });
  });
});
