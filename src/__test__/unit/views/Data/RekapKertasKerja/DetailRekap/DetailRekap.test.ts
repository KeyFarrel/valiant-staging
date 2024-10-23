import { shallowMount } from "@vue/test-utils";
import DetailRekap from "@/views/Data/RekapKertasKerja/DetailRekap/DetailRekap.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import InfoHeader from "@/components/ui/InfoHeader.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
import { flushPromises } from '@vue/test-utils'; // Import flushPromises untuk membantu dengan rendering async


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

  it("renders InfoHeader when mesin data is available", async () => {
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

    await wrapper.vm.$nextTick();
    const infoHeader = wrapper.findComponent(InfoHeader);
    expect(infoHeader.exists()).toBe(true);
  });
});
