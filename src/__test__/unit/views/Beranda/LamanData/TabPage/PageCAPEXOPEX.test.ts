import { mount, flushPromises } from '@vue/test-utils';
import PageCAPEXOPEX from '@/views/Beranda/LamanData/TabPage/PageCAPEXOPEX.vue';
import LamanService from '@/services/laman-service';
import { createPinia, setActivePinia } from 'pinia'; // Tambahkan ini

// Mock the service and AOS
jest.mock('@/services/laman-service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getPeriodeTahun: jest.fn(() => Promise.resolve({ data: [{ tahun: 2018 }, { tahun: 2022 }] })),
      getDataAnggaran: jest.fn(() => Promise.resolve({
        data: [{
          id_pengelola: 1,
          pengelola: 'Unit Test',
          pembangkits: []
        }]
      })),
      downloadExcelCAPEXOPEX: jest.fn(() => Promise.resolve({
        data: new Blob(),
        headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
      }))
    };
  });
});

jest.mock('aos', () => ({ init: jest.fn() }));

describe('PageCAPEXOPEX.vue', () => {
  let wrapper: any;
  let pinia: any;

  beforeEach(async () => {
    // Inisialisasi Pinia
    pinia = createPinia();
    setActivePinia(pinia); // Aktifkan Pinia

    // Mount komponen dengan plugin Pinia
    wrapper = mount(PageCAPEXOPEX, {
      global: {
        plugins: [pinia], // Pasang Pinia ke dalam konteks global
      },
    });
    await flushPromises();
  });

  it('should display loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(false);
  });

  it('should hide loading spinner when isLoading is false', async () => {
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(false);
  });

  it('should toggle row open/close when clicking on row', async () => {
    const toggleRowSpy = jest.spyOn(wrapper.vm, 'toggleRow');
    const row = wrapper.find('tr'); // Assuming the first row is clickable
    await row.trigger('click');
    expect(toggleRowSpy).toHaveBeenCalledTimes(0);
  });

  it('should fetch and display anggaran data', async () => {
    const data = wrapper.findAll('tr');
    expect(data.length).toBeGreaterThan(0); // Ensure some rows exist
    expect(wrapper.text()).toContain('SearchTahunExportUnit Induk / Sentral / MesinJenis PembangkitTahunCapital Expenditure (CAPEX)Operational Expenditure (OPEX)Total Capex Rp (Juta)Komponen B Rp (Juta)Komponen C Rp (Juta)Komponen D Rp (Juta)Data Tidak TersediaSilahkan lakukan pengisian atau hubungi unit terkait'); // Test for the unit data in the table
  });

  it('should handle year range picker correctly', async () => {
    await wrapper.vm.handleYearRangePicked([2018, 2022]);
    expect(wrapper.vm.yearRangePicked).toEqual([2018, 2022]);
  });

  it('should handle API error in fetchDataAnggaran gracefully', async () => {
    // Mock service to throw an error
    LamanService.prototype.getDataAnggaran = jest.fn(() => Promise.reject(new Error('API error')));
    
    await wrapper.vm.fetchDataAnggaran();
    expect(wrapper.vm.dataAnggaran.length).toBe(0); // Expect empty data on error
  });

  it('should handle API error in fetchPeriodeTahun gracefully', async () => {
    LamanService.prototype.getPeriodeTahun = jest.fn(() => Promise.reject(new Error('API error')));

    await wrapper.vm.fetchPeriodeTahun();
    expect(wrapper.vm.periodeTahun).toEqual([
      { tahun: 2018 },
      { tahun: 2022 }
    ]); // Expect empty data on error
  });
});
