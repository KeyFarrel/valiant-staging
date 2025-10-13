import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import PageCAPEXOPEX from '@/views/Beranda/LamanData/TabPage/PageCAPEXOPEX.vue';

// Mock services
vi.mock('@/services/laman-service', () => ({
  default: class MockLamanService {
    getPeriodeTahun() {
      return Promise.resolve({
        data: [
          { tahun: 2020 },
          { tahun: 2021 },
          { tahun: 2022 },
          { tahun: 2023 },
          { tahun: 2024 }
        ]
      });
    }
    
    getDataAnggaran() {
      return Promise.resolve({
        data: [
          {
            id_pengelola: 1,
            pengelola: 'PLN Unit Induk Jawa Tengah',
            cost_component_a: 1000000,
            cost_component_b: 2000000,
            cost_component_c: 3000000,
            cost_component_d: 4000000,
            pembangkits: [
              {
                uuid_sentral: 'uuid-1',
                sentral: 'PLTU Cilacap',
                kode_jenis_pembangkit: 'PLTU',
                cost_component_a: 500000,
                cost_component_b: 1000000,
                cost_component_c: 1500000,
                cost_component_d: 2000000,
                mesins: [
                  {
                    mesin: 'Unit 1',
                    cost_component_a: 250000,
                    cost_component_b: 500000,
                    cost_component_c: 750000,
                    cost_component_d: 1000000,
                    detail_mesin_cost_component: [
                      {
                        tahun: 2023,
                        cost_component_a: 250000,
                        cost_component_b: 500000,
                        cost_component_c: 750000,
                        cost_component_d: 1000000
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
    }
    
    downloadExcelCAPEXOPEX() {
      return Promise.resolve({
        data: new Blob(),
        headers: {
          'content-disposition': 'attachment; filename="test.xlsx"'
        }
      });
    }
  }
}));

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah(value: number) {
      return `Rp ${value.toLocaleString('id-ID')}`;
    }
  }
}));

// Mock AOS
vi.mock('aos', () => ({
  default: {
    init: vi.fn()
  }
}));

// Mock store
vi.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataPeriodeStore: () => ({
    periodeTahun: [2020, 2024]
  })
}));

describe('PageCAPEXOPEX', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(PageCAPEXOPEX, {
      global: {
        stubs: {
          Loading: true,
          SearchBox: true,
          VueDatePicker: true,
          ButtonComponent: true,
          TableComponent: true,
          Empty: true,
          ShimmerLoading: true
        }
      }
    });
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm).toBeDefined();
  });

  it('should initialize with default reactive data', () => {
    // The component calls fetchDataAnggaran in onMounted, so dataAnggaran will have mocked data
    expect(wrapper.vm.isRowTabOpen).toEqual([]);
    expect(wrapper.vm.searchQ).toBe('');
    expect(wrapper.vm.dataAnggaran).toBeDefined();
  });

  it('should toggle row correctly', () => {
    const itemId = 1;
    
    // Initially row should be closed
    expect(wrapper.vm.isRowOpen(itemId)).toBe(false);
    
    // Toggle to open
    wrapper.vm.toggleRow(itemId);
    expect(wrapper.vm.isRowOpen(itemId)).toBe(true);
    
    // Toggle to close
    wrapper.vm.toggleRow(itemId);
    expect(wrapper.vm.isRowOpen(itemId)).toBe(false);
  });

  it('should handle year range picker change', async () => {
    const mockYearRange = [2020, 2023];
    
    // Call the method directly
    await wrapper.vm.handleYearRangePicked(mockYearRange);
    
    expect(wrapper.vm.yearRangePicked).toEqual(mockYearRange);
    expect(wrapper.vm.tahunDari).toBe(2020);
    expect(wrapper.vm.tahunSampai).toBe(2023);
  });

  it('should handle export functionality', async () => {
    // Mock window.URL and document methods for download
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    const mockLink = {
      href: '',
      setAttribute: vi.fn(),
      click: vi.fn()
    };
    
    document.createElement = vi.fn(() => mockLink as any);
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    
    // Call the export method
    await wrapper.vm.handleExport();
    
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });
});
