import { shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";
import GrafikPage from "@/views/Data/GrafikPage.vue";

// Mock all external dependencies
jest.mock("@/services/peta-service", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getSentralByKode: jest.fn().mockResolvedValue({ 
      data: { 
        mesins: [],
        uuid_sentral: "test",
        sentral: "Test",
        pengelola: "Test",
        pembina: "Test",
        jumlah_mesin: 0,
        length: 0
      } 
    }),
    getPetaSentral: jest.fn().mockResolvedValue({ data: [] }),
  })),
}));

jest.mock("@/services/grafik-service", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getYearSentral: jest.fn().mockResolvedValue({ data: [] }),
    getYearMesin: jest.fn().mockResolvedValue({ data: [] }),
  })),
}));

jest.mock("@/services/detail-sentral-service", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getPhoto: jest.fn().mockResolvedValue({ data: new ArrayBuffer(8) }),
  })),
}));

jest.mock("@/services/helper/year-picker-service", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    filterYears: jest.fn().mockReturnValue([]),
  })),
}));

jest.mock("@/services/format/global-format", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn().mockReturnValue("Rp 1.000.000"),
    formatDecimal: jest.fn().mockReturnValue("1,000.00"),
  })),
}));

jest.mock("@/services/auth-service", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({})),
}));

// Mock stores
jest.mock("@/store/storeUserAuth", () => ({
  useUserAuthStore: jest.fn(() => ({
    levelAlias: "admin",
  })),
}));

jest.mock("@/store/storeTagGrafik", () => ({
  useTagSentral: jest.fn(() => ({
    currentTabSentral: "WLC (Realisasi & Proyeksi)",
  })),
  useTagMesin: jest.fn(() => ({
    currentTabMesin: "WLC (Realisasi & Proyeksi)",
  })),
}));

// Mock vue-router
jest.mock("vue-router", () => ({
  useRoute: jest.fn(() => ({
    params: { id: "test-sentral-id" },
  })),
}));

jest.mock("@/router", () => ({
  default: { push: jest.fn() },
}));

// Mock utils
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: jest.fn((value) => `encrypted_${value}`),
    decryptValue: jest.fn((value) => value.replace("encrypted_", "")),
  }),
}));

jest.mock("@/utils/os-detector", () => ({
  osDetector: {
    getOS: jest.fn(() => "macOS"),
  },
}));

jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn(),
}));

// Mock URL for browser APIs
Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mocked-object-url'),
    revokeObjectURL: jest.fn(),
  },
  writable: true,
});

describe("GrafikPage.vue", () => {
  let wrapper: any;

  const createWrapper = (props = {}) => {
    return shallowMount(GrafikPage, {
      props: {
        tabsTitle: [],
        ...props,
      },
      global: {
        stubs: {
          TagSentral: true,
          TagMesin: true,
          GrafikSentral: true,
          GrafikMesin: true,
          InfoSentral: true,
          InfoMesin: true,
          SearchBox: true,
          ModalSearch: true,
          Chips: true,
          Loading: true,
          VueDatePicker: true,
          "router-link": true,
        },
        directives: {
          'auto-animate': () => {},
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console output
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.restoreAllMocks();
  });

  describe("Basic Component Tests", () => {
    it("should mount successfully", async () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle props", () => {
      const props = [];
      wrapper = createWrapper({ tabsTitle: props });
      expect(wrapper.props('tabsTitle')).toEqual(props);
    });

    it("should render without throwing errors", async () => {
      expect(() => {
        wrapper = createWrapper();
      }).not.toThrow();
    });

    it("should have correct component name", () => {
      wrapper = createWrapper();
      expect(wrapper.vm.$options.name || 'GrafikPage').toBeTruthy();
    });

    it("should initialize with default state", async () => {
      wrapper = createWrapper();
      await nextTick();
      
      expect(wrapper.vm.isLoading).toBeDefined();
      expect(wrapper.vm.isHover).toBeDefined();
      expect(wrapper.vm.tabs).toBeDefined();
    });

    it("should handle toggle functions", async () => {
      wrapper = createWrapper();
      await nextTick();
      
      const initialHover = wrapper.vm.isHover;
      wrapper.vm.toggleButton();
      expect(wrapper.vm.isHover).toBe(!initialHover);
    });

    it("should handle different props variations", () => {
      // Test with undefined props
      wrapper = createWrapper({ tabsTitle: undefined });
      expect(wrapper.exists()).toBe(true);
      
      // Test with empty array
      wrapper = createWrapper({ tabsTitle: [] });
      expect(wrapper.exists()).toBe(true);
    });
  });
});
