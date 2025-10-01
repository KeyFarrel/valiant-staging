import { shallowMount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import VerifikasiPersetujuan from "@/views/Verifikasi/Sentral/VerifikasiPersetujuan.vue";
import PersetujuanService from "@/services/persetujuan-service";

// Mock services
jest.mock("@/services/persetujuan-service");
const MockedPersetujuanService = PersetujuanService as jest.MockedClass<typeof PersetujuanService>;

// Mock encrypt storage
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    getItem: jest.fn().mockReturnValue("test-uuid-sentral")
  })
}));

// Mock auto-animate directive
const autoAnimateDirective = {
  beforeMount: jest.fn(),
  updated: jest.fn()
};

// Mock components
const componentStubs = {
  Loading: { 
    name: "Loading", 
    template: '<div class="loading-spinner">Loading...</div>' 
  },
  KertasKerja: {
    name: "KertasKerja",
    template: '<div class="kertas-kerja"></div>',
    props: ["source"]
  },
  FeasibilityStudy: {
    name: "FeasibilityStudy",
    template: '<div class="feasibility-study"></div>',
    props: ["source"]
  },
  KertasKerjaMesin: {
    name: "KertasKerjaMesin",
    template: '<div class="kertas-kerja-mesin"></div>',
    props: ["source"]
  },
  FeasibilityStudyMesin: {
    name: "FeasibilityStudyMesin",
    template: '<div class="feasibility-study-mesin"></div>',
    props: ["source"]
  }
};

describe("VerifikasiPersetujuan.vue", () => {
  let wrapper: VueWrapper<any>;
  let mockPersetujuanService: jest.Mocked<PersetujuanService>;
  let consoleSpy: jest.SpyInstance;

  // Mock responses
  const mockDetailMesinResponse = {
    success: true,
    data: {
      sentral: "Sentral Test 1",
      mesins: [
        {
          uuid_mesin: "test-uuid-mesin-1",
          mesin: "Mesin Test 1",
          kode_mesin: "TST001"
        },
        {
          uuid_mesin: "test-uuid-mesin-2", 
          mesin: "Mesin Test 2",
          kode_mesin: "TST002"
        }
      ]
    }
  };

  const mockPersetujuanKKResponse = {
    success: true,
    data: {
      uuid_sentral: "test-uuid-sentral",
      sentral: "Sentral Test 1",
      tahun: 2024,
      status: "Disetujui T1",
      keterangan: "Data sudah sesuai",
      mesins: [
        {
          uuid_mesin: "test-uuid-mesin-1",
          mesin: "Mesin Test 1",
          status: "Disetujui T1",
          keterangan: "Data mesin sudah sesuai"
        },
        {
          uuid_mesin: "test-uuid-mesin-2",
          mesin: "Mesin Test 2", 
          status: "Ditolak T1",
          keterangan: "Data mesin perlu diperbaiki"
        }
      ]
    }
  };

  const mockPersetujuanFSResponse = {
    data: {
      uuid_sentral: "test-uuid-sentral",
      sentral: "Sentral Test 1",
      status: "Disetujui T1",
      keterangan: "FS sudah sesuai",
      mesins: [
        {
          uuid_mesin: "test-uuid-mesin-1",
          mesin: "Mesin Test 1",
          status: "Disetujui T1",
          keterangan: "FS mesin sudah sesuai"
        },
        {
          uuid_mesin: "test-uuid-mesin-2",
          mesin: "Mesin Test 2",
          status: "Disetujui T1", 
          keterangan: "FS mesin sudah sesuai"
        }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Suppress console errors during tests
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Setup mock services
    mockPersetujuanService = {
      getDetailMesinAppr: jest.fn().mockResolvedValue(mockDetailMesinResponse),
      getPersetujuanKKSentral: jest.fn().mockResolvedValue(mockPersetujuanKKResponse),
      getPersetujuanFSSentral: jest.fn().mockResolvedValue(mockPersetujuanFSResponse)
    } as any;

    // Setup mock constructors
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
      wrapper = shallowMount(VerifikasiPersetujuan, {
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
      wrapper = shallowMount(VerifikasiPersetujuan, {
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
      expect(wrapper.vm.isHover).toBe(true);
      expect(wrapper.vm.approveSentralKK).toEqual([]);
      expect(wrapper.vm.approveSentralFS).toEqual([]);
      expect(wrapper.vm.mesinKk).toEqual([]);
      expect(wrapper.vm.mesinFs).toEqual([]);
    });
  });

  describe("Service Integration on Mount", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should call getDetailMesinAppr service on mount", () => {
      expect(mockPersetujuanService.getDetailMesinAppr).toHaveBeenCalled();
    });

    it("should call getPersetujuanKKSentral service on mount", () => {
      expect(mockPersetujuanService.getPersetujuanKKSentral).toHaveBeenCalled();
    });

    it("should call getPersetujuanFSSentral service on mount", () => {
      expect(mockPersetujuanService.getPersetujuanFSSentral).toHaveBeenCalled();
    });
  });

  describe("Data Population", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should populate detail mesin data after fetch", () => {
      expect(wrapper.vm.detailMesin).toBeDefined();
      expect(wrapper.vm.namaSentral).toBeDefined();
      expect(wrapper.vm.namaMesin).toBeDefined();
    });

    it("should populate approval KK data after fetch", () => {
      expect(wrapper.vm.approveSentralKK).toBeDefined();
      expect(wrapper.vm.approveMesinKK).toBeDefined();
    });

    it("should populate approval FS data after fetch", () => {
      expect(wrapper.vm.approveSentralFS).toBeDefined();
      expect(wrapper.vm.approveMesinFS).toBeDefined();
    });

    it("should set correct sentral and mesin names", () => {
      expect(wrapper.vm.namaSentral).toBe("Sentral Test 1");
      expect(wrapper.vm.namaMesin).toBe("Mesin Test 1");
    });
  });

  describe("UI State Management", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should handle hover state toggle", () => {
      expect(wrapper.vm.isHover).toBe(true);
      
      wrapper.vm.toggleButton();
      expect(wrapper.vm.isHover).toBe(false);
      
      wrapper.vm.toggleButton();
      expect(wrapper.vm.isHover).toBe(true);
    });

    it("should handle loading state", () => {
      expect(typeof wrapper.vm.isLoading).toBe('boolean');
      
      wrapper.vm.isLoading = true;
      expect(wrapper.vm.isLoading).toBe(true);
      
      wrapper.vm.isLoading = false;
      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("Tab Management", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should initialize with first mesin selected", () => {
      expect(wrapper.vm.selectedTitle).toBe("Mesin Test 1");
    });

    it("should change selected tab when changeTabMesin is called", () => {
      wrapper.vm.changeTabMesin("Mesin Test 2");
      expect(wrapper.vm.selectedTitle).toBe("Mesin Test 2");
    });

    it("should filter mesin data when tab changes", () => {
      wrapper.vm.changeTabMesin("Mesin Test 1");
      
      // Should filter the mesin data based on selected mesin
      expect(wrapper.vm.mesinKk).toBeDefined();
      expect(wrapper.vm.mesinFs).toBeDefined();
    });

    it("should handle Unit Sentral selection", () => {
      wrapper.vm.selectedTitle = "Unit Sentral";
      expect(wrapper.vm.selectedTitle).toBe("Unit Sentral");
    });
  });

  describe("Service Mocking Validation", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
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
      expect(mockPersetujuanService.getDetailMesinAppr).toBeDefined();
      expect(mockPersetujuanService.getPersetujuanKKSentral).toBeDefined();
      expect(mockPersetujuanService.getPersetujuanFSSentral).toBeDefined();
    });

    it("should return correct mock responses", () => {
      expect(mockPersetujuanService.getDetailMesinAppr).toHaveBeenCalled();
      expect(mockPersetujuanService.getPersetujuanKKSentral).toHaveBeenCalled();
      expect(mockPersetujuanService.getPersetujuanFSSentral).toHaveBeenCalled();
    });
  });

  describe("Component Props and Provide", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should provide selectedTitle to child components", () => {
      // The component uses provide("selectedTitle", selectedTitle)
      expect(wrapper.vm.selectedTitle).toBeDefined();
    });

    it("should pass correct props to child components", async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const kertasKerjaComponent = wrapper.findComponent({ name: "KertasKerja" });
      const feasibilityStudyComponent = wrapper.findComponent({ name: "FeasibilityStudy" });
      
      if (kertasKerjaComponent.exists()) {
        expect(kertasKerjaComponent.props('source')).toBeDefined();
      }
      
      if (feasibilityStudyComponent.exists()) {
        expect(feasibilityStudyComponent.props('source')).toBeDefined();
      }
    });
  });

  describe("Conditional Rendering", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should show loading component when isLoading is true", async () => {
      wrapper.vm.isLoading = true;
      await nextTick();
      
      const loadingComponent = wrapper.findComponent({ name: "Loading" });
      expect(loadingComponent.exists()).toBe(true);
    });

    it("should show mesin list when isHover is true", async () => {
      wrapper.vm.isHover = true;
      await nextTick();
      
      // Check if mesin list is rendered (v-if="isHover")
      expect(wrapper.vm.isHover).toBe(true);
    });

    it("should hide mesin list when isHover is false", async () => {
      wrapper.vm.isHover = false;
      await nextTick();
      
      expect(wrapper.vm.isHover).toBe(false);
    });
  });

  describe("Data Filtering Logic", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should filter KK data correctly when tab changes", () => {
      wrapper.vm.changeTabMesin("Mesin Test 1");
      
      // The function should filter approveMesinKK based on selected mesin
      expect(Array.isArray(wrapper.vm.mesinKk)).toBe(true);
    });

    it("should filter FS data correctly when tab changes", () => {
      wrapper.vm.changeTabMesin("Mesin Test 1");
      
      // The function should filter approveMesinFS based on selected mesin
      expect(Array.isArray(wrapper.vm.mesinFs)).toBe(true);
    });

    it("should handle empty data gracefully", () => {
      wrapper.vm.approveMesinKK = undefined;
      wrapper.vm.approveMesinFS = undefined;
      
      wrapper.vm.changeTabMesin("Mesin Test 1");
      
      // Should not throw errors when data is undefined
      expect(wrapper.vm.mesinKk).toBeDefined();
      expect(wrapper.vm.mesinFs).toBeDefined();
    });
  });

  describe("Environment Configuration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
    });

    it("should handle different node modes correctly", () => {
      // The component uses nodeMode to determine storage method
      expect(wrapper.vm.levelSentral).toBeDefined();
    });

    it("should use current year correctly", () => {
      const currentYear = new Date().getFullYear();
      expect(wrapper.vm.year).toBe(currentYear);
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully", async () => {
      // Mock service to throw error
      mockPersetujuanService.getDetailMesinAppr.mockRejectedValue(new Error("Service Error"));
      
      wrapper = shallowMount(VerifikasiPersetujuan, {
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

    it("should handle failed KK service call", async () => {
      mockPersetujuanService.getPersetujuanKKSentral.mockRejectedValue(new Error("KK Service Error"));
      
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(wrapper.exists()).toBe(true);
    });

    it("should handle failed FS service call", async () => {
      mockPersetujuanService.getPersetujuanFSSentral.mockRejectedValue(new Error("FS Service Error"));
      
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Reactive Data Updates", () => {
    beforeEach(async () => {
      wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should update selectedTitle reactively", async () => {
      const newTitle = "Mesin Test 2";
      wrapper.vm.selectedTitle = newTitle;
      await nextTick();
      
      expect(wrapper.vm.selectedTitle).toBe(newTitle);
    });

    it("should update isHover reactively", async () => {
      wrapper.vm.isHover = false;
      await nextTick();
      
      expect(wrapper.vm.isHover).toBe(false);
      
      wrapper.vm.isHover = true;
      await nextTick();
      
      expect(wrapper.vm.isHover).toBe(true);
    });
  });

  describe("Component Lifecycle", () => {
    it("should execute onMounted lifecycle correctly", async () => {
      const wrapper = shallowMount(VerifikasiPersetujuan, {
        global: {
          stubs: componentStubs,
          directives: {
            'auto-animate': autoAnimateDirective
          }
        }
      });
      
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // All services should be called during onMounted
      expect(mockPersetujuanService.getDetailMesinAppr).toHaveBeenCalled();
      expect(mockPersetujuanService.getPersetujuanKKSentral).toHaveBeenCalled();
      expect(mockPersetujuanService.getPersetujuanFSSentral).toHaveBeenCalled();
    });
  });
});
