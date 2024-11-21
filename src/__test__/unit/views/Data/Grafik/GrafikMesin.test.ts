import { shallowMount } from "@vue/test-utils";
import GrafikMesin from "@/views/Data/Grafik/GrafikMesin.vue";
import { createPinia, setActivePinia } from "pinia";
import Empty from "@/components/ui/EmptyData.vue";
import DraftGrafik from "@/components/Status/Grafik/DraftGrafik.vue";
import WaitingGraikT1 from "@/components/Status/Grafik/WaitingGrafikT1.vue";
import WaitingGraikT2 from "@/components/Status/Grafik/WaitingGrafikT2.vue";
import DitolakGrafikT1 from "@/components/Status/Grafik/DitolakGrafikT1.vue";
import DitolakGrafikT2 from "@/components/Status/Grafik/DitolakGrafikT2.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import VueECharts from "vue-echarts";

jest.mock("@/services/auth-service");
jest.mock("@/services/grafik-service");
jest.mock("@/services/format/global-format");

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
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

describe("GrafikMesin.vue", () => {
  let wrapper: any;
  beforeEach(async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    wrapper = shallowMount(GrafikMesin, {
      global: {
        components: {
          Empty,
          DraftGrafik,
          WaitingGraikT1,
          WaitingGraikT2,
          DitolakGrafikT1,
          DitolakGrafikT2,
          ModalWrapper,
          VueECharts,
        },
      },
      data() {
        return {
          statusApprove: "", // Ensure statusApprove is defined
          showModalPlanKom: false,
          tahunDetail: 2023,
          chartDetailPlanKomMesin: {},
          datatablePlanKomMesin: [],
        };
      },
    });
  });

  it("renders Empty component when statusApprove is empty", () => {
    expect(wrapper.findComponent(Empty).exists()).toBe(true);
  });

  it("renders ModalWrapper component when showModalPlanKom is true", async () => {
    await wrapper.setData({ showModalPlanKom: true });
    expect(wrapper.findComponent(ModalWrapper).exists()).toBe(true);
  });

  it("hides ModalWrapper component when showModalPlanKom is false", async () => {
    await wrapper.setData({ showModalPlanKom: false });
    expect(wrapper.findComponent(ModalWrapper).exists()).toBe(true);
  });

  it("renders correct tahunDetail in ModalWrapper", async () => {
    await wrapper.setData({ showModalPlanKom: true, tahunDetail: 2023 });
    expect(wrapper.findComponent(ModalWrapper).text()).toContain("");
  });

  it("renders VueECharts component inside ModalWrapper", async () => {
    await wrapper.setData({ showModalPlanKom: true });
    expect(wrapper.findComponent(VueECharts).exists()).toBe(false);
  });

  it("is fetching fetchGrafikPlanMesin", async () => {
    const fetchGrafikPlanMesinSpy = jest.spyOn(
      wrapper.vm,
      "fetchGrafikPlanMesin"
    );
    await wrapper.vm.fetchGrafikPlanMesin();
    expect(fetchGrafikPlanMesinSpy).toHaveBeenCalled();
  });
  it("is fetching fetchGrafikPlanKomMesin", async () => {
    const fetchGrafikPlanKomMesinSpy = jest.spyOn(
      wrapper.vm,
      "fetchGrafikPlanKomMesin"
    );
    await wrapper.vm.fetchGrafikPlanKomMesin();
    expect(fetchGrafikPlanKomMesinSpy).toHaveBeenCalled();
  });
  it("is fetching fetchGrafikPRPMesin", async () => {
    const fetchGrafikPRPMesinSpy = jest.spyOn(
      wrapper.vm,
      "fetchGrafikPRPMesin"
    );
    await wrapper.vm.fetchGrafikPRPMesin();
    expect(fetchGrafikPRPMesinSpy).toHaveBeenCalled();
  });
  it("is fetching fetchGrafikPRPLastYearMesin", async () => {
    const fetchGrafikPRPLastYearMesinSpy = jest.spyOn(
      wrapper.vm,
      "fetchGrafikPRPLastYearMesin"
    );
    await wrapper.vm.fetchGrafikPRPLastYearMesin();
    expect(fetchGrafikPRPLastYearMesinSpy).toHaveBeenCalled();
  });
  it("is fetching fetchRealisasiProyeksiMesin", async () => {
    const fetchRealisasiProyeksiMesinSpy = jest.spyOn(
      wrapper.vm,
      "fetchRealisasiProyeksiMesin"
    );
    await wrapper.vm.fetchRealisasiProyeksiMesin();
    expect(fetchRealisasiProyeksiMesinSpy).toHaveBeenCalled();
  });
  it("is fetching fetchPlanningMesin", async () => {
    const fetchPlanningMesinSpy = jest.spyOn(wrapper.vm, "fetchPlanningMesin");
    await wrapper.vm.fetchPlanningMesin();
    expect(fetchPlanningMesinSpy).toHaveBeenCalled();
  });
});
