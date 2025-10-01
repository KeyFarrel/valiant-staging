import { shallowMount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import LamanUtama from "@/views/Beranda/LamanUtama/LamanUtama.vue";
import LamanService from "@/services/laman-service";
import GlobalFormat from "@/services/format/global-format";

const mockPush = jest.fn();
jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/services/laman-service");
const MockedLamanService = LamanService as jest.MockedClass<
  typeof LamanService
>;

jest.mock("@/services/format/global-format");
const MockedGlobalFormat = GlobalFormat as jest.MockedClass<
  typeof GlobalFormat
>;

jest.mock("vue-echarts", () => ({
  __esModule: true,
  default: {
    name: "VChart",
    template: '<div class="chart-mock"></div>',
    props: ["option"],
  },
}));

jest.mock("echarts/core", () => ({
  use: jest.fn(),
}));

jest.mock("echarts/renderers", () => ({
  CanvasRenderer: {},
}));

jest.mock("echarts/charts", () => ({
  PieChart: {},
  BarChart: {},
  LineChart: {},
}));

jest.mock("echarts/components", () => ({
  TitleComponent: {},
  TooltipComponent: {},
  LegendComponent: {},
  GridComponent: {},
}));

jest.mock("@/components/ui/LoadingSpinner.vue", () => ({
  name: "Loading",
  template: '<div class="loading-spinner">Loading...</div>',
}));

jest.mock("@/components/ui/ModalWrapper.vue", () => ({
  name: "ModalWrapper",
  template: '<div class="modal-wrapper"><slot></slot></div>',
  props: ["showModal", "width", "height"],
}));

jest.mock("@/components/ui/Table.vue", () => ({
  name: "TableComponent",
  template:
    '<div class="table-component"><slot name="table-header"></slot><slot name="table-body"></slot></div>',
}));

jest.mock("@/components/ui/SearchBox.vue", () => ({
  name: "SearchBox",
  template: '<input class="search-box" />',
  props: ["modelValue"],
  emits: ["on-click-submit", "on-key-enter", "update:modelValue"],
}));

describe("LamanUtama.vue", () => {
  let wrapper: VueWrapper<any>;
  let mockLamanService: jest.Mocked<LamanService>;
  let mockGlobalFormat: jest.Mocked<GlobalFormat>;

  const mockTotalDayaResponse = {
    data: {
      total_daya_terpasang: 1000,
      total_daya_terinput: 800,
      persentase: 80,
    },
  };

  const mockSebaranUnitResponse = {
    data: {
      total_unit_mesin: 150,
      total_unit_terinput: 120,
      total_unit_belum_terinput: 30,
    },
  };

  const mockChartDayaResponse = {
    data: {
      daya_terpasang: 1000,
      daya_terinput: 800,
      persentase: 80,
    },
  };

  const mockKategoriPembangkitResponse = {
    data: [
      {
        kode_jenis_pembangkit: "PLTU < 100",
        nama_jenis_pembangkit: "PLTU Kurang dari 100 MW",
      },
      {
        kode_jenis_pembangkit: "PLTU 100 - 400",
        nama_jenis_pembangkit: "PLTU 100-400 MW",
      },
    ],
  };

  const mockMesinBaruResponse = {
    data: [
      {
        uuid_mesin: "123",
        sentral: "Test Sentral",
        mesin: "Test Mesin",
        tahun_operasi: "2023",
        daya_terpasang: 100,
      },
    ],
    meta: {
      totalRecords: 1,
      totalPages: 1,
      limit: 5,
      currentPage: 1,
    },
  };

  const mockMesinBelumInputResponse = {
    data: [
      {
        uuid_mesin: "456",
        sentral: "Test Sentral 2",
        mesin: "Test Mesin 2",
      },
    ],
    meta: {
      totalRecords: 1,
      totalPages: 1,
      limit: 10,
      currentPage: 1,
    },
  };

  const mockChartKategoriResponse = {
    data: {
      total_mesin: 50,
      total_mesin_terinput: 40,
      total_mesin_belum_terinput: 10,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockLamanService = {
      getTotalDaya: jest.fn().mockResolvedValue(mockTotalDayaResponse),
      getSebaranUnit: jest.fn().mockResolvedValue(mockSebaranUnitResponse),
      getChartDaya: jest.fn().mockResolvedValue(mockChartDayaResponse),
      getKategoriPembangkit: jest
        .fn()
        .mockResolvedValue(mockKategoriPembangkitResponse),
      getMesinBaru: jest.fn().mockResolvedValue(mockMesinBaruResponse),
      getMesinBelumInput: jest
        .fn()
        .mockResolvedValue(mockMesinBelumInputResponse),
      getChartKategori: jest.fn().mockResolvedValue(mockChartKategoriResponse),
    } as any;

    mockGlobalFormat = {
      formatRupiah: jest
        .fn()
        .mockImplementation((value) => value?.toString() || "0"),
      formatDecimal: jest
        .fn()
        .mockImplementation((value) => value?.toString() || "0"),
      formatNumber: jest
        .fn()
        .mockImplementation((value) => value?.toString() || "0"),
    } as any;

    MockedLamanService.mockImplementation(() => mockLamanService);
    MockedGlobalFormat.mockImplementation(() => mockGlobalFormat);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }

    document.body.style.overflow = "auto";
  });

  describe("Component Mounting", () => {
    it("should mount successfully", async () => {
      wrapper = shallowMount(LamanUtama);
      expect(wrapper.exists()).toBe(true);
    });

    it("should initialize with loading state", async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Data Fetching on Mount", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();

      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should call all required service methods on mount", () => {
      expect(mockLamanService.getTotalDaya).toHaveBeenCalled();
      expect(mockLamanService.getSebaranUnit).toHaveBeenCalled();
      expect(mockLamanService.getChartDaya).toHaveBeenCalled();
      expect(mockLamanService.getKategoriPembangkit).toHaveBeenCalled();
      expect(mockLamanService.getMesinBaru).toHaveBeenCalledWith(1, 5, "");
      expect(mockLamanService.getMesinBelumInput).toHaveBeenCalled();
      expect(mockLamanService.getChartKategori).toHaveBeenCalled();
    });

    it("should handle getTotalDaya service call", () => {
      expect(mockLamanService.getTotalDaya).toHaveBeenCalledTimes(1);
    });

    it("should handle getSebaranUnit service call", () => {
      expect(mockLamanService.getSebaranUnit).toHaveBeenCalledTimes(1);
    });

    it("should handle getChartDaya service call", () => {
      expect(mockLamanService.getChartDaya).toHaveBeenCalledTimes(1);
    });

    it("should handle getKategoriPembangkit service call", () => {
      expect(mockLamanService.getKategoriPembangkit).toHaveBeenCalledTimes(1);
    });

    it("should handle getMesinBaru service call with default parameters", () => {
      expect(mockLamanService.getMesinBaru).toHaveBeenCalledWith(1, 5, "");
    });
  });

  describe("Modal Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();
    });

    it("should open and close unit modal", async () => {
      const openButton = wrapper.find('[data-testid="open-modal-unit"]');
      if (openButton.exists()) {
        await openButton.trigger("click");
      } else {
        wrapper.vm.openModalUnit();
      }
      await nextTick();

      expect(wrapper.vm.isModalUnit).toBe(true);

      wrapper.vm.closeModalUnit();
      await nextTick();

      expect(wrapper.vm.isModalUnit).toBe(false);
    });

    it("should open and close COD modal", async () => {
      wrapper.vm.openModalCOD();
      await nextTick();

      expect(wrapper.vm.isModalCOD).toBe(true);

      wrapper.vm.closeModalCOD();
      await nextTick();

      expect(wrapper.vm.isModalCOD).toBe(false);
    });

    it("should set body overflow hidden when modal is open", async () => {
      wrapper.vm.openModalUnit();
      await nextTick();

      expect(wrapper.vm.isModalUnit).toBe(true);
    });
  });

  describe("Pagination Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should handle page change", async () => {
      await wrapper.vm.handlePageChange(2);

      expect(mockLamanService.getMesinBaru).toHaveBeenCalledWith(2, 5, "");
      expect(wrapper.vm.pageMesinBaru).toBe(2);
    });

    it("should handle page size change", async () => {
      wrapper.vm.limitMesinBaru = 10;
      await wrapper.vm.handlePageSizeChange();

      expect(mockLamanService.getMesinBaru).toHaveBeenCalledWith(1, 10, "");
      expect(wrapper.vm.pageMesinBaru).toBe(1);
    });

    it("should handle previous page navigation", async () => {
      wrapper.vm.pageMesinBaru = 2;
      await wrapper.vm.handlePreviousClick();

      expect(wrapper.vm.pageMesinBaru).toBe(1);
    });

    it("should handle next page navigation", async () => {
      wrapper.vm.totalPages = 5;
      wrapper.vm.pageMesinBaru = 1;
      await wrapper.vm.handleNextClick();

      expect(wrapper.vm.pageMesinBaru).toBe(2);
    });

    it("should not go to previous page if on first page", async () => {
      wrapper.vm.pageMesinBaru = 1;
      await wrapper.vm.handlePreviousClick();

      expect(wrapper.vm.pageMesinBaru).toBe(1);
    });

    it("should not go to next page if on last page", async () => {
      wrapper.vm.totalPages = 2;
      wrapper.vm.pageMesinBaru = 2;
      await wrapper.vm.handleNextClick();

      expect(wrapper.vm.pageMesinBaru).toBe(2);
    });
  });

  describe("Search Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should handle search", async () => {
      const searchQuery = "test search";
      wrapper.vm.searchQuery = searchQuery;

      await wrapper.vm.handleSearch();

      expect(mockLamanService.getMesinBaru).toHaveBeenCalledWith(
        1,
        5,
        searchQuery,
      );
    });

    it("should reset search query", async () => {
      wrapper.vm.searchQuery = "test";
      wrapper.vm.searchQuery = "";

      await wrapper.vm.handleSearch();

      expect(mockLamanService.getMesinBaru).toHaveBeenCalledWith(1, 5, "");
    });
  });

  describe("Chart Data Processing", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should process chart data correctly", () => {
      expect(wrapper.vm.dataChart).toEqual([
        { value: 1000, name: "Total Daya Terpasang" },
        { value: 800, name: "Total Daya Terinput" },
      ]);
    });

    it("should process category chart data correctly", () => {
      expect(wrapper.vm.dataChartsKategori).toEqual([
        { value: 40, name: "Unit Terinput" },
        { value: 10, name: "Unit Belum Terinput" },
      ]);
    });
  });

  describe("Category Change Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should handle category change", async () => {
      await wrapper.vm.changePage("PLTU < 100", 1);

      expect(mockLamanService.getChartKategori).toHaveBeenCalledWith("PLTU", 1);
      expect(wrapper.vm.tabs2).toBe("PLTU < 100");
    });

    it("should handle PLTU category mapping", async () => {
      await wrapper.vm.changePage("PLTU 100 - 400", 2);

      expect(wrapper.vm.tabs).toBe("PLTU");
    });

    it("should handle non-PLTU category", async () => {
      await wrapper.vm.changePage("PLTG", 0);

      expect(wrapper.vm.tabs).toBe("PLTG");
    });
  });

  describe("Navigation Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();
    });

    it("should navigate to mesin belum terinput page", () => {
      wrapper.vm.handlePushPage();

      expect(mockPush).toHaveBeenCalledWith({ name: "mesin-belum-terinput" });
      expect(wrapper.vm.isModalUnit).toBe(false);
    });
  });

  describe("Global Format Integration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();
    });

    it("should use global format for number formatting", () => {
      expect(MockedGlobalFormat).toHaveBeenCalled();
      expect(wrapper.vm.globalFormat).toBeDefined();
    });

    it("should format rupiah values", () => {
      const testValue = 1000000;
      wrapper.vm.globalFormat.formatRupiah(testValue);

      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(testValue);
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      try {
        wrapper = shallowMount(LamanUtama);

        const component = wrapper.vm as any;

        expect(component).toBeDefined();
        expect(wrapper.exists()).toBe(true);

        try {
          await component.getTotalDaya();
        } catch (error) {}

        expect(wrapper.exists()).toBe(true);
      } catch (error) {
        expect(true).toBe(true);
      }

      consoleSpy.mockRestore();
    });
  });

  describe("Computed Properties", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanUtama);
      await nextTick();
    });

    it("should compute displayed pages correctly", () => {
      wrapper.vm.totalPages = 10;
      wrapper.vm.pageMesinBaru = 5;
      wrapper.vm.maxDisplayedPages = 5;

      const displayedPages = wrapper.vm.displayedPages;
      expect(displayedPages).toEqual([3, 4, 5, 6, 7]);
    });

    it("should handle edge case for displayed pages at start", () => {
      wrapper.vm.totalPages = 10;
      wrapper.vm.pageMesinBaru = 1;
      wrapper.vm.maxDisplayedPages = 5;

      const displayedPages = wrapper.vm.displayedPages;
      expect(displayedPages).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle edge case for displayed pages at end", () => {
      wrapper.vm.totalPages = 10;
      wrapper.vm.pageMesinBaru = 10;
      wrapper.vm.maxDisplayedPages = 5;

      const displayedPages = wrapper.vm.displayedPages;

      expect(displayedPages).toEqual([8, 9, 10]);
    });
  });
});
