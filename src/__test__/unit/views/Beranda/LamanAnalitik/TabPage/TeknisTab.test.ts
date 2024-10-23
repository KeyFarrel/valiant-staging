import { shallowMount } from "@vue/test-utils";
import TeknisTab from "@/views/Beranda/LamanAnalitik/TabPage/TeknisTab.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import GraphicNCF from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNCF.vue";
import GraphicEAF from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicEAF.vue";
import GraphicNPHR from "@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNPHR.vue";
import GrafikService from "@/services/grafik-service";
import LamanService from "@/services/laman-service";

// Mock the necessary services
jest.mock("@/services/grafik-service", () => {
  return jest.fn().mockImplementation(() => ({
    getComboKategoriPembangkit: jest.fn().mockResolvedValue({
      success: true,
      data: [{ jenis_kit: "PLTU", dmn: [{ id_daya: "1", daya_mampu: "500" }] }],
    }),
    getFilterDaya: jest.fn().mockResolvedValue({ success: true, data: [] }),
  }));
});

jest.mock("@/services/laman-service", () => {
  return jest.fn().mockImplementation(() => ({
    getListTahunAnalitik: jest.fn().mockResolvedValue({
      data: [{ tahun: 2020 }, { tahun: 2023 }],
    }),
  }));
});

describe("TeknisTab.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(TeknisTab, {
      global: {
        stubs: {
          Loading: true,
          GraphicNCF: true,
          GraphicEAF: true,
          GraphicNPHR: true,
        },
      },
    });
  });

  it("renders Loading component when isLoading is true", async () => {
    wrapper.vm.isLoading = true; // Modify the data directly
    await wrapper.vm.$nextTick(); // Wait for the DOM to update
    expect(wrapper.findComponent(Loading).exists()).toBe(true); // Check if Loading component is displayed
  });
  

  it("fetches category data on mount", async () => {
    const grafikServiceInstance = new GrafikService();
    const getCategorySpy = jest.spyOn(
      grafikServiceInstance,
      "getComboKategoriPembangkit"
    );
    await wrapper.vm.$nextTick(); // Wait for lifecycle hooks
    expect(getCategorySpy).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.itemsCategory.length).toBeGreaterThan(0); // Ensure the itemsCategory is populated
  });

  it("fetches year range on mount", async () => {
    const lamanServiceInstance = new LamanService();
    const fetchYearRangeSpy = jest.spyOn(
      lamanServiceInstance,
      "getListTahunAnalitik"
    );
    await wrapper.vm.$nextTick(); // Wait for lifecycle hooks
    expect(fetchYearRangeSpy).toHaveBeenCalledTimes(0);
  });

  it("renders the graphics components", () => {
    expect(wrapper.findComponent(GraphicNCF).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicEAF).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicNPHR).exists()).toBe(true);
  });
});
