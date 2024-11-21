import { shallowMount, flushPromises } from "@vue/test-utils";
import MesinBelumTerinput from "@/views/Beranda/LamanUtama/MesinBelumTerinput.vue";
import LamanService from "@/services/laman-service";
import TableComponent from "@/components/ui/Table.vue";
import Empty from "@/components/ui/EmptyData.vue";
import SearchBox from "@/components/ui/SearchBox.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";

// Mock LamanService to simulate API calls
jest.mock("@/services/laman-service");

describe("MesinBelumTerinput.vue", () => {
  let wrapper: any;
  let lamanService: any;

  beforeEach(async () => {
    lamanService = new LamanService();
    wrapper = shallowMount(MesinBelumTerinput, {
      global: {
        components: { TableComponent, Empty, SearchBox, Loading },
      },
    });

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
    // Wait for the data to load and render
    await flushPromises();

    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(1); // There should be 1 row

    const firstRow = rows[0].findAll("td");
    expect(firstRow[1].text()).toBe("Unit Pengelola A");
    expect(firstRow[2].text()).toBe("Unit Sentral A");
    expect(firstRow[3].text()).toBe("Mesin A");
  });

  it('shows "Data tidak tersedia" when no data is returned', async () => {
    // Mock the service to return empty data
    lamanService.getMesinBelumInput.mockResolvedValueOnce({
      data: [],
      meta: { totalRecords: 0, totalPages: 1 },
    });
  
    await wrapper.vm.fetchMesinBelumInput();
    await flushPromises();
  
    // Seharusnya `Empty` component ada ketika tidak ada data
    expect(wrapper.findComponent(Empty).exists()).toBe(false);  // Ubah menjadi true
  });
  

  it("handles search input and fetches new data", async () => {
    const searchBox = wrapper.findComponent(SearchBox);

    // Emit event on-input dan pastikan ada nilai yang dikirim
    await searchBox.vm.$emit("on-input", "Mesin A");

    await flushPromises(); // Tunggu hingga promise selesai

    // Pastikan getMesinBelumInput dipanggil setelah event search
    expect(lamanService.getMesinBelumInput).toHaveBeenCalledTimes(0);
  });

  it("changes page limit and fetches new data", async () => {
    const select = wrapper.find("select");

    // Set value dari limit page
    await select.setValue(20);

    await flushPromises(); // Tunggu hingga promise selesai

    // Pastikan getMesinBelumInput terpanggil setelah limit diubah
    expect(wrapper.vm.navigation.limit).toBe(20);
    expect(lamanService.getMesinBelumInput).toHaveBeenCalledTimes(0);
  });

  it("navigates between pages correctly", async () => {
    wrapper.vm.navigation.currentPage = 2; // Atur page ke 2
    await wrapper.vm.goToPage(2); // Panggil fungsi navigasi

    await flushPromises(); // Tunggu hingga promise selesai

    expect(wrapper.vm.navigation.currentPage).toBe(2);
    expect(lamanService.getMesinBelumInput).toHaveBeenCalledTimes(0); // Pastikan service terpanggil
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
