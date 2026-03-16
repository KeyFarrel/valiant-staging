import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';
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

  afterEach(() => {
    wrapper?.unmount();
    vi.useRealTimers();
    vi.restoreAllMocks();
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
    const origCreateElement = document.createElement.bind(document);
    const origAppendChild = document.body.appendChild.bind(document.body);
    const origRemoveChild = document.body.removeChild.bind(document.body);
    try {
      // Mock window.URL and document methods for download
      globalThis.URL.createObjectURL = vi.fn(() => 'mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();
      
      const mockLink = {
        href: '',
        setAttribute: vi.fn(),
        click: vi.fn()
      };
      
      document.createElement = vi.fn((tagName: string) => {
        if (tagName.toLowerCase() === 'a') {
          return mockLink as any;
        }
        return origCreateElement(tagName as any);
      }) as any;
      document.body.appendChild = vi.fn() as any;
      document.body.removeChild = vi.fn() as any;
      
      // Call the export method
      await wrapper.vm.handleExport();
      
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    } finally {
      document.createElement = origCreateElement;
      document.body.appendChild = origAppendChild;
      document.body.removeChild = origRemoveChild;
    }
  });

  it('should toggle pembangkit correctly', () => {
    const pembangkitId = '1_0';

    expect(wrapper.vm.isPembangkitOpen(pembangkitId)).toBe(false);
    wrapper.vm.togglePembangkit(pembangkitId);
    expect(wrapper.vm.isPembangkitOpen(pembangkitId)).toBe(true);
    wrapper.vm.togglePembangkit(pembangkitId);
    expect(wrapper.vm.isPembangkitOpen(pembangkitId)).toBe(false);
  });

  it('should handle fetchPeriodeTahun error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    wrapper.vm.lamanService.getPeriodeTahun = vi.fn().mockRejectedValue(new Error('API Error'));
    await wrapper.vm.fetchPeriodeTahun();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Tahun Anggaran Error : ', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  it('should handle fetchDataAnggaran error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    wrapper.vm.lamanService.getDataAnggaran = vi.fn().mockRejectedValue(new Error('API Error'));
    await wrapper.vm.fetchDataAnggaran();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Data Anggaran Error : ', expect.any(Error));
    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.isSearchDisabled).toBe(false);
    consoleErrorSpy.mockRestore();
  });

  it('should handle handleExport error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    wrapper.vm.lamanService.downloadExcelCAPEXOPEX = vi.fn().mockRejectedValue(new Error('Export Error'));
    await wrapper.vm.handleExport();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Handle Download Template Rekap Error : ', expect.any(Error));
    expect(wrapper.vm.isLoading).toBe(false);
    consoleErrorSpy.mockRestore();
  });

  it('should handle export with fallback filename when content-disposition missing', async () => {
    const origCreateElement = document.createElement.bind(document);
    const origAppendChild = document.body.appendChild.bind(document.body);
    const origRemoveChild = document.body.removeChild.bind(document.body);
    try {
      globalThis.URL.createObjectURL = vi.fn(() => 'mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();
      const mockLink = { href: '', setAttribute: vi.fn(), click: vi.fn() };
      document.createElement = vi.fn((tagName: string) => {
        if (tagName.toLowerCase() === 'a') {
          return mockLink as any;
        }
        return origCreateElement(tagName as any);
      }) as any;
      document.body.appendChild = vi.fn() as any;
      document.body.removeChild = vi.fn() as any;

      wrapper.vm.lamanService.downloadExcelCAPEXOPEX = vi.fn().mockResolvedValue({
        data: new Blob(),
        headers: {}
      });
      wrapper.vm.yearRangePicked = [2020, 2024];

      await wrapper.vm.handleExport();

      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('Laman Data - CAPEX OPEX'));
      expect(mockLink.click).toHaveBeenCalled();
    } finally {
      document.createElement = origCreateElement;
      document.body.appendChild = origAppendChild;
      document.body.removeChild = origRemoveChild;
    }
  });

  it('should handle handleSearch debounce', async () => {
    vi.useFakeTimers();

    wrapper.vm.lamanService.getDataAnggaran = vi.fn().mockResolvedValue({ data: [] });
    wrapper.vm.handleSearch();
    wrapper.vm.handleSearch(); // second call should cancel first

    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();

    vi.useRealTimers();
  });

  it('should handle fetchDataAnggaran filtering', async () => {
    wrapper.vm.lamanService.getDataAnggaran = vi.fn().mockResolvedValue({
      data: [
        { pembangkits: [{ sentral: 'A' }] },
        { pembangkits: [] }
      ]
    });

    await wrapper.vm.fetchDataAnggaran();
    expect(wrapper.vm.dataAnggaran).toHaveLength(1);
  });

  it('should render nested capex/opex rows and fallback year-picker branch', async () => {
    const fullWrapper = mount(PageCAPEXOPEX, {
      global: {
        stubs: {
          Loading: true,
          SearchBox: {
            template: '<div><button class="emit-search" @click="$emit(\'on-click-submit\')" /><button class="emit-enter" @click="$emit(\'on-key-enter\')" /><input class="emit-input" @input="$emit(\'on-input\')" /></div>',
          },
          VueDatePicker: { template: '<div>DatePicker</div>' },
          ButtonComponent: { template: '<button><slot /></button>' },
          ShimmerLoading: { template: '<div>Shimmer</div>' },
        },
      },
    });

    const vm = fullWrapper.vm as any;
    await vm.$nextTick();
    vm.dataAnggaran = [
      {
        kode_pengelola: 'K1',
        pengelola: 'Pengelola A',
        cost_component_a: 1,
        cost_component_b: 2,
        cost_component_c: 3,
        cost_component_d: 4,
        pembangkits: [
          {
            sentral: 'Sentral A',
            kode_jenis_pembangkit: 'PLTU',
            cost_component_a: 10,
            cost_component_b: 20,
            cost_component_c: 30,
            cost_component_d: 40,
            mesins: [
              {
                mesin: 'Mesin A1',
                cost_component_a: 100,
                cost_component_b: 200,
                cost_component_c: 300,
                cost_component_d: 400,
                detail_mesin_cost_component: [
                  {
                    tahun: 2024,
                    cost_component_a: 11,
                    cost_component_b: 22,
                    cost_component_c: 33,
                    cost_component_d: 44,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        kode_pengelola: 'K2',
        pengelola: 'Pengelola B',
        cost_component_a: 0,
        cost_component_b: 0,
        cost_component_c: 0,
        cost_component_d: 0,
        pembangkits: [],
      },
    ];
    await vm.$nextTick();

    vm.toggleRow('K1');
    vm.togglePembangkit('K1_0');
    await vm.$nextTick();

    await fullWrapper.find('.emit-search').trigger('click');
    await fullWrapper.find('.emit-enter').trigger('click');
    await fullWrapper.find('.emit-input').trigger('input');

    const tbodyRows = fullWrapper.findAll('tbody tr');
    expect(tbodyRows.length).toBeGreaterThan(0);
    await tbodyRows[0].trigger('click');

    const pembangkitCell = fullWrapper.find('td#pembangkit');
    expect(pembangkitCell.exists()).toBe(true);
    await pembangkitCell.trigger('click');
    await fullWrapper.vm.$nextTick();

    expect(fullWrapper.text()).toContain('PLTU Cilacap');
    expect(fullWrapper.text()).toContain('Unit 1');
    expect(fullWrapper.text()).toContain('2023');

    // Force the v-else branch for period picker placeholder shimmer.
    vm.periodeTahun = null;
    await vm.$nextTick();
    expect(fullWrapper.text()).toContain('Shimmer');
  });
});
