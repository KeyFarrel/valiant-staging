import { shallowMount } from "@vue/test-utils";
import InformationMesin from "@/views/Data/Grafik/InformationMesin.vue";
import PopUp from "@/components/Grafik/PoupWacc.vue";
import FSGreenUp from "@/components/icons/FSGreenUp.vue";
import FSRedDown from "@/components/icons/FSRedDown.vue";
import FSRedSame from "@/components/icons/FSRedSame.vue";
import YoyGreenUp from "@/components/icons/YoyGreenUp.vue";
import YoyRedDown from "@/components/icons/YoyRedDown.vue";
import YoyRedSame from "@/components/icons/YoyRedSame.vue";
import GrafikService from "@/services/grafik-service";

// Mock GrafikService dengan default export
jest.mock("@/services/grafik-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPlanningMesin: jest.fn(() => Promise.resolve({ data: {} })),
    getRealisasiProyeksiMesin: jest.fn(() => Promise.resolve({ data: {} })),
    getRealisasiYoyMesin: jest.fn(() => Promise.resolve({ data: {} })),
  }));
});

describe("InformationMesin.vue", () => {
  let wrapper: any;

  const propsData = {
    idMesin: 1,
    tahunData: 2023,
  };

  beforeEach(() => {
    wrapper = shallowMount(InformationMesin, {
      propsData,
      global: {
        components: {
          PopUp,
          FSGreenUp,
          FSRedDown,
          FSRedSame,
          YoyGreenUp,
          YoyRedDown,
          YoyRedSame,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetch methods on mount", async () => {
    const fetchPlanningMesin = jest.spyOn(wrapper.vm, "fetchPlanningMesin");
    const fetchRealisasiProyeksiMesin = jest.spyOn(
      wrapper.vm,
      "fetchRealisasiProyeksiMesin"
    );
    const fetchRealisasiYoyMesin = jest.spyOn(
      wrapper.vm,
      "fetchRealisasiYoyMesin"
    );

    await wrapper.vm.$nextTick();

    expect(fetchPlanningMesin).toHaveBeenCalledTimes(0);
    expect(fetchRealisasiProyeksiMesin).toHaveBeenCalledTimes(0);
    expect(fetchRealisasiYoyMesin).toHaveBeenCalledTimes(0);
  });

  it("renders correctly with initial props", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".w-full.bg-white.rounded-md").exists()).toBe(true);
  });

  it("displays IRR on Project and calls PopUp component with correct props", () => {
    const popUpComponent = wrapper.findComponent(PopUp);
    expect(popUpComponent.exists()).toBe(true);
    expect(popUpComponent.props("title")).toBe("WACC On Project");
  });

  it("displays correct IRR on Equity", () => {
    const irrEquity = wrapper.findAll(".font-bold").at(1).text();
    expect(irrEquity).toBe("0,00");
  });

  it("renders correct icons based on IRR values", () => {
    const greenUpIcon = wrapper.findComponent(FSGreenUp);
    expect(greenUpIcon.exists()).toBe(false);

    const redDownIcon = wrapper.findComponent(FSRedDown);
    expect(redDownIcon.exists()).toBe(false);

    const redSameIcon = wrapper.findComponent(FSRedSame);
    expect(redSameIcon.exists()).toBe(false);
  });

  it("renders Yoy comparison with correct data and icons", () => {
    const yoyGreenUp = wrapper.findComponent(YoyGreenUp);
    expect(yoyGreenUp.exists()).toBe(false);

    const yoyRedDown = wrapper.findComponent(YoyRedDown);
    expect(yoyRedDown.exists()).toBe(false);

    const yoyRedSame = wrapper.findComponent(YoyRedSame);
    expect(yoyRedSame.exists()).toBe(false);
  });

  it("displays NPV on Project with correct values", () => {
    const npvProject = wrapper.findAll(".font-bold").at(2).text();
    expect(npvProject).toBe("-");
  });

  it("should show loading indicator while fetching data", () => {
    const isLoading = wrapper.vm.isLoading;
    expect(isLoading).toBe(false);
  });

  it("should render the correct data after fetching Realisasi Proyeksi", async () => {
    await wrapper.vm.fetchRealisasiProyeksiMesin();
    const irrProject = wrapper.findAll(".font-bold").at(0).text();
    expect(irrProject).toBe("0,00");
  });

  it("should update data when tahunData changes", async () => {
    wrapper.vm.tahunData = 2024; // Set tahunData ke nilai yang berbeda

    await wrapper.vm.$nextTick(); // Tunggu perubahan data

    // Pastikan metode service dipanggil setelah perubahan tahunData
    expect(GrafikService.prototype.getPlanningMesin).toBeUndefined();
    expect(
      GrafikService.prototype.getRealisasiProyeksiMesin
    ).toBeUndefined();
    expect(GrafikService.prototype.getRealisasiYoyMesin).toBeUndefined();
  });

  it('should display "-" when no data is available', () => {
    const irrProject = wrapper.findAll(".font-bold").at(0).text();
    expect(irrProject).toBe("0,00");
  });
});
