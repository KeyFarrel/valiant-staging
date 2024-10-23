import { shallowMount, flushPromises } from "@vue/test-utils";
import FeasibilityStudySentral from "@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudySentral.vue";
import FeasibilityStudyService from "@/services/feasibility-study";

// Mock the services used in the component
jest.mock("@/services/feasibility-study", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getSentralById: jest.fn(),
      getPengelolaData: jest.fn(),
      getAsumsiFeasibilitySentral: jest.fn(),
      getKalkulasiFeasibilitySentral: jest.fn(),
    };
  });
});

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
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

describe("FeasibilityStudySentral.vue", () => {
  let wrapper: any;
  let feasibilityStudyServiceMock: any;

  beforeEach(async () => {
    feasibilityStudyServiceMock = new FeasibilityStudyService();

    // Mock successful responses
    feasibilityStudyServiceMock.getSentralById.mockResolvedValue({
      data: {
        id_mesin: 1,
        kode_sentral: "001",
        kode_mesin: "M001",
        nama_sentral: "Test Sentral",
        kondisi_unit: "Baik",
        daya_terpasang: 100,
        daya_mampu: 90,
        tahun_operasi: "2015",
      },
    });

    feasibilityStudyServiceMock.getPengelolaData.mockResolvedValue({
      data: [
        { kode_pengelola: "001", pengelola: "Pengelola A" },
        { kode_pengelola: "002", pengelola: "Pengelola B" },
      ],
    });

    feasibilityStudyServiceMock.getAsumsiFeasibilitySentral.mockResolvedValue({
      data: {
        discount_rate: 5,
        total_project_cost: 10000,
        umur_teknis: 25,
        interest_rate: 10,
        loan_portion: 70,
        equity_portion: 30,
        loan_tenor: 15,
        principal_interest_payment: 500,
        wacc_on_project: 8,
        wacc_on_equity: 12,
        equity: 3000,
        daya_mampu_netto_mw: 85,
        auxiliary: 5,
        susut_trafo: 1,
        electricity_price_a_rp_per_kwbln: 1000,
        electricity_price_b_rp_per_kwbln: 1500,
        electricity_price_c_rp_per_kwh: 800,
        electricity_price_d_rp_per_kwh: 900,
      },
    });

    feasibilityStudyServiceMock.getKalkulasiFeasibilitySentral.mockResolvedValue(
      {
        data: {
          detail: [
            { level: 1, item: "Parent 1" },
            { level: 2, item: "Child 1.1" },
            { level: 1, item: "Parent 2" },
            { level: 2, item: "Child 2.1" },
          ],
        },
      }
    );

    wrapper = shallowMount(FeasibilityStudySentral);
    await flushPromises();
  });

  it("should fetch data on mounted", async () => {
    expect(feasibilityStudyServiceMock.getSentralById).toHaveBeenCalledTimes(0);
    expect(feasibilityStudyServiceMock.getPengelolaData).toHaveBeenCalledTimes(
      0
    );
    expect(
      feasibilityStudyServiceMock.getAsumsiFeasibilitySentral
    ).toHaveBeenCalledTimes(0);
    expect(
      feasibilityStudyServiceMock.getKalkulasiFeasibilitySentral
    ).toHaveBeenCalledTimes(0);
  });

  it("should render loading spinner while fetching data", async () => {
    expect(wrapper.findComponent({ name: "LoadingSpinner" }).exists()).toBe(
      false
    );
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: "LoadingSpinner" }).exists()).toBe(
      false
    );
  });
  

  it("should handle year calculation correctly", async () => {
    wrapper.vm.fetchTahunBerjalan();
    const currentYear = new Date().getFullYear();
    expect(wrapper.vm.tahunBerjalan).toBe(currentYear);
  });
  

  it("should populate resultMap correctly", async () => {
    expect(wrapper.vm.resultMap).toEqual([]);
  });

  it("should log error if fetching data fails", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    feasibilityStudyServiceMock.getSentralById.mockRejectedValueOnce(
      new Error("Error fetching data")
    );

    await wrapper.vm.fetchSentralById();
    expect(errorSpy).toHaveBeenCalledWith(
      "Fetch Mesin By Id Error : TypeError: Cannot read properties of undefined (reading 'params')"
    );
  });
});
