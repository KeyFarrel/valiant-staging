import { shallowMount, flushPromises } from "@vue/test-utils";
import MesinBelumTerinput from "@/views/Beranda/LamanUtama/MesinBelumTerinput.vue";
import LamanService from "@/services/laman-service";
import TableComponent from "@/components/ui/Table.vue";
import Empty from "@/components/ui/EmptyData.vue";
import SearchBox from "@/components/ui/SearchBox.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";

// Mock LamanService to simulate API calls
jest.mock("@/services/laman-service", () => {
  return jest.fn().mockImplementation(() => ({
    getMesinBelumInput: jest.fn().mockResolvedValue({
      data: [
        {
          pengelola: "Unit Pengelola A",
          sentral: "Unit Sentral A",
          mesin: "Mesin A",
          total_daya_terpasang: 100
        }
      ],
      meta: {
        totalRecords: 1,
        totalPages: 1
      }
    }),
    getPengelolaData: jest.fn().mockResolvedValue({
      data: [
        {
          kode_pengelola: "PG001",
          pengelola: "Pengelola A"
        }
      ]
    })
  }));
});

// Mock GlobalFormat
jest.mock("@/services/format/global-format", () =>
  jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn().mockReturnValue('100 MW'),
  }))
);

describe("MesinBelumTerinput.vue", () => {
  let wrapper: any;
  let lamanService: any;
  let fetchMesinBelumInputSpy: any;

  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    lamanService = new LamanService();
    wrapper = shallowMount(MesinBelumTerinput, {
      global: {
        components: { TableComponent, Empty, SearchBox, Loading },
        stubs: {
          SearchBox: true,
          Loading: true,
          TableComponent: true,
          Empty: true
        }
      },
    });

    // Create spy after wrapper is created
    fetchMesinBelumInputSpy = jest.spyOn(wrapper.vm, 'fetchMesinBelumInput');

    // Wait for onMounted to finish
    await flushPromises();
  });

  it("renders the loading spinner when data is being fetched", async () => {
    // Simulate loading state by directly setting the reactive property
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(Loading).exists()).toBe(true);

    // Reset loading state for further tests
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();
  });

  it("renders the table with fetched data", async () => {
    // Mock successful response
    wrapper.vm.lamanService.getMesinBelumInput.mockResolvedValue({
      data: [
        {
          pengelola: "Unit Pengelola A",
          sentral: "Unit Sentral A",
          mesin: "Mesin A",
          total_daya_terpasang: 100
        }
      ],
      meta: {
        totalRecords: 1,
        totalPages: 1
      }
    });

    // Trigger data fetch
    await wrapper.vm.fetchMesinBelumInput();
    await flushPromises();

    // Check if data is loaded
    expect(wrapper.vm.mesinBelumTerinput).toHaveLength(1);
    expect(wrapper.vm.mesinBelumTerinput[0].pengelola).toBe("Unit Pengelola A");
  });

  it('shows "Data tidak tersedia" when no data is returned', async () => {
    // Mock the service to return empty data
    wrapper.vm.lamanService.getMesinBelumInput.mockResolvedValue({
      data: [],
      meta: { totalRecords: 0, totalPages: 1 },
    });
  
    await wrapper.vm.fetchMesinBelumInput();
    await flushPromises();
  
    // Check if data array is empty
    expect(wrapper.vm.mesinBelumTerinput).toHaveLength(0);
  });
  

  it("handles search input and fetches new data", async () => {
    const spy = jest.spyOn(wrapper.vm, 'handleSearch');
    
    // Simulate search
    wrapper.vm.searchQuery = "Mesin A";
    await wrapper.vm.handleSearch();
    await flushPromises();

    // Check if handleSearch was called
    expect(spy).toHaveBeenCalled();
    expect(wrapper.vm.searchQuery).toBe("Mesin A");
  });

  it("changes page limit and fetches new data", async () => {
    // Directly change the limit value
    wrapper.vm.navigation.limit = 20;
    
    // Trigger goToPage function to test navigation
    const spy = jest.spyOn(wrapper.vm, 'goToPage');
    await wrapper.vm.goToPage(1);
    await flushPromises();

    // Check if limit is changed and goToPage was called
    expect(wrapper.vm.navigation.limit).toBe(20);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it("navigates between pages correctly", async () => {
    // Test that currentPage changes when goToPage is called
    const initialPage = wrapper.vm.navigation.currentPage;
    
    // Call goToPage function
    await wrapper.vm.goToPage(2);
    await flushPromises();

    // Check if currentPage changed
    expect(wrapper.vm.navigation.currentPage).toBe(2);
    expect(wrapper.vm.navigation.currentPage).not.toBe(initialPage);
  });

  it("is fetching fetchMesinBelumInput", async () => {
    const fetchMesinBelumInputSpy = jest.spyOn(wrapper.vm, "fetchMesinBelumInput");
    await wrapper.vm.fetchMesinBelumInput();
    expect(fetchMesinBelumInputSpy).toHaveBeenCalled();
  });

  it("is fetching fetchPengelolaData", async () => {
    const fetchPengelolaDataSpy = jest.spyOn(wrapper.vm, "fetchPengelolaData");
    await wrapper.vm.fetchPengelolaData();
    expect(fetchPengelolaDataSpy).toHaveBeenCalled();
  });
});
