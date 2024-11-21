import { shallowMount } from "@vue/test-utils";
import PerbaruiData from "@/views/Data/RekapKertasKerja/PerbaruiData/PerbaruiData.vue";
import { createPinia, setActivePinia } from "pinia";

jest.mock("@/services/perbarui-data");
jest.mock("@/services/user-service");
jest.mock("@/services/auth-service");
jest.mock("@/services/rekap-service");
jest.mock("@/services/persetujuan-service");

jest.mock("vue-router", () => ({
  useRoute: jest.fn(() => ({
    params: { id: "1" },
  })),
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

describe("PerbaruiData.vue", () => {
  let wrapper: any;

  beforeEach(async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    wrapper = shallowMount(PerbaruiData);
  });

  // it("is fetching fetchMesinById", async () => {
  //   const fetchMesinByIdSpy = jest.spyOn(wrapper.vm, "fetchMesinById");
  //   await wrapper.vm.fetchMesinById();
  //   expect(fetchMesinByIdSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchListPembina", async () => {
  //   const fetchListPembinaSpy = jest.spyOn(wrapper.vm, "fetchListPembina");
  //   await wrapper.vm.fetchListPembina();
  //   expect(fetchListPembinaSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchCheckIntegrasi", async () => {
  //   const fetchCheckIntegrasiSpy = jest.spyOn(
  //     wrapper.vm,
  //     "fetchCheckIntegrasi"
  //   );
  //   await wrapper.vm.fetchCheckIntegrasi();
  //   expect(fetchCheckIntegrasiSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchUnitPengelola", async () => {
  //   const fetchUnitPengelolaSpy = jest.spyOn(wrapper.vm, "fetchUnitPengelola");
  //   await wrapper.vm.fetchUnitPengelola();
  //   expect(fetchUnitPengelolaSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchPersetujuanKK", async () => {
  //   const fetchPersetujuanKKSpy = jest.spyOn(wrapper.vm, "fetchPersetujuanKK");
  //   await wrapper.vm.fetchPersetujuanKK();
  //   expect(fetchPersetujuanKKSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchAsumsiParameter", async () => {
  //   const fetchAsumsiParameterSpy = jest.spyOn(
  //     wrapper.vm,
  //     "fetchAsumsiParameter"
  //   );
  //   await wrapper.vm.fetchAsumsiParameter();
  //   expect(fetchAsumsiParameterSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchTypePeriodic", async () => {
  //   const fetchTypePeriodicSpy = jest.spyOn(wrapper.vm, "fetchTypePeriodic");
  //   await wrapper.vm.fetchTypePeriodic();
  //   expect(fetchTypePeriodicSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchListTypePeriodic", async () => {
  //   const fetchListTypePeriodicSpy = jest.spyOn(
  //     wrapper.vm,
  //     "fetchListTypePeriodic"
  //   );
  //   await wrapper.vm.fetchListTypePeriodic();
  //   expect(fetchListTypePeriodicSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchComboTypePeriodic", async () => {
  //   const fetchComboTypePeriodicSpy = jest.spyOn(wrapper.vm, "fetchComboTypePeriodic");
  //   await wrapper.vm.fetchComboTypePeriodic();
  //   expect(fetchComboTypePeriodicSpy).toHaveBeenCalled();
  // });
  // it("is fetching fetchDataTeknisByPeriode", async () => {
  //   const fetchDataTeknisByPeriodeSpy = jest.spyOn(wrapper.vm, "fetchDataTeknisByPeriode");
  //   await wrapper.vm.fetchDataTeknisByPeriode();
  //   expect(fetchDataTeknisByPeriodeSpy).toHaveBeenCalled();
  // });
  it("is fetching fetchDataFinansialSimulasi1", async () => {
    const fetchDataFinansialSimulasi1Spy = jest.spyOn(wrapper.vm, "fetchDataFinansialSimulasi1");
    await wrapper.vm.fetchDataFinansialSimulasi1();
    expect(fetchDataFinansialSimulasi1Spy).toHaveBeenCalled();
  });
  it("is fetching fetchHasilSimulasi1", async () => {
    const fetchHasilSimulasi1Spy = jest.spyOn(wrapper.vm, "fetchHasilSimulasi1");
    await wrapper.vm.fetchHasilSimulasi1();
    expect(fetchHasilSimulasi1Spy).toHaveBeenCalled();
  });
  it("is fetching fetchHasilSimulasi2", async () => {
    const fetchHasilSimulasi2Spy = jest.spyOn(wrapper.vm, "fetchHasilSimulasi2");
    await wrapper.vm.fetchHasilSimulasi2();
    expect(fetchHasilSimulasi2Spy).toHaveBeenCalled();
  });
});
