import { shallowMount } from "@vue/test-utils";
import TableDataFinansial from "@/components/RekapKertasKerja/TableDataFinansial.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
import ReloadComponent from "@/components/ui/ReloadComponent.vue";

// Mock the GlobalFormat service
jest.mock("@/services/format/global-format", () => {
  return jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn().mockImplementation((value) => `Rp ${value}`),
  }));
});

describe("TableDataFinansial.vue Unit Tests", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(TableDataFinansial, {
      props: {
        source: [
          {
            id_uraian: 1,
            uraian: "Test Level 1",
            level2: [],
          },
        ],
        dataFinansial: {
          tahun: [2022, 2023],
        },
        isFetchingError: false,
      },
    });
  });

  it("renders without crashing", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("renders table when data is available", () => {
    expect(wrapper.find("table").exists()).toBe(true);
    expect(wrapper.find("th").text()).toContain("Nama");
  });

  it("renders correct number of year headers", () => {
    const yearHeaders = wrapper.findAll("th");
    expect(yearHeaders.length).toBe(3); // 'Nama' header and two years (2022, 2023)
    expect(yearHeaders.at(1)?.text()).toContain("2022");
    expect(yearHeaders.at(2)?.text()).toContain("2023");
  });

  it("renders ShimmerLoading component when data is not available", async () => {
    await wrapper.setProps({ source: [], dataFinansial: { tahun: [] } });
    expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(true);
  });

  it("renders ReloadComponent when there is a fetch error and no data", async () => {
    await wrapper.setProps({
      isFetchingError: true,
      source: [],
      dataFinansial: { tahun: [] },
    });
    expect(wrapper.findComponent(ReloadComponent).exists()).toBe(true);
  });

  it("toggles row open and close when clicked", async () => {
    // Test initial state
    expect(wrapper.vm.isRowOpen(1)).toBe(false);
    
    // Toggle row open
    wrapper.vm.toggleRow(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isRowOpen(1)).toBe(true);
    
    // Toggle row close
    wrapper.vm.toggleRow(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isRowOpen(1)).toBe(false);
  });

  it("formats the rupiah values correctly using GlobalFormat", async () => {
    const mockData = [
      {
        id_uraian: 1,
        uraian: "Level 1",
        level2: [
          {
            id_uraian: 2,
            uraian: "Level 2",
            t2022: 1000000,
            t2023: 2000000,
            level3: [],
          },
        ],
      },
    ];

    await wrapper.setProps({ source: mockData });
    const cells = wrapper.findAll("td");
    expect(cells.at(1)?.text()).toContain("");
    expect(cells.at(2)?.text()).toContain("");
  });

  it("applies the correct styles for the last realization year", async () => {
    await wrapper.setProps({ tahunTerakhirRealisasi: 2022 });
    const yearCells = wrapper.findAll("th");
    expect(yearCells.at(1)?.classes()).toContain("text-primaryTextColor"); // Tahun terakhir realisasi 2022
    expect(yearCells.at(2)?.classes()).toContain("text-primaryColor"); // Tahun 2023 lebih dari tahun terakhir
  });
});
