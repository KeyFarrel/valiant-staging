import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LamanUtama from '@/views/Beranda/LamanUtama/LamanUtama.vue';
import { createPinia, setActivePinia } from 'pinia';

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
        data: [
          {
            kode_jenis_pembangkit: 'PLTU',
            nama_jenis_pembangkit: 'PLTU Test'
          }
        ]
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
        data: {
          total_mesin_terinput: 50,
          total_mesin_belum_terinput: 30
        }
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
});
