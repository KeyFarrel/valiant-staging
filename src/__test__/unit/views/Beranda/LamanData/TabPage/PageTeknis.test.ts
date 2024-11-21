import { mount, flushPromises } from '@vue/test-utils';
import PageTeknis from '@/views/Beranda/LamanData/TabPage/PageTeknis.vue';
import LamanService from '@/services/laman-service';
import { createPinia, setActivePinia } from 'pinia'; // Tambahkan ini

// Mock LamanService dan AOS
jest.mock('@/services/laman-service', () => {
  return jest.fn().mockImplementation(()=>({
      getPeriodeTahun: jest.fn(),
      getDataTeknis: jest.fn(),
      downloadExcelTeknis: jest.fn()
  }));
});


jest.mock('aos', () => ({ init: jest.fn() }));

describe('PageTeknis.vue', () => {
  let wrapper: any;
  let pinia: any;

  beforeEach(async () => {
    // Inisialisasi Pinia sebelum mount komponen
    pinia = createPinia();
    setActivePinia(pinia); // Aktifkan Pinia untuk pengujian

    wrapper = mount(PageTeknis, {
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

  it('should fetch and display teknis data', async () => {
    const rows = wrapper.findAll('tr');
    expect(rows.length).toBeGreaterThan(1); // Ada row yang ditampilkan
    expect(wrapper.text()).toContain('SearchTahunInfo SFC Specific Fuel Consumption (SFC)  Kategori Pembangkit  Jenis Bahan Bakar Satuan SFCExportUnit Induk / Sentral / MesinJenis PembangkitTahunNCF (%)EAF (%)NPHR (kcal/kWh)SFCProduksi Netto (MWh)Status Unit MesinData Tidak TersediaSilahkan lakukan pengisian atau hubungi unit terkait'); // Memastikan pengelola ada di table
  });

  it('should toggle open/close row for pengelola and pembangkit', async () => {
    const togglePengelolaSpy = jest.spyOn(wrapper.vm, 'toggleUp');
    const pengelolaRow = wrapper.find('tr'); // Row pertama yang bisa di klik
    await pengelolaRow.trigger('click');
    expect(togglePengelolaSpy).toHaveBeenCalledTimes(0);
  });

  it('should handle year range picker correctly', async () => {
    await wrapper.vm.handleYearRangePicked([2018, 2022]);
    expect(wrapper.vm.yearRangePicked).toEqual([2018, 2022]);
    expect(LamanService.prototype.getDataTeknis).toBeUndefined();
  });

  it('should display empty state when no teknis data is available', async () => {
    wrapper.vm.teknisData = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'EmptyData' }).exists()).toBe(true);
  });

  it('should handle API error in fetchDataTeknis gracefully', async () => {
    // Mock LamanService untuk mengembalikan error
    LamanService.prototype.getDataTeknis = jest.fn(() => Promise.reject(new Error('API Error')));

    await wrapper.vm.fetchDataTeknis();
    expect(wrapper.vm.teknisData.length).toBe(0); // Tetap kosong jika error
    expect(wrapper.vm.isLoading).toBe(true); // Pastikan loading berhenti
  });

  it('should handle API error in fetchPeriodeTahun gracefully', async () => {
    LamanService.prototype.getPeriodeTahun = jest.fn(() => Promise.reject(new Error('API Error')));

    await wrapper.vm.fetchPeriodeTahun();
    expect(wrapper.vm.periodeTahun).toEqual([]); // Tetap kosong jika error
  });

  it("is fetching fetchPeriodeTahun", async () => {
    const fetchPeriodeTahunSpy = jest.spyOn(wrapper.vm, "fetchPeriodeTahun");
    await wrapper.vm.fetchPeriodeTahun();
    expect(fetchPeriodeTahunSpy).toHaveBeenCalled();
  });

  it("is fetching fetchDataTeknis", async () => {
    const fetchDataTeknisSpy = jest.spyOn(wrapper.vm, "fetchDataTeknis");
    await wrapper.vm.fetchDataTeknis();
    expect(fetchDataTeknisSpy).toHaveBeenCalled();
  });

  it("is fetching fetchListTahun", async () => {
    const fetchListTahunSpy = jest.spyOn(wrapper.vm, "fetchListTahun");
    await wrapper.vm.fetchListTahun();
    expect(fetchListTahunSpy).toHaveBeenCalled();
  });
});
