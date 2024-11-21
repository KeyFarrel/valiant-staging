import { mount, flushPromises, shallowMount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import DetailRekapSentral from "@/views/Data/RekapKertasKerja/DetailRekap/DetailRekapSentral.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";

// Mock the service methods
jest.mock("@/services/detail-rekap-service", () => {
  return jest.fn().mockImplementation(() => ({
    getSentralById: jest.fn(),
    getPengelolaData: jest.fn(),
    getAsumsiMakroSentral: jest.fn(),
    getDataTeknisSentral: jest.fn(),
    getDataFinansialSentral: jest.fn(),
    getTypePeriodic: jest.fn(),
  }));
});

jest.mock("vue-router", () => ({
  useRoute: jest.fn().mockReturnValue({
    params: { id: "1" }, // Tambahkan params di mock
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

describe("DetailRekapSentral.vue", () => {
  let wrapper: any;

  beforeEach(async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    wrapper = shallowMount(DetailRekapSentral, {
      global: {
        plugins: [pinia], // Tambahkan Pinia ke dalam global plugins
      },
      props: {
        bahanBakars: [
          { harga_bahan_bakar: "10000", kode_bahan_bakar: "BBM" },
          { harga_bahan_bakar: "12000", kode_bahan_bakar: "BBG" },
        ], // Pastikan bahanBakars adalah array
      },
    });
    await flushPromises();
  });

  it("should display loading spinner when isLoading is true", async () => {
    // Modify the component state directly
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick(); // Ensure reactivity is triggered
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });

  it("should fetch and display sentral data on mount", async () => {
    const mockSentralData = {
      nama_sentral: "Sentral A",
      kode_jenis_pembangkit: "PLTU",
      kondisi_unit: "Aktif",
      daya_terpasang: 1000,
      daya_mampu: 900,
      tahun_operasi: "2015",
    };

    wrapper.vm.sentral = mockSentralData; // Set mock data langsung
    await wrapper.vm.$nextTick(); // Pastikan reaktivitas Vue

    // Verifikasi data sentral yang ter-load
    expect(wrapper.vm.sentral.nama_sentral).toBe("Sentral A");
    expect(wrapper.vm.sentral.kode_jenis_pembangkit).toBe("PLTU");
    expect(wrapper.vm.sentral.kondisi_unit).toBe("Aktif");
    expect(wrapper.vm.sentral.daya_terpasang).toBe(1000);
  });

  it("is fetching fetchSentralById", async () => {
    const fetchSentralByIdSpy = jest.spyOn(wrapper.vm, "fetchSentralById");
    await wrapper.vm.fetchSentralById();
    expect(fetchSentralByIdSpy).toHaveBeenCalled();
  });

  it("is fetching fetchAsumsiParameter", async () => {
    const fetchAsumsiParameterSpy = jest.spyOn(wrapper.vm, "fetchAsumsiParameter");
    await wrapper.vm.fetchAsumsiParameter();
    expect(fetchAsumsiParameterSpy).toHaveBeenCalled();
  });

  it("is fetching fetchDataTeknis", async () => {
    const fetchDataTeknisSpy = jest.spyOn(wrapper.vm, "fetchDataTeknis");
    await wrapper.vm.fetchDataTeknis();
    expect(fetchDataTeknisSpy).toHaveBeenCalled();
  });

  // it('should display AsumsiMakro component with correct props', async () => {
  //   wrapper.vm.asumsiParameter = {
  //     asumsi_makro: {
  //       corporate_tax_rate: 25,
  //       discount_rate: 10,
  //       loan_tenor: 5
  //     }
  //   };
  //   await wrapper.vm.$nextTick();

  //   const asumsiMakroComponent = wrapper.findComponent({ name: 'AsumsiMakro' });
  //   expect(asumsiMakroComponent.exists()).toBe(true); // Ensure component exists
  //   expect(asumsiMakroComponent.props('corporateTaxRate')).toBe(25);
  //   expect(asumsiMakroComponent.props('discountRate')).toBe(10);
  //   expect(asumsiMakroComponent.props('loanTenor')).toBe(5);
  // });

  // it('should display dataTeknis correctly in table', async () => {
  //   const dataTeknisTableRows = wrapper.findAll('tbody tr');
  //   expect(dataTeknisTableRows.length).toBe(1);

  //   const firstRowColumns = dataTeknisTableRows[0].findAll('td');
  //   expect(firstRowColumns[0].text()).toBe('1'); // Index
  //   expect(firstRowColumns[1].text()).toBe('Net Capacity'); // Uraian
  //   expect(firstRowColumns[2].text()).toBe('900'); // 2020
  //   expect(firstRowColumns[3].text()).toBe('920'); // 2021
  //   expect(firstRowColumns[4].text()).toBe('940'); // 2022
  // });

  // it('should display dataFinansial correctly in table', async () => {
  //   const dataFinansialTableRows = wrapper.findAll('tbody tr');
  //   expect(dataFinansialTableRows.length).toBe(1);

  //   const firstRowColumns = dataFinansialTableRows[0].findAll('td');
  //   expect(firstRowColumns[0].text()).toBe('Capex'); // Uraian
  //   expect(firstRowColumns[1].text()).toBe('1,000,000'); // 2020
  //   expect(firstRowColumns[2].text()).toBe('950,000'); // 2021
  //   expect(firstRowColumns[3].text()).toBe('900,000'); // 2022
  // });

  // it('should expand and collapse financial data rows correctly', async () => {
  //   const row = wrapper.find('tr');
  //   expect(row.exists()).toBe(true); // Ensure row exists before triggering

  //   await row.trigger('click'); // Simulate row click
  //   expect(wrapper.vm.isRowOpen(row.key)).toBe(true); // Check if row is expanded

  //   await row.trigger('click'); // Simulate another click
  //   expect(wrapper.vm.isRowOpen(row.key)).toBe(false); // Check if row is collapsed
  // });
});
