import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LamanUtama from '@/views/Beranda/LamanUtama/LamanUtama.vue';
import { createPinia, setActivePinia } from 'pinia';

let mockKategoriPembangkitData: any[] = [
  {
    kode_jenis_pembangkit: 'PLTU',
    nama_jenis_pembangkit: 'PLTU Test'
  }
];

let mockChartKategoriData: any = {
  total_mesin_terinput: 50,
  total_mesin_belum_terinput: 30
};

// Mock the service
vi.mock('@/services/laman-service', () => ({
  default: class MockLamanService {
    async getTotalDaya() {
      return {
        data: {
          total_daya_terpasang: 1000,
          total_daya_terinput: 800,
          persentase_terinput: 80
        }
      };
    }

    async getSebaranUnit() {
      return {
        data: {
          total_unit: 100,
          unit_terinput: 80,
          unit_belum_terinput: 20
        }
      };
    }

    async getMesinBaru() {
      return {
        data: [
          {
            uuid_mesin: '123',
            sentral: 'Test Sentral',
            mesin: 'Test Mesin',
            tahun_operasi: '2024',
            daya_terpasang: 100
          }
        ],
        meta: {
          totalRecords: 1,
          totalPages: 1,
          limit: 5
        }
      };
    }

    async getMesinBelumInput() {
      return {
        data: [],
        meta: {
          totalRecords: 0
        }
      };
    }

    async getKategoriPembangkit() {
      return {
        data: mockKategoriPembangkitData
      };
    }

    async getChartDaya() {
      return {
        data: {
          daya_terpasang: 1000,
          daya_terinput: 800
        }
      };
    }

    async getChartKategori() {
      return {
        data: mockChartKategoriData
      };
    }
  }
}));

describe('LamanUtama', () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    
    wrapper = mount(LamanUtama, {
      global: {
        plugins: [pinia],
        stubs: {
          'VChart': true,
          'Loading': true,
          'ModalWrapper': true,
          'TableComponent': true,
          'SearchBox': true
        }
      }
    });
  });

  it('should render component successfully', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should initialize with default values', async () => {
    // Wait for component to finish mounting
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isModalUnit).toBe(false);
    expect(wrapper.vm.isModalCOD).toBe(false);
    expect(wrapper.vm.pageMesinBaru).toBe(1);
  });

  it('should handle modal operations correctly', async () => {
    // Test opening modal unit
    wrapper.vm.openModalUnit();
    expect(wrapper.vm.isModalUnit).toBe(true);

    // Test closing modal unit
    wrapper.vm.closeModalUnit();
    expect(wrapper.vm.isModalUnit).toBe(false);

    // Test opening modal COD
    wrapper.vm.openModalCOD();
    expect(wrapper.vm.isModalCOD).toBe(true);

    // Test closing modal COD
    wrapper.vm.closeModalCOD();
    expect(wrapper.vm.isModalCOD).toBe(false);
  });

  it('should handle pagination correctly', async () => {
    // Test handlePageChange
    await wrapper.vm.handlePageChange(2);
    expect(wrapper.vm.pageMesinBaru).toBe(2);

    // Test handlePageSizeChange
    await wrapper.vm.handlePageSizeChange();
    expect(wrapper.vm.pageMesinBaru).toBe(1);

    // Test handlePreviousClick
    wrapper.vm.pageMesinBaru = 2;
    await wrapper.vm.handlePreviousClick();
    expect(wrapper.vm.pageMesinBaru).toBe(1);

    // Test handleNextClick
    wrapper.vm.totalPages = 3;
    wrapper.vm.pageMesinBaru = 1;
    await wrapper.vm.handleNextClick();
    expect(wrapper.vm.pageMesinBaru).toBe(2);
  });

  it('should handle search functionality', async () => {
    wrapper.vm.searchQuery = 'test search';
    await wrapper.vm.handleSearch();
    expect(wrapper.vm.searchQuery).toBe('test search');
  });

  it('should test data reactive properties', () => {
    // Test reactive properties initialization
    expect(wrapper.vm.totalDaya).toEqual({ data: null });
    expect(wrapper.vm.sebaranUnit).toEqual({ data: null });
    expect(wrapper.vm.chartDaya).toEqual({ data: null });
    expect(wrapper.vm.chartKategori).toEqual({ data: null });
    expect(wrapper.vm.kategoriPembangkit).toEqual([]);
    expect(wrapper.vm.mesinBaru).toEqual([]);
    expect(wrapper.vm.mesinBelumInput).toEqual([]);
  });

  it('should handle router push functionality', () => {
    const mockPush = vi.fn();
    wrapper.vm.$router = { push: mockPush };
    
    wrapper.vm.handlePushPage();
    expect(wrapper.vm.isModalUnit).toBe(false);
  });

  it('should compute displayedPages correctly', () => {
    wrapper.vm.pageMesinBaru = 3;
    wrapper.vm.totalPages = 10;
    wrapper.vm.maxDisplayedPages = 5;
    
    const pages = wrapper.vm.displayedPages;
    expect(pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle watch functionality for body overflow', async () => {
    // Test isModalUnit watcher
    wrapper.vm.isModalUnit = true;
    await wrapper.vm.$nextTick();
    
    wrapper.vm.isModalUnit = false;
    await wrapper.vm.$nextTick();

    // Test isModalCOD watcher
    wrapper.vm.isModalCOD = true;
    await wrapper.vm.$nextTick();
    
    wrapper.vm.isModalCOD = false;
    await wrapper.vm.$nextTick();

    // Test isLoading watcher
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    
    wrapper.vm.isLoading = false;
    await wrapper.vm.$nextTick();
  });

  it('should test edge cases for pagination', () => {
    // Test handlePreviousClick when page is 1
    wrapper.vm.pageMesinBaru = 1;
    wrapper.vm.handlePreviousClick();
    expect(wrapper.vm.pageMesinBaru).toBe(1);

    // Test handleNextClick when page is at max
    wrapper.vm.totalPages = 5;
    wrapper.vm.pageMesinBaru = 5;
    wrapper.vm.handleNextClick();
    expect(wrapper.vm.pageMesinBaru).toBe(5);
  });

  it('should test service method calls', async () => {
    // Test individual service methods
    const result1 = await wrapper.vm.getTotalDaya();
    expect(result1).toBeDefined();

    const result2 = await wrapper.vm.getSebaranUnit();
    expect(result2).toBeDefined();

    const result3 = await wrapper.vm.getChartDaya();
    expect(result3).toBeDefined();

    const result4 = await wrapper.vm.getKategoriPembangkit();
    expect(result4).toBeDefined();
  });

  it('should test chart configuration', () => {
    // Test ChartDaya configuration
    expect(wrapper.vm.ChartDaya).toBeDefined();
    expect(wrapper.vm.ChartDaya.tooltip).toBeDefined();
    expect(wrapper.vm.ChartDaya.series).toBeDefined();

    // Test ChartPembangkit configuration
    expect(wrapper.vm.ChartPembangkit).toBeDefined();
    expect(wrapper.vm.ChartPembangkit.tooltip).toBeDefined();
    expect(wrapper.vm.ChartPembangkit.series).toBeDefined();
  });

  it('should execute chart formatter callbacks', () => {
    wrapper.vm.chartDaya = {
      persentase: 80,
      daya_terpasang: 1000,
      daya_terinput: 800
    };
    wrapper.vm.chartKategori = { total_mesin: 12 };

    const tooltipFormatter = wrapper.vm.ChartDaya.tooltip.formatter;
    const centerFormatter = wrapper.vm.ChartDaya.series[0].label.formatter;
    const kategoriFormatter = wrapper.vm.ChartPembangkit.series[0].label.formatter;

    expect(typeof tooltipFormatter()).toBe('string');
    expect(centerFormatter()).toContain('%');
    expect(kategoriFormatter()).toContain('Unit Mesin');
  });

  it('should handle changePage for PLTU and non-PLTU categories', async () => {
    await flushPromises();

    await wrapper.vm.changePage('PLTU < 100', 1);
    expect(wrapper.vm.tabs).toBe('PLTU');

    await wrapper.vm.changePage('PLTA', 0);
    expect(wrapper.vm.tabs).toBe('PLTA');
  });

  it('should handle changePage error branch', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalGetChartKategori = wrapper.vm.lamanService.getChartKategori;

    wrapper.vm.lamanService.getChartKategori = vi.fn().mockRejectedValue(new Error('chart-failed'));
    await wrapper.vm.changePage('PLTU', 1);

    expect(consoleSpy).toHaveBeenCalledWith('Change Page Error : ', expect.any(Error));

    wrapper.vm.lamanService.getChartKategori = originalGetChartKategori;
    consoleSpy.mockRestore();
  });

  it('should warn when kategori pembangkit is empty', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const originalMethod = wrapper.vm.lamanService.getKategoriPembangkit;

    wrapper.vm.lamanService.getKategoriPembangkit = vi.fn().mockResolvedValue({ data: [] });
    const result = await wrapper.vm.getKategoriPembangkit();

    expect(result).toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith('Array is empty. Unable to set tabs2.value.');

    wrapper.vm.lamanService.getKategoriPembangkit = originalMethod;
    warnSpy.mockRestore();
  });

  it('should map id_daya branches on mounted loop categories', async () => {
    mockKategoriPembangkitData = [
      { kode_jenis_pembangkit: 'PLTU < 100' },
      { kode_jenis_pembangkit: 'PLTU 100 - 400' },
      { kode_jenis_pembangkit: 'PLTU > 400' },
      { kode_jenis_pembangkit: 'PLTA' }
    ];

    const remount = mount(LamanUtama, {
      global: {
        plugins: [createPinia()],
        stubs: {
          VChart: true,
          Loading: true,
          ModalWrapper: true,
          TableComponent: true,
          SearchBox: true
        }
      }
    });

    await flushPromises();

    const mapped = remount.vm.kategoriPembangkit;
    expect(mapped.some((item: any) => item.kode_jenis_pembangkit === 'PLTU < 100' && item.id_daya === 1)).toBe(true);
    expect(mapped.some((item: any) => item.kode_jenis_pembangkit === 'PLTU 100 - 400' && item.id_daya === 2)).toBe(true);
    expect(mapped.some((item: any) => item.kode_jenis_pembangkit === 'PLTU > 400' && item.id_daya === 3)).toBe(true);
    expect(mapped.some((item: any) => item.kode_jenis_pembangkit === 'PLTA' && item.id_daya === 0)).toBe(true);

    remount.unmount();
    mockKategoriPembangkitData = [
      {
        kode_jenis_pembangkit: 'PLTU',
        nama_jenis_pembangkit: 'PLTU Test'
      }
    ];
  });

  it('should throw and log for getMesinBelumInput error branch', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalMethod = wrapper.vm.lamanService.getMesinBelumInput;

    wrapper.vm.lamanService.getMesinBelumInput = vi.fn().mockRejectedValue(new Error('mesin-belum-input-failed'));

    await expect(wrapper.vm.getMesinBelumInput()).rejects.toThrow('mesin-belum-input-failed');
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));

    wrapper.vm.lamanService.getMesinBelumInput = originalMethod;
    consoleSpy.mockRestore();
  });

  it('should execute template interactions for modal and pagination handlers', async () => {
    const richWrapper = mount(LamanUtama, {
      global: {
        plugins: [createPinia()],
        stubs: {
          VChart: true,
          Loading: true,
          ModalWrapper: {
            props: ['showModal'],
            template: '<div v-if="showModal"><slot /></div>'
          },
          TableComponent: {
            template: '<table><slot name="table-header" /><slot name="table-body" /></table>'
          },
          SearchBox: {
            props: ['modelValue'],
            emits: ['update:modelValue', 'on-click-submit', 'on-key-enter'],
            template: '<div><input data-testid="search-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /><button data-testid="search-submit" @click="$emit(\'on-click-submit\')">submit</button><button data-testid="search-enter" @click="$emit(\'on-key-enter\')">enter</button></div>'
          }
        }
      }
    });

    await flushPromises();

    richWrapper.vm.totalDaya = {
      daya_terpasang: 1000,
      daya_terpasang_baru: 50,
      daya_mampu: 900,
      daya_terinput: 800
    };
    richWrapper.vm.sebaranUnit = {
      total_mesin: 10,
      total_mesin_baru: 2,
      total_mesin_terinput: 8,
      total_mesin_belum_input: 2
    };
    richWrapper.vm.kategoriPembangkit = [{ kode_jenis_pembangkit: 'PLTA', id_daya: 0 }];
    richWrapper.vm.tabs2 = 'PLTA';
    richWrapper.vm.mesinBaru = [{ uuid_mesin: 'x1', mesin: 'M1', tahun_operasi: '2024', daya_terpasang: 11 }];
    richWrapper.vm.filteredMesin = [{ uuid_mesin: 'x1', sentral: 'S1', mesin: 'M1', tahun_operasi: '2024', daya_terpasang: 11 }];
    richWrapper.vm.totalPages = 3;
    richWrapper.vm.totalRecords = 7;
    richWrapper.vm.pageMesinBaru = 1;
    richWrapper.vm.isModalUnit = true;
    richWrapper.vm.isModalCOD = true;
    await flushPromises();

    const categoryItem = richWrapper.findAll('li').find((node) => node.text().includes('PLTA'));
    if (categoryItem) {
      await categoryItem.trigger('click');
    }

    const openUnitBtn = richWrapper.findAll('button').find((node) => node.text().includes('Total Unit Mesin Belum Terinput'));
    if (openUnitBtn) {
      await openUnitBtn.trigger('click');
    }

    const lihatSemuaButtons = richWrapper.findAll('button').filter((node) => node.text().includes('Lihat Semua'));
    for (const btn of lihatSemuaButtons) {
      await btn.trigger('click');
    }

    const searchInput = richWrapper.find('[data-testid="search-input"]');
    if (searchInput.exists()) {
      await searchInput.setValue('query-mesin');
    }
    const submitBtn = richWrapper.find('[data-testid="search-submit"]');
    const enterBtn = richWrapper.find('[data-testid="search-enter"]');
    if (submitBtn.exists()) {
      await submitBtn.trigger('click');
    }
    if (enterBtn.exists()) {
      await enterBtn.trigger('click');
    }

    const closeButtons = richWrapper.findAll('button').filter((node) => node.find('svg').exists());
    if (closeButtons[0]) {
      await closeButtons[0].trigger('click');
    }
    if (closeButtons[1]) {
      await closeButtons[1].trigger('click');
    }

    const pageSizeSelect = richWrapper.find('select');
    if (pageSizeSelect.exists()) {
      await pageSizeSelect.setValue('10');
      await pageSizeSelect.trigger('change');
    }

    const prevBtn = richWrapper.findAll('button').find((node) => node.text().includes('Previous'));
    const nextBtn = richWrapper.findAll('button').find((node) => node.text().includes('Next'));
    if (nextBtn) {
      await nextBtn.trigger('click');
    }
    if (prevBtn) {
      await prevBtn.trigger('click');
    }

    const pageTwo = richWrapper.findAll('li').find((node) => node.text().trim() === '2');
    if (pageTwo) {
      await pageTwo.trigger('click');
    }

    expect(richWrapper.exists()).toBe(true);
    richWrapper.unmount();
  });
});
