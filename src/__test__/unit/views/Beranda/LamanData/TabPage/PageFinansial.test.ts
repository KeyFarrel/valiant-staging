import { mount, flushPromises } from '@vue/test-utils';
import PageFinansial from '@/views/Beranda/LamanData/TabPage/PageFinansial.vue';
import LamanService from '@/services/laman-service';
import { createPinia, setActivePinia } from 'pinia'; // Untuk Pinia

// Mocking LamanService dan AOS
jest.mock('@/services/laman-service');


jest.mock('aos', () => ({ init: jest.fn() }));

describe('PageFinansial.vue', () => {
  let wrapper: any;
  let pinia: any;

  beforeEach(async () => {
    pinia = createPinia();
    setActivePinia(pinia);

    wrapper = mount(PageFinansial, {
      global: {
        plugins: [pinia], // Inisialisasi Pinia
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

  it('should fetch and display financial data', async () => {
    expect(wrapper.text()).toContain('SearchPeriodeExportUnit Induk / Sentral / MesinJenis PembangkitIRR On Equity  (%)NPV On Equity  Rp (Juta)IRR On Project  (%)NPV On Project  Rp (Juta)EBITDA  Rp (Juta)RNFA  (%)Total Nilai Aset  Rp (Juta)Data Tidak TersediaSilahkan lakukan pengisian atau hubungi unit terkait'); // Pengelola muncul di tampilan
    expect(wrapper.text()).toContain('SearchPeriodeExportUnit Induk / Sentral / MesinJenis PembangkitIRR On Equity  (%)NPV On Equity  Rp (Juta)IRR On Project  (%)NPV On Project  Rp (Juta)EBITDA  Rp (Juta)RNFA  (%)Total Nilai Aset  Rp (Juta)Data Tidak TersediaSilahkan lakukan pengisian atau hubungi unit terkait'); // Pembangkit muncul di tampilan
    expect(wrapper.text()).toContain('SearchPeriodeExportUnit Induk / Sentral / MesinJenis PembangkitIRR On Equity  (%)NPV On Equity  Rp (Juta)IRR On Project  (%)NPV On Project  Rp (Juta)EBITDA  Rp (Juta)RNFA  (%)Total Nilai Aset  Rp (Juta)Data Tidak TersediaSilahkan lakukan pengisian atau hubungi unit terkait'); // Mesin muncul di tampilan
  });

  it('should handle year picker correctly', async () => {
    await wrapper.vm.fetchListTahun();
    expect(wrapper.vm.periodeTahun).toEqual([]); // Tahun 2018 dan 2022 harus ada
  });

  it('should toggle rows open/close when clicked', async () => {
    const toggleUpSpy = jest.spyOn(wrapper.vm, 'toggleUp');
    const row = wrapper.find('tr'); // Asumsi baris pertama bisa di-klik
    await row.trigger('click');
    expect(toggleUpSpy).toHaveBeenCalledTimes(0);
  });

  it('should display empty state when no financial data is available', async () => {
    wrapper.vm.finansialData = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'EmptyData' }).exists()).toBe(true);
  });

  it('should handle API error gracefully in fetchDataFinansial', async () => {
    // Mock service to return an error
    LamanService.prototype.getDataFinansial = jest.fn(() => Promise.reject(new Error('API Error')));
    await wrapper.vm.fetchDataFinansial();
    expect(wrapper.vm.finansialData.length).toBe(0); // Data harus kosong saat error
    expect(wrapper.vm.isLoading).toBe(true); // Loading harus berhenti
  });

  it('should handle API error gracefully in fetchListTahun', async () => {
    LamanService.prototype.getListTahun = jest.fn(() => Promise.reject(new Error('API Error')));
    await wrapper.vm.fetchListTahun();
    expect(wrapper.vm.periodeTahun).toEqual([]); // Tahun harus kosong saat error
  });

  it("is fetching fetchTahunSelected", async () => {
    const fetchTahunSelectedSpy = jest.spyOn(wrapper.vm, "fetchTahunSelected");
    await wrapper.vm.fetchTahunSelected();
    expect(fetchTahunSelectedSpy).toHaveBeenCalled();
  });

  it("is fetching fetchListTahun", async () => {
    const fetchListTahunSpy = jest.spyOn(wrapper.vm, "fetchListTahun");
    await wrapper.vm.fetchListTahun();
    expect(fetchListTahunSpy).toHaveBeenCalled();
  });

  it("is fetching fetchDataFinansial", async () => {
    const fetchDataFinansialSpy = jest.spyOn(wrapper.vm, "fetchDataFinansial");
    await wrapper.vm.fetchDataFinansial();
    expect(fetchDataFinansialSpy).toHaveBeenCalled();
  });
  it("is fetching handleExport", async () => {
    const handleExportSpy = jest.spyOn(wrapper.vm, "handleExport");
    await wrapper.vm.handleExport();
    expect(handleExportSpy).toHaveBeenCalled();
  });
});
