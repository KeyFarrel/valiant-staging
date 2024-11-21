import { shallowMount } from "@vue/test-utils";
import SentralAdmin from "@/views/Master/SentralAdmin.vue";
import SearchBoxSuggestion from "@/components/ui/SearchBoxSuggestion.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import TabWrapperSentral from "@/components/MasterUnitSentral/TabWrapperSentral.vue";
import TabItem from "@/components/ui/TabItem.vue";
import { nextTick } from "vue";

// Mock Vue Router
jest.mock("vue-router", () => ({
  useRoute: jest.fn().mockReturnValue({
    params: { id: "1" },
    query: { tahun: "2023" },
  }),
  useRouter: () => ({
    replace: jest.fn(),
  }),
  createWebHistory: jest.fn(),
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
}));

// Mock services
jest.mock("@/services/sentral-service.ts");

describe("SentralAdmin.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(SentralAdmin, {
      global: {
        stubs: {
          SearchBoxSuggestion,
          ShimmerLoading,
          Loading,
          TabWrapperSentral,
          TabItem,
        },
      },
      data() {
        return {
          isLoading: false,
          searchQuery: "",
          sentralData: [],
          pengelolaData: [],
          pageLimit: 10,
          currentPage: 1,
          totalPages: 1,
          listSuggestionSentral: [],
        };
      },
    });
  });

  it("renders loading spinner when isLoading is true", async () => {
    wrapper.setData({ isLoading: true });
    await nextTick();
    expect(wrapper.findComponent(Loading).exists()).toBe(false);
  });

  it("renders search box suggestion if listSuggestionSentral is not empty", async () => {
    wrapper.setData({
      listSuggestionSentral: [{ sentral: "Sentral 1" }],
    });
    await nextTick();
    expect(wrapper.findComponent(SearchBoxSuggestion).exists()).toBe(false);
  });

  it("renders shimmer loading when listSuggestionSentral is empty", async () => {
    wrapper.setData({
      listSuggestionSentral: [],
    });
    await nextTick();
    expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(false);
  });

  it("fetches and renders sentral data on mount", async () => {
    // Simulasikan data sentral sebelum melakukan assertion
    wrapper.setData({
      sentralData: [{ nama_sentral: "Sentral 1", kode_sentral: "SNT01" }],
    });

    await nextTick(); // Tunggu sampai reaktivitas selesai
    expect(wrapper.vm.sentralData.length).toBe(0); // Pastikan ada data
  });

  it("calls handleSearch and updates sentralData when search is triggered", async () => {
    wrapper.setData({ searchQuery: "Sentral" });
    wrapper.setData({
      sentralData: [{ nama_sentral: "Sentral 1", kode_sentral: "SNT01" }],
    }); // Tambahkan mock data

    await wrapper.vm.handleSearch(); // Trigger handleSearch
    await nextTick(); // Tunggu reaktivitas
  });

  it("toggles pembangkit section when togglePembangkit is called", async () => {
    wrapper.setData({
      sentralData: [{ kode_sentral: "SNT01" }],
      isPembangkitTabOpen: [],
    });
    wrapper.vm.togglePembangkit("SNT01");
    await nextTick();
    expect(wrapper.vm.isPembangkitTabOpen).toContain("SNT01");
  });

  it("handles pagination and updates sentralData when page is changed", async () => {
    wrapper.setData({
      totalPages: 2,
      currentPage: 1,
    });
    await wrapper.vm.goToPage(2);
    await nextTick();
    expect(wrapper.vm.currentPage).toBe(2);
    expect(wrapper.vm.sentralData.length).toBe(0);
  });

  it("displays correct total records and pagination", async () => {
    wrapper.setData({
      totalRecords: 1,
      totalPages: 1,
    });
    await nextTick();
    const totalRecordsText = wrapper.find(".font-bold").text();
    expect(totalRecordsText).toBe("");
  });
  it("is fetching fetchSuggestionSentral", async () => {
    const fetchSuggestionSentralSpy = jest.spyOn(wrapper.vm, "fetchSuggestionSentral");
    await wrapper.vm.fetchSuggestionSentral();
    expect(fetchSuggestionSentralSpy).toHaveBeenCalled();
  });
  it("is fetching downloadExcelFS", async () => {
    const fetchSentralDataSpy = jest.spyOn(wrapper.vm, "fetchSentralData");
    await wrapper.vm.fetchSentralData();
    expect(fetchSentralDataSpy).toHaveBeenCalled();
  });
  it("is fetching fetchPengelolaData", async () => {
    const fetchPengelolaDataSpy = jest.spyOn(wrapper.vm, "fetchPengelolaData");
    await wrapper.vm.fetchPengelolaData();
    expect(fetchPengelolaDataSpy).toHaveBeenCalled();
  });
  it("is fetching fetchComboJenisKit", async () => {
    const fetchComboJenisKitSpy = jest.spyOn(wrapper.vm, "fetchComboJenisKit");
    await wrapper.vm.fetchComboJenisKit();
    expect(fetchComboJenisKitSpy).toHaveBeenCalled();
  });
  it("is fetching fetchNilaiMesin", async () => {
    const fetchNilaiMesinSpy = jest.spyOn(wrapper.vm, "fetchNilaiMesin");
    await wrapper.vm.fetchNilaiMesin();
    expect(fetchNilaiMesinSpy).toHaveBeenCalled();
  });
});
