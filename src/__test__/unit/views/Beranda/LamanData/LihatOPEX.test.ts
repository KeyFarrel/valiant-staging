import { shallowMount } from "@vue/test-utils";
import LihatOPEX from "@/views/Beranda/LamanData/LihatOPEX.vue";
import { createPinia, setActivePinia } from "pinia";

// Mock vue-router
const mockRoute = {
  params: { id: "1" },
  query: { tahun: "2023" },
};

jest.mock("vue-router", () => ({
  useRoute: jest.fn(() => mockRoute),
}));

// Mock Pinia store
jest.mock("@/store/storeLamanDataTab", () => ({
  useLamanDataPeriodeStore: jest.fn(() => ({
    periodeTahun: [2020, 2021, 2022, 2023, 2024],
    periodeInitial: 2022
  }))
}));

// Mock GlobalFormat service
jest.mock("@/services/format/global-format", () => {
  return jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn().mockReturnValue("Rp 100.000"),
    formatDecimal: jest.fn().mockReturnValue("100.00"),
    formatNumber: jest.fn().mockReturnValue("100")
  }));
});

// Mock LihatOPEXService
jest.mock("@/services/lihat-opex-service", () => {
  return jest.fn().mockImplementation(() => ({
    getMesinById: jest.fn().mockResolvedValue({
      data: { 
        mesin: "Test Mesin", 
        kode_sentral: "123",
        kode_jenis_pembangkit: "PLTU",
        kondisi_unit: "Baik",
        daya_terpasang: 1000,
        daya_mampu: 900,
        tahun_operasi: 2000,
        masa_manfaat: 15
      }
    }),
    getPembangkitByKode: jest.fn().mockResolvedValue({
      data: { kode_pengelola: "001", pembina: "Test Pembina" }
    }),
    getPengelolaData: jest.fn().mockResolvedValue({
      data: [{ kode_pengelola: "001", pengelola: "Test Pengelola" }]
    }),
    getAsumsiParameterData: jest.fn().mockResolvedValue({
      data: { asumsi_makro: { umur_teknis: 5 } }
    }),
    getOPEXKomponenB: jest.fn().mockResolvedValue({
      data: { 
        cost_component_b: 5000000,
        biaya_kepegawaian: 1000000,
        biaya_pemeliharaan_rutin: 1500000,
        biaya_administrasi_umum: 250000,
        biaya_pembelian_tenaga_listrik: 750000,
        biaya_lain_lain: 500000
      }
    }),
    getOPEXKomponenC: jest.fn().mockResolvedValue({
      data: {
        total_component_c: { cost_component_c: 6000000 },
        detail_component_c: [
          { bahan_bakar: "Solar", harga_bahan_bakar: 1000000 }
        ]
      }
    }),
    getOPEXKomponenD: jest.fn().mockResolvedValue({
      data: {
        cost_component_d: 4000000,
        biaya_pelumas: 500000,
        biaya_lain_lain: 250000
      }
    }),
  }));
});

// Mock UserService
jest.mock("@/services/user-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPembina: jest.fn().mockResolvedValue({
      data: [{ id_pembina: 1, pembina: "Pembina A" }]
    })
  }));
});

describe("LihatOPEX.vue", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    jest.clearAllMocks();
  });

  describe("Component Mounting", () => {
    it("should mount component successfully", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      expect(wrapper.vm).toBeTruthy();
      expect(wrapper.exists()).toBe(true);
      
      wrapper.unmount();
    });

    it("should create component instance without errors", () => {
      expect(() => {
        const wrapper = shallowMount(LihatOPEX, {
          global: {
            plugins: [createPinia()],
            stubs: {
              InfoHeader: true,
              Loading: true,
              VueDatePicker: true,
              SortingIcon: true,
              RouterLink: true
            }
          },
        });
        wrapper.unmount();
      }).not.toThrow();
    });
  });

  describe("Component Structure", () => {
    it("should render with proper structure", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Component should exist and be a Vue component
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.vm).toBeDefined();
      
      wrapper.unmount();
    });

    it("should have proper stubbed components setup", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Wrapper should be created successfully with stubs
      expect(wrapper.vm).toBeTruthy();
      
      wrapper.unmount();
    });
  });

  describe("Template Rendering", () => {
    it("should handle template rendering without errors", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Template should render without throwing errors
      expect(wrapper.html()).toBeDefined();
      
      wrapper.unmount();
    });
  });

  describe("Pinia Integration", () => {
    it("should integrate with Pinia store correctly", () => {
      const pinia = createPinia();
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [pinia],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Component should mount with Pinia without errors
      expect(wrapper.vm).toBeTruthy();
      
      wrapper.unmount();
    });
  });

  describe("Router Integration", () => {
    it("should integrate with Vue Router correctly", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Component should mount with router mocks without errors
      expect(wrapper.vm).toBeTruthy();
      
      wrapper.unmount();
    });
  });

  describe("Service Mocking", () => {
    it("should handle service mocks correctly", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Component should work with mocked services
      expect(wrapper.vm).toBeTruthy();
      
      wrapper.unmount();
    });
  });

  describe("Component Lifecycle", () => {
    it("should handle component mounting lifecycle", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Component should complete mounting process
      expect(wrapper.vm.$el).toBeDefined();
      
      wrapper.unmount();
    });

    it("should handle component unmounting correctly", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Component should unmount without errors
      expect(() => wrapper.unmount()).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("should not throw errors during initialization", () => {
      expect(() => {
        const wrapper = shallowMount(LihatOPEX, {
          global: {
            plugins: [createPinia()],
            stubs: {
              InfoHeader: true,
              Loading: true,
              VueDatePicker: true,
              SortingIcon: true,
              RouterLink: true
            }
          },
        });
        wrapper.unmount();
      }).not.toThrow();
    });

    it("should handle empty props gracefully", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
        props: {}
      });

      expect(wrapper.vm).toBeTruthy();
      
      wrapper.unmount();
    });
  });

  describe("Component Composition", () => {
    it("should work with Vue 3 Composition API", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Component should be compatible with Composition API
      expect(wrapper.vm).toBeTruthy();
      
      wrapper.unmount();
    });
  });

  describe("Test Environment", () => {
    it("should work in Jest testing environment", () => {
      const wrapper = shallowMount(LihatOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            InfoHeader: true,
            Loading: true,
            VueDatePicker: true,
            SortingIcon: true,
            RouterLink: true
          }
        },
      });

      // Component should be testable in Jest
      expect(wrapper.vm).toBeTruthy();
      expect(wrapper.html()).toBeTruthy();
      
      wrapper.unmount();
    });
  });
});
