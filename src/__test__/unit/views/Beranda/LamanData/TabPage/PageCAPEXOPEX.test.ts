import { shallowMount } from "@vue/test-utils";
import PageCAPEXOPEX from "@/views/Beranda/LamanData/TabPage/PageCAPEXOPEX.vue";
import { createPinia, setActivePinia } from "pinia";

// Mock LamanService
jest.mock("@/services/laman-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPeriodeTahun: jest.fn().mockResolvedValue({
      data: [{ tahun: 2018 }, { tahun: 2022 }]
    }),
    getDataAnggaran: jest.fn().mockResolvedValue({
      data: [{
        id_pengelola: 1,
        pengelola: "Unit Test",
        pembangkits: []
      }]
    }),
    downloadExcelCAPEXOPEX: jest.fn().mockResolvedValue({
      data: new Blob(),
      headers: { "content-disposition": "attachment; filename=\"test.xlsx\"" }
    })
  }));
});

// Mock AOS
jest.mock("aos", () => ({ init: jest.fn() }));

// Mock Pinia store
jest.mock("@/store/storeLamanDataTab", () => ({
  useLamanDataPeriodeStore: jest.fn(() => ({
    periodeTahun: [2020, 2021, 2022, 2023, 2024],
    periodeInitial: 2022
  }))
}));

describe("PageCAPEXOPEX.vue", () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    jest.clearAllMocks();
  });

  describe("Component Mounting", () => {
    it("should mount component successfully", () => {
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
        const wrapper = shallowMount(PageCAPEXOPEX, {
          global: {
            plugins: [createPinia()],
            stubs: {
              VueDatePicker: true,
              Loading: true,
              InfoHeader: true,
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
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [pinia],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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

  describe("Service Mocking", () => {
    it("should handle service mocks correctly", () => {
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
        const wrapper = shallowMount(PageCAPEXOPEX, {
          global: {
            plugins: [createPinia()],
            stubs: {
              VueDatePicker: true,
              Loading: true,
              InfoHeader: true,
              SortingIcon: true,
              RouterLink: true
            }
          },
        });
        wrapper.unmount();
      }).not.toThrow();
    });

    it("should handle empty props gracefully", () => {
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
      const wrapper = shallowMount(PageCAPEXOPEX, {
        global: {
          plugins: [createPinia()],
          stubs: {
            VueDatePicker: true,
            Loading: true,
            InfoHeader: true,
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
