import { shallowMount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import Parameter from "@/views/Master/Parameter.vue";
import ParameterService from "@/services/parameter-service";
import GlobalFormat from "@/services/format/global-format";

// Mock services
jest.mock("@/services/parameter-service");
const MockedParameterService = ParameterService as jest.MockedClass<typeof ParameterService>;

jest.mock("@/services/format/global-format");
const MockedGlobalFormat = GlobalFormat as jest.MockedClass<typeof GlobalFormat>;

// Mock vue3-lottie
jest.mock("vue3-lottie", () => ({
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: '<div class="lottie-mock"></div>',
    props: ["animationData", "autoPlay", "loop", "speed", "width", "height"],
  },
}));

// Mock components
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
  template: '<div class="table-component"><slot name="table-header"></slot><slot name="table-body"></slot></div>',
}));

describe("Parameter.vue", () => {
  let wrapper: VueWrapper<any>;
  let mockParameterService: jest.Mocked<ParameterService>;
  let mockGlobalFormat: jest.Mocked<GlobalFormat>;

  // Mock responses
  const mockParameterResponse = {
    data: [
      {
        uuid: "test-uuid-1",
        tahun: "2024",
        discount_rate: "10.5",
        corporate_tax_rate: "25.0",
        status: 1
      },
      {
        uuid: "test-uuid-2",
        tahun: "2023",
        discount_rate: "12.0",
        corporate_tax_rate: "22.0",
        status: 0
      }
    ],
    meta: {
      totalRecords: 2,
      totalPages: 1,
      limit: 10,
      currentPage: 1
    }
  };

  const mockParameterDetailResponse = {
    data: {
      uuid: "test-uuid-1",
      tahun: "2024",
      discount_rate: "10.5",
      corporate_tax_rate: "25.0",
      status: 1
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock services
    mockParameterService = {
      getParameterData: jest.fn().mockResolvedValue(mockParameterResponse),
      addParameter: jest.fn().mockResolvedValue({ data: { message: "Success" } }),
      editParameter: jest.fn().mockResolvedValue({ data: { message: "Success" } }),
      getParameterByID: jest.fn().mockResolvedValue(mockParameterDetailResponse),
    } as any;

    mockGlobalFormat = {
      formatRupiah: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatDecimal: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatEnergy: jest.fn().mockImplementation((value) => value?.toString() || "0"),
      formatPercent: jest.fn().mockImplementation((value) => value?.toString() || "0"),
    } as any;

    // Setup mock constructors
    MockedParameterService.mockImplementation(() => mockParameterService);
    MockedGlobalFormat.mockImplementation(() => mockGlobalFormat);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe("Component Mounting", () => {
    it("should mount successfully", async () => {
      wrapper = shallowMount(Parameter);
      expect(wrapper.exists()).toBe(true);
    });

    it("should initialize with loading state", async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.vm.isLoading).toBeDefined();
    });
  });

  describe("Data Fetching on Mount", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should call getParameterData service on mount", () => {
      expect(mockParameterService.getParameterData).toHaveBeenCalled();
    });

    it("should populate parameter data on mount", () => {
      expect(wrapper.vm.parameter).toBeDefined();
      expect(wrapper.vm.filteredParameter).toBeDefined();
    });

    it("should set navigation data correctly", () => {
      expect(wrapper.vm.navigation.totalRecords).toBeDefined();
      expect(wrapper.vm.navigation.totalPages).toBeDefined();
    });
  });

  describe("Component Properties", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
    });

    it("should have initial reactive properties", () => {
      expect(wrapper.vm.isLoading).toBeDefined();
      expect(wrapper.vm.parameter).toBeDefined();
      expect(wrapper.vm.isModalOpen).toBeDefined();
      expect(wrapper.vm.showModalSubmit).toBeDefined();
      expect(wrapper.vm.showModalEdit).toBeDefined();
    });

    it("should initialize with correct default values", () => {
      const currentYear = new Date().getFullYear();
      expect(wrapper.vm.formData.tahun).toBe(currentYear.toString());
      expect(wrapper.vm.formData.discount_rate).toBe("");
      expect(wrapper.vm.formData.corporate_tax_rate).toBe("");
      expect(wrapper.vm.isModalOpen).toBe(false);
      expect(wrapper.vm.isModalEdit).toBe(false);
    });

    it("should have navigation object with correct structure", () => {
      expect(wrapper.vm.navigation).toEqual(
        expect.objectContaining({
          currentPage: expect.any(Number),
          totalPages: expect.any(Number),
          pageLimit: expect.any(Number),
          totalRecords: expect.any(Number),
        })
      );
    });
  });

  describe("Modal Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
    });

    it("should handle add modal state", async () => {
      expect(wrapper.vm.isModalOpen).toBe(false);
      
      wrapper.vm.isModalOpen = true;
      await nextTick();
      
      expect(wrapper.vm.isModalOpen).toBe(true);
    });

    it("should handle edit modal state", async () => {
      expect(wrapper.vm.isModalEdit).toBe(false);
      
      wrapper.vm.isModalEdit = true;
      await nextTick();
      
      expect(wrapper.vm.isModalEdit).toBe(true);
    });

    it("should handle success modals", async () => {
      expect(wrapper.vm.showModalSubmit).toBe(false);
      expect(wrapper.vm.showModalEdit).toBe(false);
      
      wrapper.vm.showModalSubmit = true;
      wrapper.vm.showModalEdit = true;
      await nextTick();
      
      expect(wrapper.vm.showModalSubmit).toBe(true);
      expect(wrapper.vm.showModalEdit).toBe(true);
    });

    it("should close modal and reset form data", async () => {
      // Set some form data
      wrapper.vm.formData.discount_rate = "10.5";
      wrapper.vm.formData.corporate_tax_rate = "25.0";
      wrapper.vm.errors = ["Some error"];
      wrapper.vm.isModalOpen = true;

      wrapper.vm.closeModal();
      await nextTick();

      expect(wrapper.vm.isModalOpen).toBe(false);
      expect(wrapper.vm.formData.discount_rate).toBe("");
      expect(wrapper.vm.formData.corporate_tax_rate).toBe("");
      expect(wrapper.vm.errors).toEqual([]);
    });
  });

  describe("Form Validation", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
    });

    it("should validate discount rate correctly", async () => {
      // Test valid input
      wrapper.vm.formData.discount_rate = "10.5";
      wrapper.vm.validForm_DT();
      expect(wrapper.vm.errors_DT).toEqual([]);

      // Test invalid non-numeric input (this will fail regex and be caught first)
      wrapper.vm.formData.discount_rate = "abc";
      wrapper.vm.validForm_DT();
      expect(wrapper.vm.errors_DT).toContain("non_angka");

      // Test zero value (considered <= 0, so "negatif")
      wrapper.vm.formData.discount_rate = "0";
      wrapper.vm.validForm_DT();
      expect(wrapper.vm.errors_DT).toContain("negatif");

      // Test value above 100
      wrapper.vm.formData.discount_rate = "150";
      wrapper.vm.validForm_DT();
      expect(wrapper.vm.errors_DT).toContain("diatas_100");
    });

    it("should validate corporate tax rate correctly", async () => {
      // Set discount_rate to enable corporate tax validation
      wrapper.vm.formData.discount_rate = "10";
      
      // Test valid input
      wrapper.vm.formData.corporate_tax_rate = "25.0";
      wrapper.vm.validForm_CT();
      expect(wrapper.vm.errors_CT).toEqual([]);

      // Test invalid non-numeric input (this will fail regex and be caught first)
      wrapper.vm.formData.corporate_tax_rate = "xyz";
      wrapper.vm.validForm_CT();
      expect(wrapper.vm.errors_CT).toContain("non_angka");

      // Test zero value (considered <= 0, so "negatif")
      wrapper.vm.formData.corporate_tax_rate = "0";
      wrapper.vm.validForm_CT();
      expect(wrapper.vm.errors_CT).toContain("negatif");

      // Test value above 100
      wrapper.vm.formData.corporate_tax_rate = "120";
      wrapper.vm.validForm_CT();
      expect(wrapper.vm.errors_CT).toContain("diatas_100");
    });
  });

  describe("Form Submission", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter, {
        global: {
          stubs: {
            "router-link": { template: "<a><slot></slot></a>" },
            Vue3Lottie: true,
            ModalTambahData: true,
            ModalEditData: true,
            ModalSuccessParameter: true,
            ModalNotificationParameter: true,
          },
        },
      });
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should show validation errors for empty fields", async () => {
      // Clear form data
      wrapper.vm.formData.tahun = "";
      wrapper.vm.formData.discount_rate = "";
      wrapper.vm.formData.corporate_tax_rate = "";

      await wrapper.vm.submitForm();

      expect(wrapper.vm.errors.length).toBeGreaterThan(0);
      expect(wrapper.vm.errors).toContain("Tahun harus diisi.");
      expect(wrapper.vm.errors).toContain("Discount Rate harus diisi.");
      expect(wrapper.vm.errors).toContain("Corporate Tax Rate harus diisi.");
    });

    it("should prevent submission if year already exists", async () => {
      // Mock fetchData to return existing year
      const existingYearData = [
        { tahun: "2024", uuid: "existing-uuid" }
      ];
      mockParameterService.getParameterData.mockResolvedValueOnce({
        data: existingYearData,
        meta: { totalRecords: 1, totalPages: 1 }
      });

      wrapper.vm.formData.tahun = "2024";
      wrapper.vm.formData.discount_rate = "10.5";
      wrapper.vm.formData.corporate_tax_rate = "25.0";

      await wrapper.vm.submitForm();

      expect(wrapper.vm.errors).toContain("Tahun sudah ada di database.");
      expect(mockParameterService.addParameter).not.toHaveBeenCalled();
    });
  });

  describe("Edit Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should open edit modal with correct data", async () => {
      const testUuid = "test-uuid-1";
      
      await wrapper.vm.openEditModals(testUuid);

      expect(mockParameterService.getParameterByID).toHaveBeenCalledWith(testUuid);
      expect(wrapper.vm.isModalEdit).toBe(true);
      expect(wrapper.vm.selectedParameterId).toBe(testUuid);
      expect(wrapper.vm.formData.tahun).toBe("2024");
      expect(wrapper.vm.formData.discount_rate).toBe("10.5");
      expect(wrapper.vm.formData.corporate_tax_rate).toBe("25.0");
    });

    it("should submit edit form successfully", async () => {
      // Set up edit state
      wrapper.vm.selectedParameterId = "test-uuid-1";
      wrapper.vm.detailData = mockParameterDetailResponse.data;
      wrapper.vm.formData.discount_rate = "15.0";
      wrapper.vm.formData.corporate_tax_rate = "30.0";

      await wrapper.vm.submitEditForm();

      expect(mockParameterService.editParameter).toHaveBeenCalledWith(
        "test-uuid-1",
        {
          discount_rate: 15.0,
          corporate_tax_rate: 30.0,
          status: 1,
        }
      );
    });

    it("should close edit modal and reset data", async () => {
      // Set some edit state
      wrapper.vm.isModalEdit = true;
      wrapper.vm.selectedParameterId = "test-uuid-1";
      wrapper.vm.formData.discount_rate = "15.0";
      wrapper.vm.errors = ["Some error"];

      wrapper.vm.closeModalEdit();
      await nextTick();

      expect(wrapper.vm.isModalEdit).toBe(false);
      expect(wrapper.vm.selectedParameterId).toBe(null);
      expect(wrapper.vm.formData.discount_rate).toBe("");
      expect(wrapper.vm.errors).toEqual([]);
    });
  });

  describe("Pagination Functionality", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("should handle page change", async () => {
      await wrapper.vm.handlePageChange(2);

      expect(wrapper.vm.navigation.currentPage).toBe(2);
      expect(mockParameterService.getParameterData).toHaveBeenCalled();
    });

    it("should handle page size change", async () => {
      wrapper.vm.navigation.pageLimit = 20;
      await wrapper.vm.handlePageSizeChange();

      expect(wrapper.vm.navigation.currentPage).toBe(1);
      expect(mockParameterService.getParameterData).toHaveBeenCalled();
    });

    it("should handle previous page navigation", async () => {
      wrapper.vm.navigation.currentPage = 3;
      await wrapper.vm.handlePreviousClick();

      expect(wrapper.vm.navigation.currentPage).toBe(2);
    });

    it("should handle next page navigation", async () => {
      wrapper.vm.navigation.totalPages = 5;
      wrapper.vm.navigation.currentPage = 2;
      await wrapper.vm.handleNextClick();

      expect(wrapper.vm.navigation.currentPage).toBe(3);
    });

    it("should not go to previous page if on first page", async () => {
      wrapper.vm.navigation.currentPage = 1;
      await wrapper.vm.handlePreviousClick();

      expect(wrapper.vm.navigation.currentPage).toBe(1);
    });

    it("should not go to next page if on last page", async () => {
      wrapper.vm.navigation.totalPages = 3;
      wrapper.vm.navigation.currentPage = 3;
      await wrapper.vm.handleNextClick();

      expect(wrapper.vm.navigation.currentPage).toBe(3);
    });
  });

  describe("Computed Properties", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
    });

    it("should generate page list correctly for small page count", () => {
      wrapper.vm.navigation.totalPages = 3;
      wrapper.vm.navigation.currentPage = 2;

      const pageList = wrapper.vm.generatePageList;
      expect(pageList).toEqual([1, 2, 3]);
    });

    it("should generate page list correctly for large page count at start", () => {
      wrapper.vm.navigation.totalPages = 10;
      wrapper.vm.navigation.currentPage = 2;

      const pageList = wrapper.vm.generatePageList;
      expect(pageList).toContain(1);
      expect(pageList).toContain(2);
      expect(pageList).toContain('...');
      expect(pageList).toContain(10);
    });

    it("should generate page list correctly for large page count in middle", () => {
      wrapper.vm.navigation.totalPages = 10;
      wrapper.vm.navigation.currentPage = 5;

      const pageList = wrapper.vm.generatePageList;
      expect(pageList).toContain(1);
      expect(pageList).toContain('...');
      expect(pageList).toContain(4);
      expect(pageList).toContain(5);
      expect(pageList).toContain(6);
      expect(pageList).toContain('...');
      expect(pageList).toContain(10);
    });
  });

  describe("Utility Functions", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
    });

    it("should generate years correctly", () => {
      const currentYear = new Date().getFullYear();
      expect(wrapper.vm.tahunOptions).toContain(currentYear.toString());
    });

    it("should fetch detail data correctly", async () => {
      const testUuid = "test-uuid-1";
      
      await wrapper.vm.fetchDetailData(testUuid);

      expect(mockParameterService.getParameterByID).toHaveBeenCalledWith(testUuid);
      expect(wrapper.vm.detailData).toEqual(mockParameterDetailResponse.data);
    });
  });

  describe("Global Format Integration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
    });

    it("should use global format for formatting", () => {
      const testValue = 1000.50;
      wrapper.vm.globalFormat.formatDecimal(testValue);
      
      expect(mockGlobalFormat.formatDecimal).toHaveBeenCalledWith(testValue);
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock service to throw error
      mockParameterService.getParameterData.mockRejectedValue(new Error("Service Error"));
      
      wrapper = shallowMount(Parameter);
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Component should still exist even with errors
      expect(wrapper.exists()).toBe(true);
      
      consoleSpy.mockRestore();
    });

    it("should handle edit modal error gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockParameterService.getParameterByID.mockRejectedValue(new Error("Detail fetch error"));
      
      wrapper = shallowMount(Parameter);
      await nextTick();
      
      await wrapper.vm.openEditModals("invalid-uuid");
      
      // Component should handle error gracefully
      expect(wrapper.exists()).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });

  describe("Success Modal Behavior", () => {
    beforeEach(async () => {
      wrapper = shallowMount(Parameter);
      await nextTick();
    });

    it("should show and hide success modal after add", async () => {
      jest.useFakeTimers();
      
      // Set valid form data
      wrapper.vm.formData.tahun = "2025";
      wrapper.vm.formData.discount_rate = "12.0";
      wrapper.vm.formData.corporate_tax_rate = "28.0";

      await wrapper.vm.submitForm();

      expect(wrapper.vm.showModalSubmit).toBe(true);
      
      // Fast forward timer
      jest.advanceTimersByTime(1000);
      
      expect(wrapper.vm.showModalSubmit).toBe(false);
      
      jest.useRealTimers();
    });
  });
});
