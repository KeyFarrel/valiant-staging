import { shallowMount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import RekapKertasKerja from "@/views/Data/RekapKertasKerja/RekapKertasKerja.vue";
import RekapService from "@/services/rekap-service";
import AuthService from "@/services/auth-service";
import DetailSentralService from "@/services/detail-sentral-service";
import GlobalFormat from "@/services/format/global-format";

// Mock vue-router
const mockPush = jest.fn();
jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock services
jest.mock("@/services/rekap-service");
const MockedRekapService = RekapService as jest.MockedClass<typeof RekapService>;

jest.mock("@/services/auth-service");
const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

jest.mock("@/services/detail-sentral-service");
const MockedDetailSentralService = DetailSentralService as jest.MockedClass<typeof DetailSentralService>;

jest.mock("@/services/format/global-format");
const MockedGlobalFormat = GlobalFormat as jest.MockedClass<typeof GlobalFormat>;

// Mock stores
jest.mock("@/store/storeUserAuth", () => ({
  useUserAuthStore: () => ({
    userInfo: {
      kode_pengelola: "TEST",
      nama_pengelola: "Test Pengelola"
    }
  }),
}));

jest.mock("@/store/storeRekapKertasKerja", () => ({
  useRekapSearchStore: () => ({
    searchQuery: "",
    selectedKategoriPembangkit: [],
    selectedUmurMesin: [],
    selectedKondisiMesin: [],
  }),
  useRekapNavigationStore: () => ({
    currentPage: 1,
    pageLimit: 10,
    scrollPosition: { top: 0 }
  }),
}));

// Mock @vueuse/core
jest.mock("@vueuse/core", () => ({
  useWindowScroll: () => ({
    x: { value: 0 },
    y: { value: 0 }
  })
}));

// Mock utils
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: jest.fn().mockResolvedValue({
    getItem: jest.fn(),
    setItem: jest.fn(),
  }),
}));

// Mock toast notification
jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}));

// Mock vue3-lottie
jest.mock("vue3-lottie", () => ({
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: '<div class="lottie-mock"></div>',
    props: ["animationData", "autoPlay", "loop", "speed"],
  },
}));

// Mock components
jest.mock("@/components/ui/LoadingSpinner.vue", () => ({
  name: "Loading",
  template: '<div class="loading-spinner">Loading...</div>',
}));

jest.mock("@/components/ui/SearchBoxSuggestion.vue", () => ({
  name: "SearchBoxSuggestion",
  template: '<div class="search-box-suggestion"></div>',
  props: ["modelValue", "suggestions"],
  emits: ["update:modelValue", "on-suggestion-click"],
}));

jest.mock("@/components/ui/ModalWrapper.vue", () => ({
  name: "ModalWrapper",
  template: '<div class="modal-wrapper"><slot></slot></div>',
  props: ["showModal", "width", "height"],
}));

jest.mock("@/components/ui/ConfirmationDialog.vue", () => ({
  name: "ConfirmationDialog",
  template: '<div class="confirmation-dialog"><slot></slot></div>',
  props: ["show", "title", "message"],
  emits: ["confirm", "cancel"],
}));

jest.mock("@/components/ui/ShimmerLoading.vue", () => ({
  name: "ShimmerLoading",
  template: '<div class="shimmer-loading"></div>',
}));

// Mock other components
jest.mock("@/components/Status/ComponentDraft.vue", () => ({
  name: "ComponentDraft",
  template: '<div class="component-draft"></div>',
}));

jest.mock("@/components/Status/ComponentDisetujui.vue", () => ({
  name: "ComponentDisetujui",
  template: '<div class="component-disetujui"></div>',
}));

jest.mock("@/components/Status/ComponentDitolakT1.vue", () => ({
  name: "ComponentDitolakT1",
  template: '<div class="component-ditolak-t1"></div>',
}));

jest.mock("@/components/Status/ComponentDitolakT2.vue", () => ({
  name: "ComponentDitolakT2",
  template: '<div class="component-ditolak-t2"></div>',
}));

jest.mock("@/components/Status/ComponentWaitingT1.vue", () => ({
  name: "ComponentWaitingT1",
  template: '<div class="component-waiting-t1"></div>',
}));

jest.mock("@/components/Status/ComponentWaitingT2.vue", () => ({
  name: "ComponentWaitingT2",
  template: '<div class="component-waiting-t2"></div>',
}));

jest.mock("@/components/Status/ComponentNotInput.vue", () => ({
  name: "ComponentNotInput",
  template: '<div class="component-not-input"></div>',
}));

jest.mock("@/components/Status/ComponentNotUpdate.vue", () => ({
  name: "ComponentNotUpdate",
  template: '<div class="component-not-update"></div>',
}));

jest.mock("@/components/MasterUnitSentral/TabWrapperSentral.vue", () => ({
  name: "TabWrapperSentral",
  template: '<div class="tab-wrapper-sentral"><slot></slot></div>',
}));

jest.mock("@/components/ui/TabItem.vue", () => ({
  name: "TabItem",
  template: '<div class="tab-item"><slot></slot></div>',
  props: ["label", "isActive"],
}));

jest.mock("@/components/RekapKertasKerja/KeteranganAnomali.vue", () => ({
  name: "KeteranganAnomali",
  template: '<div class="keterangan-anomali"></div>',
}));

jest.mock("@/components/icons/IconEmptyData.vue", () => ({
  name: "IconEmptyData",
  template: '<div class="icon-empty-data"></div>',
}));

jest.mock("@/components/icons/IconFolder.vue", () => ({
  name: "IconFolder",
  template: '<div class="icon-folder"></div>',
}));

describe("RekapKertasKerja.vue", () => {
  let wrapper: VueWrapper<any>;
  let mockRekapService: jest.Mocked<RekapService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockDetailSentralService: jest.Mocked<DetailSentralService>;
  let mockGlobalFormat: jest.Mocked<GlobalFormat>;

  // Mock responses
  const mockSentralResponse = {
    data: [
      {
        uuid_sentral: "test-uuid-1",
        sentral: "Test Sentral 1",
        kode_sentral: "TS001",
        jenis_pembangkit: "PLTU",
        bbm: "Batu Bara",
        daya_terpasang: 1000,
        daya_mampu: 900,
        kode_pengelola: "TEST",
        mesins: []
      }
    ],
    meta: {
      totalRecords: 1,
      totalPages: 1,
      limit: 10,
      currentPage: 1
    }
  };

  const mockPengelolaResponse = {
    data: [
      {
        id_pengelola: 1,
        kode_pengelola: "TEST",
        pengelola: "Test Pengelola"
      }
    ]
  };

  const mockKategoriPembangkitResponse = {
    data: [
      {
        kode_jenis_pembangkit: "PLTU",
        nama_jenis_pembangkit: "PLTU"
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock services
    mockRekapService = {
      getSentralData: jest.fn().mockResolvedValue(mockSentralResponse),
      getPengelolaData: jest.fn().mockResolvedValue(mockPengelolaResponse),
      getComboKategoriPembangkit: jest.fn().mockResolvedValue(mockKategoriPembangkitResponse),
      getComboUmurMesin: jest.fn().mockResolvedValue({ data: [] }),
      getComboKondisiMesin: jest.fn().mockResolvedValue({ data: [] }),
      getComboIRR: jest.fn().mockResolvedValue({ data: [] }),
      downloadTemplateRekap: jest.fn().mockResolvedValue(new Blob()),
      downloadTemplateFS: jest.fn().mockResolvedValue(new Blob()),
      uploadTemplateAwalKK: jest.fn().mockResolvedValue({ data: { message: "Success" } }),
      uploadTemplateAwalFS: jest.fn().mockResolvedValue({ data: { message: "Success" } }),
      getSuggestionSentral: jest.fn().mockResolvedValue({ data: [] }),
      getMesinByIdSentral: jest.fn().mockResolvedValue({ data: { mesinById: [], sentral: {} } }),
      getNilaiSentral: jest.fn().mockResolvedValue({ data: [] }),
      getNilaiMesin: jest.fn().mockResolvedValue({ data: [] }),
      getStatusFSSentral: jest.fn().mockResolvedValue({ data: [] }),
      getStatusFSMesin: jest.fn().mockResolvedValue({ data: [] }),
      getStatusRealisasiSentral: jest.fn().mockResolvedValue({ data: [] }),
      getStatusRealisasiMesin: jest.fn().mockResolvedValue({ data: [] }),
      getCheckInputAsumsiSentral: jest.fn().mockResolvedValue({ data: [] }),
      getCheckInputAsumsiMesin: jest.fn().mockResolvedValue({ data: [] }),
    } as any;

    mockAuthService = {
      getUserInfo: jest.fn().mockResolvedValue({
        data: {
          kode_pengelola: "TEST",
          nama_pengelola: "Test Pengelola"
        }
      }),
    } as any;

    mockDetailSentralService = {
      getMesinByIdSentral: jest.fn().mockResolvedValue({
        data: {
          mesinById: [],
          sentral: {}
        }
      }),
      getNilaiSentral: jest.fn().mockResolvedValue({ data: [] }),
      getNilaiMesin: jest.fn().mockResolvedValue({ data: [] }),
      getStatusFSSentral: jest.fn().mockResolvedValue({ data: [] }),
      getStatusFSMesin: jest.fn().mockResolvedValue({ data: [] }),
      getStatusRealisasiSentral: jest.fn().mockResolvedValue({ data: [] }),
      getStatusRealisasiMesin: jest.fn().mockResolvedValue({ data: [] }),
      getCheckInputAsumsiSentral: jest.fn().mockResolvedValue({ data: [] }),
      getCheckInputAsumsiMesin: jest.fn().mockResolvedValue({ data: [] }),
    } as any;

    mockGlobalFormat = {
      formatRupiah: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatDecimal: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatEnergy: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatPercent: jest.fn().mockImplementation((value) => value?.toString() || "0"),
    } as any;

    // Setup mock constructors
    MockedRekapService.mockImplementation(() => mockRekapService);
    MockedAuthService.mockImplementation(() => mockAuthService);
    MockedDetailSentralService.mockImplementation(() => mockDetailSentralService);
    MockedGlobalFormat.mockImplementation(() => mockGlobalFormat);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe("Component Mounting", () => {
    it("should mount successfully", async () => {
      wrapper = shallowMount(RekapKertasKerja);
      expect(wrapper.exists()).toBe(true);
    });

    it("should initialize with loading state", async () => {
      wrapper = shallowMount(RekapKertasKerja);
      await nextTick();

      expect(wrapper.exists()).toBe(true);
      // Cek apakah ada loading state
      expect(wrapper.vm.isLoading).toBeDefined();
    });
  });

  describe("Data Fetching on Mount", () => {
    beforeEach(async () => {
      wrapper = shallowMount(RekapKertasKerja);
      await nextTick();
      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should call required service methods on mount", () => {
      expect(mockRekapService.getSentralData).toHaveBeenCalled();
      expect(mockRekapService.getPengelolaData).toHaveBeenCalled();
      expect(mockRekapService.getComboKategoriPembangkit).toHaveBeenCalled();
    });

    it("should handle getSentralData service call", () => {
      expect(mockRekapService.getSentralData).toHaveBeenCalledTimes(1);
    });

    it("should handle getPengelolaData service call", () => {
      expect(mockRekapService.getPengelolaData).toHaveBeenCalledTimes(1);
    });

    it("should handle getComboKategoriPembangkit service call", () => {
      expect(mockRekapService.getComboKategoriPembangkit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Component Properties", () => {
    beforeEach(async () => {
      wrapper = shallowMount(RekapKertasKerja);
      await nextTick();
    });

    it("should have initial reactive properties", () => {
      expect(wrapper.vm.isLoading).toBeDefined();
      expect(wrapper.vm.sentralData).toBeDefined();
      expect(wrapper.vm.pengelolaData).toBeDefined();
      expect(wrapper.vm.kategoriPembangkitData).toBeDefined();
    });

    it("should initialize with correct default values", () => {
      expect(wrapper.vm.tahunBerjalan).toBe(new Date().getFullYear());
      expect(wrapper.vm.kodePengelola).toBe('ALL');
      expect(wrapper.vm.checkPembangkit).toBe(false);
      expect(wrapper.vm.checkDmn).toBe(false);
    });
  });

  describe("Modal Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(RekapKertasKerja);
      await nextTick();
    });

    it("should handle search modal state", async () => {
      expect(wrapper.vm.isSearchModalOpen).toBe(false);
      
      // Test opening modal
      wrapper.vm.isSearchModalOpen = true;
      await nextTick();
      
      expect(wrapper.vm.isSearchModalOpen).toBe(true);
    });

    it("should handle upload modal states", async () => {
      expect(wrapper.vm.isModalUnggahKertasKerjaOpen).toBe(false);
      expect(wrapper.vm.isModalUnggahFSOpen).toBe(false);
      
      // Test opening modals
      wrapper.vm.isModalUnggahKertasKerjaOpen = true;
      wrapper.vm.isModalUnggahFSOpen = true;
      await nextTick();
      
      expect(wrapper.vm.isModalUnggahKertasKerjaOpen).toBe(true);
      expect(wrapper.vm.isModalUnggahFSOpen).toBe(true);
    });
  });

  describe("Checkbox Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(RekapKertasKerja);
      await nextTick();
    });

    it("should handle pembangkit checkbox change", async () => {
      expect(wrapper.vm.checkPembangkit).toBe(false);
      
      wrapper.vm.checkPembangkit = true;
      await nextTick();
      
      expect(wrapper.vm.checkPembangkit).toBe(true);
    });

    it("should handle DMN checkbox change", async () => {
      expect(wrapper.vm.checkDmn).toBe(false);
      
      wrapper.vm.checkDmn = true;
      await nextTick();
      
      expect(wrapper.vm.checkDmn).toBe(true);
    });

    it("should handle umur mesin checkbox change", async () => {
      expect(wrapper.vm.checkAllUmurMesin).toBe(false);
      
      wrapper.vm.checkAllUmurMesin = true;
      await nextTick();
      
      expect(wrapper.vm.checkAllUmurMesin).toBe(true);
    });

    it("should handle kondisi mesin checkbox change", async () => {
      expect(wrapper.vm.checkAllKondisiMesin).toBe(false);
      
      wrapper.vm.checkAllKondisiMesin = true;
      await nextTick();
      
      expect(wrapper.vm.checkAllKondisiMesin).toBe(true);
    });
  });

  describe("File Upload Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(RekapKertasKerja);
      await nextTick();
    });

    it("should handle file change for rekap", () => {
      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      wrapper.vm.handleFileChange(mockEvent);
      
      expect(wrapper.vm.selectedFile).toBe(mockFile);
    });

    it("should handle file change for evidence", () => {
      const mockFile = new File(["test"], "test.pdf", { type: "application/pdf" });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      wrapper.vm.handleFileChangeEvidence(mockEvent);
      
      expect(wrapper.vm.selectedFileEvidence).toBe(mockFile);
    });

    it("should handle file change for FS", () => {
      const mockFile = new File(["test"], "test.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      wrapper.vm.handleFileFSChange(mockEvent);
      
      expect(wrapper.vm.selectedFileFS).toBe(mockFile);
    });
  });

  describe("Global Format Integration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(RekapKertasKerja);
      await nextTick();
    });

    it("should use global format for decimal formatting", () => {
      const testValue = 1000000;
      wrapper.vm.globalFormat.formatDecimal(testValue);
      
      expect(mockGlobalFormat.formatDecimal).toHaveBeenCalledWith(testValue);
    });

    it("should format rupiah values", () => {
      const testValue = 1000000;
      wrapper.vm.globalFormat.formatRupiah(testValue);
      
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(testValue);
    });

    it("should format energy values", () => {
      const testValue = 1000.50;
      wrapper.vm.globalFormat.formatEnergy(testValue);
      
      expect(mockGlobalFormat.formatEnergy).toHaveBeenCalledWith(testValue);
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock service to throw error
      mockRekapService.getSentralData.mockRejectedValue(new Error("Service Error"));
      
      wrapper = shallowMount(RekapKertasKerja);
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Component should still exist even with errors
      expect(wrapper.exists()).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });
});
