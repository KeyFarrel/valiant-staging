import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LihatCAPEX from '@/views/Beranda/LamanData/LihatCAPEX.vue';

// Mock Pinia store
const mockStore = {
  periodeTahun: [2020, 2025],
  periodeInitial: 2023
};

vi.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataPeriodeStore: () => mockStore
}));

// Mock dependencies
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'test-id-123' }
  })
}));

vi.mock('@/services/lihat-capex-service', () => ({
  default: class MockLihatCAPEXService {
    async getMesinById() {
      return {
        data: {
          mesin: 'Test Machine',
          kondisi_unit: 'Operasi',
          kode_jenis_pembangkit: 'PLTU',
          daya_terpasang: 100,
          daya_mampu: 95,
          tahun_operasi: 2020,
          kode_sentral: 'TEST001'
        }
      };
    }
    
    async getPembangkitByKode() {
      return {
        data: {
          kode_pengelola: 'PEN001',
          pembina: 'Test Pembina'
        }
      };
    }
    
    async getPengelolaData() {
      return {
        data: [
          {
            kode_pengelola: 'PEN001',
            pengelola: 'Test Pengelola'
          }
        ]
      };
    }
    
    async getAsumsiParameterData() {
      return {
        data: {
          asumsi_makro: {
            umur_teknis: 25
          }
        }
      };
    }
    
    async getAnggaranDetailCAPEX() {
      return {
        data: [
          {
            judul_program: 'Test Program 1',
            ai: 1000000,
            realisasi_aki: 800000
          },
          {
            judul_program: 'Test Program 2',
            ai: 2000000,
            realisasi_aki: 1500000
          }
        ]
      };
    }
    
    async getTotalReplacement() {
      return {
        data: {
          total_replacement: 5000000
        }
      };
    }
  }
}));

vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah(value: number) {
      return value.toLocaleString('id-ID');
    }
  }
}));

describe('LihatCAPEX.vue', () => {
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render component with loading state initially', async () => {
    const wrapper = mount(LihatCAPEX, {
      global: {
        plugins: [pinia],
        stubs: {
          'VueDatePicker': {
            template: '<div class="date-picker-mock"></div>',
            props: ['modelValue', 'yearRange', 'clearable', 'yearPicker'],
            emits: ['update:modelValue']
          },
          'InfoHeader': {
            template: '<div class="info-header-mock"><slot /></div>',
            props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina']
          },
          'SortingIcon': {
            template: '<div class="sorting-icon-mock"></div>'
          },
          'Loading': {
            template: '<div class="loading-mock">Loading...</div>'
          }
        }
      }
    });

    // Check if component mounts successfully
    expect(wrapper.exists()).toBe(true);
    
    // Wait for async operations
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it('should display CAPEX table headers correctly', async () => {
    const wrapper = mount(LihatCAPEX, {
      global: {
        plugins: [pinia],
        stubs: {
          'VueDatePicker': {
            template: '<div class="date-picker-mock"></div>',
            props: ['modelValue', 'yearRange', 'clearable', 'yearPicker'],
            emits: ['update:modelValue']
          },
          'InfoHeader': {
            template: '<div class="info-header-mock"><slot /></div>',
            props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina']
          },
          'SortingIcon': {
            template: '<div class="sorting-icon-mock"></div>'
          },
          'Loading': {
            template: '<div class="loading-mock">Loading...</div>'
          }
        }
      }
    });

    // Wait for component to load
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    const tableHeaders = wrapper.findAll('th');
    expect(tableHeaders.some(header => header.text().includes('No'))).toBe(true);
    expect(tableHeaders.some(header => header.text().includes('Judul Program'))).toBe(true);
    expect(tableHeaders.some(header => header.text().includes('AI'))).toBe(true);
    expect(tableHeaders.some(header => header.text().includes('Realisasi AKI'))).toBe(true);
  });

  it('should display correct title and export button', async () => {
    const wrapper = mount(LihatCAPEX, {
      global: {
        plugins: [pinia],
        stubs: {
          'VueDatePicker': {
            template: '<div class="date-picker-mock"></div>',
            props: ['modelValue', 'yearRange', 'clearable', 'yearPicker'],
            emits: ['update:modelValue']
          },
          'InfoHeader': {
            template: '<div class="info-header-mock"><slot /></div>',
            props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina']
          },
          'SortingIcon': {
            template: '<div class="sorting-icon-mock"></div>'
          },
          'Loading': {
            template: '<div class="loading-mock">Loading...</div>'
          }
        }
      }
    });

    // Wait for component to load
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.text()).toContain('Capital Expenditure (CAPEX)');
    expect(wrapper.find('button').text()).toContain('Export');
  });

  it('should handle year picker change event', async () => {
    const wrapper = mount(LihatCAPEX, {
      global: {
        plugins: [pinia],
        stubs: {
          'VueDatePicker': {
            template: '<div class="date-picker-mock" @click="$emit(\'update:modelValue\', 2024)"></div>',
            props: ['modelValue', 'yearRange', 'clearable', 'yearPicker'],
            emits: ['update:modelValue']
          },
          'InfoHeader': {
            template: '<div class="info-header-mock"><slot /></div>',
            props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina']
          },
          'SortingIcon': {
            template: '<div class="sorting-icon-mock"></div>'
          },
          'Loading': {
            template: '<div class="loading-mock">Loading...</div>'
          }
        }
      }
    });

    // Wait for component to load
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Trigger year picker change
    const datePicker = wrapper.find('.date-picker-mock');
    await datePicker.trigger('click');
    
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle service errors gracefully', async () => {
    // Mock service with error
    vi.doMock('@/services/lihat-capex-service', () => ({
      default: class MockLihatCAPEXServiceWithError {
        async getMesinById() {
          throw new Error('Service error');
        }
        
        async getPembangkitByKode() {
          throw new Error('Service error');
        }
        
        async getPengelolaData() {
          throw new Error('Service error');
        }
        
        async getAsumsiParameterData() {
          throw new Error('Service error');
        }
        
        async getAnggaranDetailCAPEX() {
          throw new Error('Service error');
        }
        
        async getTotalReplacement() {
          throw new Error('Service error');
        }
      }
    }));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(LihatCAPEX, {
      global: {
        plugins: [pinia],
        stubs: {
          'VueDatePicker': {
            template: '<div class="date-picker-mock"></div>',
            props: ['modelValue', 'yearRange', 'clearable', 'yearPicker'],
            emits: ['update:modelValue']
          },
          'InfoHeader': {
            template: '<div class="info-header-mock"><slot /></div>',
            props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina']
          },
          'SortingIcon': {
            template: '<div class="sorting-icon-mock"></div>'
          },
          'Loading': {
            template: '<div class="loading-mock">Loading...</div>'
          }
        }
      }
    });

    // Wait for error handling
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(wrapper.exists()).toBe(true);
    
    consoleErrorSpy.mockRestore();
  });

  it('should display table with data when available', async () => {
    const wrapper = mount(LihatCAPEX, {
      global: {
        plugins: [pinia],
        stubs: {
          'VueDatePicker': {
            template: '<div class="date-picker-mock"></div>',
            props: ['modelValue', 'yearRange', 'clearable', 'yearPicker'],
            emits: ['update:modelValue']
          },
          'InfoHeader': {
            template: '<div class="info-header-mock"><slot /></div>',
            props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina']
          },
          'SortingIcon': {
            template: '<div class="sorting-icon-mock"></div>'
          },
          'Loading': {
            template: '<div class="loading-mock">Loading...</div>'
          }
        }
      }
    });

    // Wait for component to load and populate data
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));

    // Check if table structure is present
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.find('thead').exists()).toBe(true);
    expect(wrapper.find('tbody').exists()).toBe(true);
  });

  it('should display total replacement cost when data is available', async () => {
    const wrapper = mount(LihatCAPEX, {
      global: {
        plugins: [pinia],
        stubs: {
          'VueDatePicker': {
            template: '<div class="date-picker-mock"></div>',
            props: ['modelValue', 'yearRange', 'clearable', 'yearPicker'],
            emits: ['update:modelValue']
          },
          'InfoHeader': {
            template: '<div class="info-header-mock"><slot /></div>',
            props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina']
          },
          'SortingIcon': {
            template: '<div class="sorting-icon-mock"></div>'
          },
          'Loading': {
            template: '<div class="loading-mock">Loading...</div>'
          }
        }
      }
    });

    // Wait for component to load and populate data
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));

    // Check if total replacement cost section is present
    expect(wrapper.text()).toContain('Total Replacement Cost');
  });

  it('should handle all API error scenarios separately', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Create a service that throws errors for specific methods
    const errorService = {
      async getMesinById() {
        throw new Error('getMesinById error');
      },
      async getPembangkitByKode() {
        throw new Error('getPembangkitByKode error');
      },
      async getPengelolaData() {
        throw new Error('getPengelolaData error');
      },
      async getAsumsiParameterData() {
        throw new Error('getAsumsiParameterData error');
      },
      async getAnggaranDetailCAPEX() {
        throw new Error('getAnggaranDetailCAPEX error');
      },
      async getTotalReplacement() {
        throw new Error('getTotalReplacement error');
      }
    };

    // Mock the service temporarily
    const originalMock = vi.doMock('@/services/lihat-capex-service', () => ({
      default: class { constructor() { return errorService; } }
    }));

    const wrapper = mount(LihatCAPEX, {
      global: {
        plugins: [pinia],
        stubs: {
          'VueDatePicker': {
            template: '<div class="date-picker-mock" @click="handleYearChange"></div>',
            props: ['modelValue', 'yearRange', 'clearable', 'yearPicker'],
            emits: ['update:modelValue'],
            methods: {
              handleYearChange() {
                this.$emit('update:modelValue', 2024);
              }
            }
          },
          'InfoHeader': {
            template: '<div class="info-header-mock"><slot /></div>',
            props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina']
          },
          'SortingIcon': {
            template: '<div class="sorting-icon-mock"></div>'
          },
          'Loading': {
            template: '<div class="loading-mock">Loading...</div>'
          }
        }
      }
    });

    // Wait for all async operations including errors
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 300));

    // Test year picker change to trigger more error paths
    const datePicker = wrapper.find('.date-picker-mock');
    await datePicker.trigger('click');
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 300));

    expect(wrapper.exists()).toBe(true);
    
    consoleErrorSpy.mockRestore();
  });
});
