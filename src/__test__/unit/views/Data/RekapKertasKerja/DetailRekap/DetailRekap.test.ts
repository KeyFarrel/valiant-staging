import { shallowMount } from "@vue/test-utils";
import DetailRekap from "@/views/Data/RekapKertasKerja/DetailRekap/DetailRekap.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import InfoHeader from "@/components/ui/InfoHeader.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";

// Mock the services
jest.mock("@/services/rekap-service", () => {
  return jest.fn().mockImplementation(() => ({
    downloadEvidence: jest.fn(),
    getEvidencePath: jest.fn(),
    downloadExcelKK: jest.fn(),
  }));
});

jest.mock("@/services/detail-rekap-service", () => {
  return jest.fn().mockImplementation(() => ({
    getMesinById: jest.fn(),
    getAsumsiParameter: jest.fn(),
    getDataTeknis: jest.fn(),
    getDataFinansial: jest.fn(),
    getHasilSimulasi: jest.fn(),
    getComboBahanBakar: jest.fn(),
    getTahunRealisasi: jest.fn(),
    getPembangkitByKode: jest.fn(),
    getPengelolaData: jest.fn(),
    getTypePeriodic: jest.fn(),
  }));
});

jest.mock("@/services/user-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPembina: jest.fn(),
    getEvidencePath: jest.fn(),
    downloadExcelKK: jest.fn(),
  }));
});

// Mock the router, including createWebHistory
jest.mock("vue-router", () => ({
  useRoute: jest.fn().mockReturnValue({
    params: { id: "1" },
    query: { tahun: "2023" },
  }),
  useRouter: () => ({
    replace: jest.fn(),
  }),
  createWebHistory: jest.fn(), // Mock createWebHistory
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
}));

describe("DetailRekap.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(DetailRekap, {
      global: {
        components: {
          TabsWrapper,
          InfoHeader,
          Loading,
          ShimmerLoading,
        },
      },
    });
  });

  it("renders the loading spinner when isLoading is true", async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick(); // Pastikan reaktivitas sudah berjalan
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });

  it("renders InfoHeader with correct props when mesin data is available", async () => {
    wrapper.vm.mesin = {
      mesin: "Mesin A",
      kondisi_unit: "Baik",
      kode_jenis_pembangkit: "PLTU",
      daya_terpasang: 1000,
      daya_mampu: 900,
      tahun_operasi: "2020",
      masa_manfaat: "20",
    };
    wrapper.vm.namaPengelola = "Pengelola A";
    wrapper.vm.namaPembina = "Pembina A";
    wrapper.vm.selectedYear = 2022;
    wrapper.vm.listYear = [2020, 2023];
    wrapper.vm.listtahunRealisasi = [2020, 2021, 2022];

    await wrapper.vm.$nextTick();
    const infoHeader = wrapper.findComponent(InfoHeader);
    expect(infoHeader.exists()).toBe(true);
    expect(infoHeader.props("namaMesin")).toBe("Mesin A");
    expect(infoHeader.props("namaPengelola")).toBe("Pengelola A");
    expect(infoHeader.props("kondisiUnit")).toBe("Baik");
    expect(infoHeader.props("kodeJenisPembangkit")).toBe("PLTU");
    expect(infoHeader.props("dayaTerpasang")).toBe("1000");
    expect(infoHeader.props("dayaMampu")).toBe("900");
    expect(infoHeader.props("tahunOperasi")).toBe("2020");
    expect(infoHeader.props("umurTeknis")).toBe("20");
    expect(infoHeader.props("namaPembina")).toBe("Pembina A");
  });

  it("is fetching downloadEvidence", async () => {
    const downloadEvidenceSpy = jest.spyOn(wrapper.vm, "downloadEvidence");
    await wrapper.vm.downloadEvidence();
    expect(downloadEvidenceSpy).toHaveBeenCalled();
  });

  it("is fetching fetchMesinById", async () => {
    const fetchMesinByIdSpy = jest.spyOn(wrapper.vm, "fetchMesinById");
    await wrapper.vm.fetchMesinById();
    expect(fetchMesinByIdSpy).toHaveBeenCalled();
  });

  it("is fetching reloadDataFinansial", async () => {
    const reloadDataFinansialSpy = jest.spyOn(
      wrapper.vm,
      "reloadDataFinansial"
    );
    await wrapper.vm.reloadDataFinansial();
    expect(reloadDataFinansialSpy).toHaveBeenCalled();
  });

  it("is fetching fetchHasilSimulasi", async () => {
    const fetchHasilSimulasiSpy = jest.spyOn(wrapper.vm, "fetchHasilSimulasi");
    await wrapper.vm.fetchHasilSimulasi();
    expect(fetchHasilSimulasiSpy).toHaveBeenCalled();
  });

  it("is fetching fetchUnitPengelola", async () => {
    const fetchUnitPengelolaSpy = jest.spyOn(wrapper.vm, "fetchUnitPengelola");
    await wrapper.vm.fetchUnitPengelola();
    expect(fetchUnitPengelolaSpy).toHaveBeenCalled();
  });

  it("is fetching fetchTypePeriodic", async () => {
    const fetchTypePeriodicSpy = jest.spyOn(wrapper.vm, "fetchTypePeriodic");
    await wrapper.vm.fetchTypePeriodic();
    expect(fetchTypePeriodicSpy).toHaveBeenCalled();
  });
});
