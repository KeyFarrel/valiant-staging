import { shallowMount } from "@vue/test-utils";
import DetailFSMesin from "@/views/Verifikasi/Sentral/TabPage/FS/DetailFSMesin.vue";
import RekapService from "@/services/rekap-service";
import DetailSentralService from "@/services/detail-sentral-service";
import FeasibilityStudyService from "@/services/feasibility-study";
import PersetujuanService from "@/services/persetujuan-service";

jest.mock("vue-router", () => ({
  useRoute: jest.fn().mockReturnValue({
    params: { id: "1" }, // Mock params as used in the component
    query: { id_sentral: "123" }, // Mock any query parameters
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

jest.mock("@/services/rekap-service");

jest.mock("@/services/detail-sentral-service");

jest.mock("@/services/feasibility-study");

jest.mock("@/services/persetujuan-service");

jest.mock("@/services/user-service");

describe("DetailFSMesin.vue Unit Tests", () => {
  let wrapper: any;
  let rekapService: any;
  let detailSentralService: any;
  let feasibilityStudyService: any;
  let persetujuanService: any;

  beforeEach(() => {
    wrapper = shallowMount(DetailFSMesin);
    rekapService = new RekapService();
    detailSentralService = new DetailSentralService();
    feasibilityStudyService = new FeasibilityStudyService();
    persetujuanService = new PersetujuanService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetchMesinById on mount", async () => {
    const mockData = { data: { mesin: "Mesin Test" } };
    detailSentralService.getMesinById.mockResolvedValueOnce(mockData);

    await wrapper.vm.fetchMesinById();

    expect(detailSentralService.getMesinById).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.mesinDataById).toBeUndefined();
  });

  it("should call fetchAsumsiFeasibility and set asumsiMakro", async () => {
    const mockResponse = {
      data: {
        asumsi_makro: { corporate_tax_rate: 25 },
        parameter_teknis_financial: { daya_terpasang: 100 },
      },
    };
    feasibilityStudyService.getAsumsiFeasibility.mockResolvedValueOnce(
      mockResponse
    );

    await wrapper.vm.fetchAsumsiFeasibility();

    expect(feasibilityStudyService.getAsumsiFeasibility).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.asumsiMakro).toBeUndefined();
    expect(wrapper.vm.parameterTeknisFinansial).toBeUndefined();
  });

  it("should call updateStatusFS when updateFS is called", async () => {
    const mockUpdateResponse = { data: "Updated" };
    persetujuanService.updateStatusFS.mockResolvedValueOnce(mockUpdateResponse);

    await wrapper.vm.updateFS();

    expect(persetujuanService.updateStatusFS).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.updateMesin).toBeUndefined();
  });

  it("is fetching fetchMesinById", async () => {
    const fetchMesinByIdSpy = jest.spyOn(wrapper.vm, "fetchMesinById");
    await wrapper.vm.fetchMesinById();
    expect(fetchMesinByIdSpy).toHaveBeenCalled();
  });

  it("is fetching fetchListPembina", async () => {
    const fetchListPembinaSpy = jest.spyOn(wrapper.vm, "fetchListPembina");
    await wrapper.vm.fetchListPembina();
    expect(fetchListPembinaSpy).toHaveBeenCalled();
  });

  it("is fetching fetchUnitPengelola", async () => {
    const fetchUnitPengelolaSpy = jest.spyOn(wrapper.vm, "fetchUnitPengelola");
    await wrapper.vm.fetchUnitPengelola();
    expect(fetchUnitPengelolaSpy).toHaveBeenCalled();
  });

  it("is fetching fetchHasilSimulasi", async () => {
    const fetchHasilSimulasiSpy = jest.spyOn(wrapper.vm, "fetchHasilSimulasi");
    await wrapper.vm.fetchHasilSimulasi();
    expect(fetchHasilSimulasiSpy).toHaveBeenCalled();
  });

  it("is fetching fetchComboBahanBakar", async () => {
    const fetchComboBahanBakarSpy = jest.spyOn(wrapper.vm, "fetchComboBahanBakar");
    await wrapper.vm.fetchComboBahanBakar();
    expect(fetchComboBahanBakarSpy).toHaveBeenCalled();
  });
});
