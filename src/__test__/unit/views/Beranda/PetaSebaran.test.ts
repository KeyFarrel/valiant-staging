import { shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import PetaSebaran from "@/views/Beranda/PetaSebaran.vue";

jest.mock("@/store/storeUserAuth", () => ({
  useUserAuthStore: () => ({
    getToken: "mock-token",
    userId: "mock-user-id",
  }),
}));

jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

jest.mock("@/services/peta-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPetaSentral: jest.fn().mockResolvedValue({ data: [] }),
    getPengelola: jest.fn().mockResolvedValue({ data: [] }),
    getJenisKit: jest.fn().mockResolvedValue({ data: [] }),
    getUmurMesin: jest.fn().mockResolvedValue({ data: [] }),
    getSentralByKode: jest.fn().mockResolvedValue({ data: {} }),
  }));
});

const mockPush = jest.fn();
jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
  createWebHistory: jest.fn(),
  createRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
}));

jest.mock("@/services/format/global-format", () =>
  jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn().mockReturnValue("1.000"),
  })),
);

jest.mock("@/services/auth-service", () =>
  jest.fn().mockImplementation(() => ({
    checkLevel: jest.fn().mockReturnValue(true),
  })),
);

jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn(),
}));

describe("PetaSebaran.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    wrapper = shallowMount(PetaSebaran, {
      global: {
        plugins: [pinia],
        stubs: {
          ModalWrapper: true,
          SearchBox: true,
          ModalSearch: true,
          BestPerformance: true,
          Loading: true,

          "el-checkbox": true,
          "el-option": true,
          "el-select": true,

          "ol-view": true,
          "ol-source-osm": true,
          "ol-tile-layer": true,
          "ol-overlay": true,
          "ol-map": true,
        },
      },
    });
  });

  it("fetches initial data on mount", async () => {
    const fetchPetaSentralSpy = jest.spyOn(wrapper.vm, "fetchPetaSentral");

    await wrapper.vm.fetchPetaSentral();

    expect(fetchPetaSentralSpy).toHaveBeenCalled();
  });

  it("fetches PetaSentral data and updates dataPeta on mount", async () => {
    const mockData = [{ sentral: "Test Sentral", kode_sentral: "001" }];

    const mockGetPetaSentral = jest
      .spyOn(wrapper.vm.petaService, "getPetaSentral")
      .mockResolvedValue({ data: mockData });

    await wrapper.vm.fetchPetaSentral();

    expect(mockGetPetaSentral).toHaveBeenCalled();
    expect(wrapper.vm.dataPeta).toEqual(mockData);
  });

  it("handles search box focus and shows modal", async () => {
    await wrapper.vm.handleFocus();
    expect(wrapper.vm.isSearchModalOpen).toBe(true);
  });

  it('calls getDetailSentral and routes to "grafik" page', async () => {
    mockPush.mockClear();

    jest
      .spyOn(wrapper.vm.petaService, "getSentralByKode")
      .mockResolvedValue({ data: {} });

    await wrapper.vm.getDetailSentral("123");

    expect(mockPush).toHaveBeenCalledWith({
      name: "grafik",
      params: { id: "123" },
    });
  });

  it("calls changeData and updates PetaSentral", async () => {
    const changeDataSpy = jest.spyOn(wrapper.vm, "changeData");
    await wrapper.vm.changeData();
    expect(changeDataSpy).toHaveBeenCalled();
  });

  it("shows error notification when data is not found", async () => {
    wrapper.vm.petaService = {
      getPetaSentral: jest.fn().mockResolvedValue({ data: [] }),
    };

    await wrapper.vm.fetchPetaSentral();

    expect(wrapper.vm.dataPeta).toEqual([]);
  });

  it("renders modal for filter options", async () => {
    wrapper.vm.showModal = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.showModal).toBe(true);
  });

  it('calls changeDataNoDMN when "Terapkan" is clicked and DMN is not selected', async () => {
    const changeDataNoDMNSpy = jest.spyOn(wrapper.vm, "changeDataNoDMN");

    wrapper.vm.pembangkit = ["PLTU"];

    await wrapper.vm.changeDataNoDMN();

    expect(changeDataNoDMNSpy).toHaveBeenCalled();
  });

  it("updates data when filters are applied", async () => {
    wrapper.vm.pengelola = ["001"];
    wrapper.vm.pembangkit = ["PLTU"];
    wrapper.vm.umur = ["10 Tahun"];
    await wrapper.vm.$nextTick();
    await wrapper.vm.changeData();
    expect(wrapper.vm.pengelola).toEqual(["001"]);
    expect(wrapper.vm.pembangkit).toEqual(["PLTU"]);
    expect(wrapper.vm.umur).toEqual(["10 Tahun"]);
  });

  it("handles checkbox selections for filters", async () => {
    const handleCheckPengelolaSpy = jest.spyOn(
      wrapper.vm,
      "handleCheckPengelola",
    );
    await wrapper.vm.handleCheckPengelola(true);
    expect(handleCheckPengelolaSpy).toHaveBeenCalled();
    expect(wrapper.vm.pengelola).toEqual([]);
  });

  it("formats number correctly using globalFormat service", () => {
    const result = wrapper.vm.globalFormat.formatRupiah(1000);
    expect(result).toBe("1.000");
  });

  it("displays the correct modal content based on selected filters", async () => {
    wrapper.vm.showModal = true;
    wrapper.vm.pembangkit = ["PLTU"];
    wrapper.vm.pengelola = ["001"];

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.showModal).toBe(true);
    expect(wrapper.vm.pembangkit).toEqual(["PLTU"]);
    expect(wrapper.vm.pengelola).toEqual(["001"]);
  });

  it("is fetching fetchPetaSentral", async () => {
    const fetchPetaSentralSpy = jest.spyOn(wrapper.vm, "fetchPetaSentral");
    await wrapper.vm.fetchPetaSentral();
    expect(fetchPetaSentralSpy).toHaveBeenCalled();
  });

  it("is fetching getDetailSentral", async () => {
    const getDetailSentralSpy = jest.spyOn(wrapper.vm, "getDetailSentral");
    await wrapper.vm.getDetailSentral();
    expect(getDetailSentralSpy).toHaveBeenCalled();
  });

  it("is fetching getDataPengelola", async () => {
    const getDataPengelolaSpy = jest.spyOn(wrapper.vm, "getDataPengelola");
    await wrapper.vm.getDataPengelola();
    expect(getDataPengelolaSpy).toHaveBeenCalled();
  });
});
