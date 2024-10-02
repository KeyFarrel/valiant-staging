// Import necessary modules and libraries
import { shallowMount } from '@vue/test-utils';
import LihatCAPEX from '@/views/Beranda/LamanData/LihatCAPEX.vue';
import { createPinia, setActivePinia } from 'pinia'; // Import Pinia
import InfoHeader from '@/components/ui/InfoHeader.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import LihatCAPEXService from '@/services/lihat-capex-service';
import { useRoute } from 'vue-router';

// Mock vue-router's useRoute function
jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

// Mock LihatCAPEXService methods
jest.mock('@/services/lihat-capex-service', () => {
  return jest.fn().mockImplementation(() => ({
    getMesinById: jest.fn(),
    getPembangkitByKode: jest.fn(),
    getPengelolaData: jest.fn(),
    getAsumsiParameterData: jest.fn(),
    getAnggaranDetailCAPEX: jest.fn(),
    getTotalReplacement: jest.fn(),
  }));
});

describe('LihatCAPEX.vue', () => {
  let wrapper: any;
  const routeMock = {
    params: { id: '1' },
  };

  const lihatCAPEXServiceMock = new LihatCAPEXService() as jest.Mocked<LihatCAPEXService>;

  // Create a new Pinia instance
  const pinia = createPinia();

  beforeEach(() => {
    // Set the active Pinia store
    setActivePinia(pinia);

    (useRoute as jest.Mock).mockReturnValue(routeMock);

    wrapper = shallowMount(LihatCAPEX, {
      global: {
        plugins: [pinia], // Add Pinia to the global Vue instance
        components: { InfoHeader, Loading, VueDatePicker },
      },
    });
  });

  it('renders loading spinner when loading is true', async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });

  it('fetches initial data on mount', async () => {
    // Mock responses
    lihatCAPEXServiceMock.getMesinById.mockResolvedValue({ data: { mesin: 'Mesin A', kode_sentral: '123' } });
    lihatCAPEXServiceMock.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: '001', pengelola: 'Pengelola A' }],
    });
    lihatCAPEXServiceMock.getPembangkitByKode.mockResolvedValue({
      data: { kode_pengelola: '001', pembina: 'Pembina A' },
    });
    lihatCAPEXServiceMock.getAsumsiParameterData.mockResolvedValue({
      data: { asumsi_makro: { umur_teknis: 5 } },
    });
    lihatCAPEXServiceMock.getAnggaranDetailCAPEX.mockResolvedValue({ data: [] });
    lihatCAPEXServiceMock.getTotalReplacement.mockResolvedValue({ data: { total_replacement: 1000 } });

    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();

    // Expect service methods to have been called with the correct arguments
    expect(lihatCAPEXServiceMock.getMesinById).toHaveBeenCalledWith();
    expect(lihatCAPEXServiceMock.getPengelolaData).toHaveBeenCalled();
    expect(lihatCAPEXServiceMock.getPembangkitByKode).toHaveBeenCalled();
    expect(lihatCAPEXServiceMock.getAsumsiParameterData).toHaveBeenCalled();
  });

  it('renders the info header with the correct data', async () => {
    // Set mock data for mesinDataById
    wrapper.vm.mesinDataById = {
      mesin: 'Mesin B',
      kode_jenis_pembangkit: 'PLTU',
      kondisi_unit: 'Baik',
      daya_terpasang: 1000,
      daya_mampu: 900,
      tahun_operasi: 2000,
    };
    wrapper.vm.namaPengelola = 'Pengelola B';
    wrapper.vm.umurTeknis = 5;
    await wrapper.vm.$nextTick();

    // Check that the InfoHeader component gets the right props
    const infoHeader = wrapper.findComponent(InfoHeader);
    expect(infoHeader.props('namaMesin')).toBe('Mesin B');
    expect(infoHeader.props('namaPengelola')).toBe('Pengelola B');
    expect(infoHeader.props('umurTeknis')).toBe('5');
  });

  it('calls the correct method when year is picked', async () => {
    const handleYearPickedSpy = jest.spyOn(wrapper.vm, 'handleYearPicked');

    wrapper.vm.yearPicked = 2022;
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();

    const datePicker = wrapper.findComponent(VueDatePicker);
    datePicker.vm.$emit('update:model-value', 2022);

    expect(handleYearPickedSpy).toHaveBeenCalledWith(2022);
  });

  it('fetches CAPEX detail and total replacement when year changes', async () => {
    // Mock the service calls for detail CAPEX and total replacement
    lihatCAPEXServiceMock.getAnggaranDetailCAPEX.mockResolvedValue({
      data: [{ judul_program: 'Program A', ai: 100, realisasi_aki: 90 }],
    });
    lihatCAPEXServiceMock.getTotalReplacement.mockResolvedValue({ data: { total_replacement: 1000 } });

    await wrapper.vm.handleYearPicked(2022);
    await wrapper.vm.$nextTick();

    expect(lihatCAPEXServiceMock.getAnggaranDetailCAPEX).toHaveBeenCalledWith();
    expect(wrapper.vm.detailCAPEX[0].judul_program).toBe('Program A');
    expect(wrapper.vm.totalReplacement.total_replacement).toBe(1000);
  });

  it('renders the CAPEX table correctly', async () => {
    wrapper.vm.detailCAPEX = [
      { judul_program: 'Program A', ai: 100, realisasi_aki: 90 },
      { judul_program: 'Program B', ai: 200, realisasi_aki: 180 },
    ];
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(0);
    expect(rows[0].text()).toContain('Program A');
    expect(rows[1].text()).toContain('Program B');
  });
});
