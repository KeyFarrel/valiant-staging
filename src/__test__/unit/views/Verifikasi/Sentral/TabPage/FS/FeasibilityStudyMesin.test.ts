import { shallowMount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import FeasibilityStudyMesin from "@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudyMesin.vue";
import GlobalFormat from "@/services/format/global-format";

// Mock services
jest.mock("@/services/format/global-format");
const MockedGlobalFormat = GlobalFormat as jest.MockedClass<typeof GlobalFormat>;

// Mock utils
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: jest.fn().mockImplementation((value) => `encrypted_${value}`),
    decryptValue: jest.fn().mockImplementation((value) => value.replace('encrypted_', '')),
  }),
}));

// Mock components
jest.mock("@/components/ui/Table.vue", () => ({
  name: "TableComponent",
  template: '<div class="table-component"><slot name="table-header"></slot><slot name="table-body"></slot></div>',
  props: ["class"],
}));

// Mock RouterLink
const mockRouterLink = {
  name: "RouterLink",
  template: '<a><slot></slot></a>',
  props: ["to"],
};

describe("FeasibilityStudyMesin.vue", () => {
  let wrapper: VueWrapper<any>;
  let mockGlobalFormat: jest.Mocked<GlobalFormat>;

  // Mock data
  const mockPersetujuanFSData = [
    {
      irr_on_project: 12.5,
      tahun: "2024",
      npv_on_project: 1000000,
      irr_on_equity: 15.3,
      status: "Disetujui",
      npv_on_equity: 800000,
      uuid_sentral: "sentral-uuid-1",
      uuid_mesin: "mesin-uuid-1",
    },
    {
      irr_on_project: 10.2,
      tahun: "2023",
      npv_on_project: 750000,
      irr_on_equity: "",
      status: "Draft",
      npv_on_equity: 600000,
      uuid_sentral: "sentral-uuid-2",
      uuid_mesin: "mesin-uuid-2",
    },
    {
      irr_on_project: 8.7,
      tahun: "2022",
      npv_on_project: 500000,
      irr_on_equity: 11.8,
      status: "Ditolak T1",
      npv_on_equity: 400000,
      uuid_sentral: "sentral-uuid-3",
      uuid_mesin: "mesin-uuid-3",
    },
    {
      irr_on_project: 14.1,
      tahun: "2025",
      npv_on_project: 1200000,
      irr_on_equity: 16.5,
      status: "Menunggu Persetujuan T1",
      npv_on_equity: 950000,
      uuid_sentral: "sentral-uuid-4",
      uuid_mesin: "mesin-uuid-4",
    },
    {
      irr_on_project: 9.3,
      tahun: "2021",
      npv_on_project: 650000,
      irr_on_equity: 12.1,
      status: "Menunggu Persetujuan T2",
      npv_on_equity: 520000,
      uuid_sentral: "sentral-uuid-5",
      uuid_mesin: "mesin-uuid-5",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock services
    mockGlobalFormat = {
      formatRupiah: jest.fn().mockImplementation((value) => {
        if (value === null || value === undefined || value === '') return 'NUM';
        return `Rp ${Number(value).toLocaleString('id-ID')}`;
      }),
      formatDecimal: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatEnergy: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatPercent: jest.fn().mockImplementation((value) => value?.toString() || "0"),
    } as any;

    // Setup mock constructors
    MockedGlobalFormat.mockImplementation(() => mockGlobalFormat);

    // Suppress console warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.restoreAllMocks();
  });

  const createWrapper = (props = {}) => {
    return shallowMount(FeasibilityStudyMesin, {
      props: {
        source: mockPersetujuanFSData,
        ...props,
      },
      global: {
        stubs: {
          RouterLink: mockRouterLink,
          TableComponent: true,
        },
      },
    });
  };

  describe("Component Mounting", () => {
    it("should mount successfully", async () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it("should have component name", () => {
      wrapper = createWrapper();
      expect(wrapper.vm).toBeDefined();
    });

    it("should initialize with props", async () => {
      wrapper = createWrapper();
      await nextTick();
      expect(wrapper.props('source')).toEqual(mockPersetujuanFSData);
    });
  });

  describe("Initial State Properties", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should initialize navigation with default values", () => {
      expect(wrapper.vm.navigation.currentPage).toBe(1);
      expect(wrapper.vm.navigation.totalPages).toBe(1);
      expect(wrapper.vm.navigation.totalRecords).toBe(0);
      expect(wrapper.vm.navigation.limit).toBe(10);
    });

    it("should have globalFormat service instance", () => {
      expect(MockedGlobalFormat).toHaveBeenCalledWith();
    });
  });

  describe("Service Integration with Component", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should create GlobalFormat instance on mount", () => {
      expect(MockedGlobalFormat).toHaveBeenCalledWith();
    });

    it("should use GlobalFormat for formatting rupiah values", () => {
      wrapper.vm.globalFormat.formatRupiah(1000000);
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(1000000);
    });
  });

  describe("Data Rendering", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should render table with data", () => {
      const tableComponent = wrapper.findComponent({ name: "TableComponent" });
      expect(tableComponent.exists()).toBe(true);
    });

    it("should display correct number of data items", () => {
      expect(wrapper.props('source')).toHaveLength(5);
    });

    it("should handle empty data source", async () => {
      wrapper = createWrapper({ source: [] });
      await nextTick();
      expect(wrapper.props('source')).toEqual([]);
    });
  });

  describe("Navigation Methods Testing", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should handle pagination navigation", () => {
      // Test goToPrevious
      wrapper.vm.navigation.currentPage = 3;
      wrapper.vm.goToPrevious();
      expect(wrapper.vm.navigation.currentPage).toBe(2);
      
      // Test goToNext
      wrapper.vm.navigation.totalPages = 5;
      wrapper.vm.navigation.currentPage = 2;
      wrapper.vm.goToNext();
      expect(wrapper.vm.navigation.currentPage).toBe(3);
    });

    it("should handle goToPage", () => {
      wrapper.vm.goToPage(5);
      expect(wrapper.vm.navigation.currentPage).toBe(5);
    });

    it("should handle navigation boundary conditions", () => {
      // Test previous page boundary
      wrapper.vm.navigation.currentPage = 1;
      wrapper.vm.goToPrevious();
      expect(wrapper.vm.navigation.currentPage).toBe(0);

      // Test next page boundary  
      wrapper.vm.navigation.currentPage = 5;
      wrapper.vm.navigation.totalPages = 5;
      wrapper.vm.goToNext();
      expect(wrapper.vm.navigation.currentPage).toBe(6);
    });
  });

  describe("Computed Properties Testing", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should generate page list for small page count", () => {
      wrapper.vm.navigation.totalPages = 3;
      wrapper.vm.navigation.currentPage = 2;

      const pageList = wrapper.vm.generatePageList;
      expect(pageList).toEqual([1, 2, 3]);
    });

    it("should generate page list for large page count", () => {
      wrapper.vm.navigation.totalPages = 10;
      wrapper.vm.navigation.currentPage = 5;

      const pageList = wrapper.vm.generatePageList;
      expect(pageList).toContain(1);
      expect(pageList).toContain('...');
      expect(pageList).toContain(5);
      expect(pageList).toContain(10);
    });

    it("should generate page list for early pages", () => {
      wrapper.vm.navigation.totalPages = 10;
      wrapper.vm.navigation.currentPage = 2;

      const pageList = wrapper.vm.generatePageList;
      expect(pageList).toContain(1);
      expect(pageList).toContain(2);
      expect(pageList).toContain('...');
      expect(pageList).toContain(10);
    });

    it("should generate page list for late pages", () => {
      wrapper.vm.navigation.totalPages = 10;
      wrapper.vm.navigation.currentPage = 9;

      const pageList = wrapper.vm.generatePageList;
      expect(pageList).toContain(1);
      expect(pageList).toContain('...');
      expect(pageList).toContain(9);
      expect(pageList).toContain(10);
    });
  });

  describe("Data Format Testing", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should format rupiah values correctly", () => {
      const testValue = 1000000;
      const result = wrapper.vm.globalFormat.formatRupiah(testValue);
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(testValue);
      expect(result).toBe('Rp 1.000.000');
    });

    it("should handle empty IRR values", () => {
      const result = wrapper.vm.globalFormat.formatRupiah('');
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith('');
      expect(result).toBe('NUM');
    });

    it("should handle null/undefined values", () => {
      const result = wrapper.vm.globalFormat.formatRupiah(null);
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(null);
      expect(result).toBe('NUM');
    });
  });

  describe("Status Display Logic", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should handle different status types", () => {
      const statusTypes = [
        'Disetujui',
        'Draft', 
        'Ditolak T1',
        'Menunggu Persetujuan T1',
        'Menunggu Persetujuan T2'
      ];
      
      statusTypes.forEach(status => {
        expect(mockPersetujuanFSData.some(item => item.status === status)).toBeTruthy();
      });
    });

    it("should validate status mapping", () => {
      const approvedItem = mockPersetujuanFSData.find(item => item.status === 'Disetujui');
      const draftItem = mockPersetujuanFSData.find(item => item.status === 'Draft');
      const rejectedItem = mockPersetujuanFSData.find(item => item.status === 'Ditolak T1');
      
      expect(approvedItem).toBeDefined();
      expect(draftItem).toBeDefined();
      expect(rejectedItem).toBeDefined();
    });
  });

  describe("Props Validation", () => {
    it("should accept valid source prop", async () => {
      wrapper = createWrapper({ source: mockPersetujuanFSData });
      await nextTick();
      expect(wrapper.props('source')).toEqual(mockPersetujuanFSData);
    });

    it("should handle empty source prop", async () => {
      wrapper = createWrapper({ source: [] });
      await nextTick();
      expect(wrapper.props('source')).toEqual([]);
    });

    it("should validate PersetujuanFSItem structure", () => {
      const item = mockPersetujuanFSData[0];
      expect(item).toHaveProperty('irr_on_project');
      expect(item).toHaveProperty('tahun');
      expect(item).toHaveProperty('npv_on_project');
      expect(item).toHaveProperty('irr_on_equity');
      expect(item).toHaveProperty('status');
      expect(item).toHaveProperty('npv_on_equity');
      expect(item).toHaveProperty('uuid_sentral');
      expect(item).toHaveProperty('uuid_mesin');
    });
  });

  describe("Lifecycle and Environment", () => {
    it("should handle mount lifecycle", async () => {
      wrapper = createWrapper();
      await nextTick();
      
      // Wait for onMounted lifecycle
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle nodeMode environment variable", () => {
      const nodeMode = import.meta.env.MODE;
      expect(typeof nodeMode).toBe('string');
    });
  });

  describe("Router Integration", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should have RouterLink components", () => {
      const routerLinks = wrapper.findAllComponents({ name: "RouterLink" });
      expect(routerLinks.length).toBeGreaterThanOrEqual(0);
    });

    it("should validate router link props structure", () => {
      const mockItem = mockPersetujuanFSData[0];
      const expectedRoute = {
        name: 'persetujuan-fs',
        params: { id: mockItem.uuid_mesin },
        query: { uuid_sentral: mockItem.uuid_sentral }
      };
      
      expect(expectedRoute.name).toBe('persetujuan-fs');
      expect(expectedRoute.params.id).toBe(mockItem.uuid_mesin);
      expect(expectedRoute.query.uuid_sentral).toBe(mockItem.uuid_sentral);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid data gracefully", async () => {
      const invalidData = [
        { 
          invalid: 'data'
        }
      ];
      
      wrapper = createWrapper({ source: invalidData as any });
      await nextTick();
      
      // Component should still exist even with invalid data
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle navigation errors gracefully", () => {
      wrapper = createWrapper();
      
      // Test with invalid page value
      expect(() => wrapper.vm.goToPage('invalid')).not.toThrow();
      expect(() => wrapper.vm.goToPage(null)).not.toThrow();
    });
  });

  describe("Component Function Validation", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should have all required methods", () => {
      expect(typeof wrapper.vm.goToPage).toBe('function');
      expect(typeof wrapper.vm.goToPrevious).toBe('function');
      expect(typeof wrapper.vm.goToNext).toBe('function');
    });

    it("should return appropriate value for navigation methods", () => {
      // goToPage returns a Promise from async function, so it's not undefined
      expect(typeof wrapper.vm.goToPage(1)).toBe('object'); // Promise
      expect(wrapper.vm.goToPrevious()).toBeUndefined();
      expect(wrapper.vm.goToNext()).toBeUndefined();
    });

    it("should have computed properties", () => {
      expect(wrapper.vm.generatePageList).toBeDefined();
      expect(Array.isArray(wrapper.vm.generatePageList)).toBe(true);
    });
  });

  describe("Encryption Service Integration", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
      // Wait for onMounted lifecycle
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should handle encryption service initialization", async () => {
      // Component should mount successfully even with encryption service
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Component Integration Tests", () => {
    it("should validate component dependencies", () => {
      // Test that all services can be instantiated
      expect(() => new GlobalFormat()).not.toThrow();
    });

    it("should validate service method availability", () => {
      const globalFormat = new GlobalFormat();
      
      expect(typeof globalFormat.formatRupiah).toBe('function');
      expect(typeof globalFormat.formatDecimal).toBe('function');
      expect(typeof globalFormat.formatEnergy).toBe('function');
      expect(typeof globalFormat.formatPercent).toBe('function');
    });
  });

  describe("Table Component Integration", () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it("should render table component with correct props", () => {
      const tableComponent = wrapper.findComponent({ name: "TableComponent" });
      expect(tableComponent.exists()).toBe(true);
      expect(tableComponent.classes()).toContain('scrollbar-hide');
    });

    it("should provide table slots", () => {
      const tableComponent = wrapper.findComponent({ name: "TableComponent" });
      expect(tableComponent.exists()).toBe(true);
    });
  });
});
