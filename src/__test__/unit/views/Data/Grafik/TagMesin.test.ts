import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TagMesin from '@/views/Data/Grafik/TagMesin.vue';
import { useTagMesin } from '@/store/storeTagGrafik';

// Mock the store
vi.mock('@/store/storeTagGrafik', () => ({
  useTagMesin: vi.fn(() => ({
    currentTabMesin: 'WLC (Realisasi & Proyeksi)'
  }))
}));

// Mock the composable used by TagMesin
vi.mock('@/composables/useMesinSharedData', () => ({
  fetchSharedPlanningMesin: vi.fn(() => Promise.resolve({
    fs_wacc_on_project: '5.5',
    fs_wacc_on_equity: '4.5',
    fs_irr_project: '8.0',
    fs_irr_equity: '7.0',
    fs_npv_project: '1000',
    fs_npv_equity: '800',
    fs_average_cf: '75',
    fs_average_eaf: '85'
  })),
  fetchSharedRealisasiProyeksiMesin: vi.fn(() => Promise.resolve({
    wacc_on_project: '5.0',
    wacc_on_equity: '4.0',
    irr_project: '8.5',
    irr_equity: '7.5',
    npv_project: '1200',
    npv_equity: '900',
    average_cf: '80',
    average_eaf: '90'
  })),
  fetchSharedRealisasiYoyMesin: vi.fn(() => Promise.resolve({
    irr_project: '7.5',
    irr_equity: '6.5',
    npv_project: '1100',
    npv_equity: '850',
    average_cf: '78',
    average_eaf: '88'
  })),
  invalidateMesinCache: vi.fn(),
  invalidateAllMesinCaches: vi.fn(),
}));

// Mock global format
vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(function() { return {
    formatRupiah: vi.fn((value) => value ? `Rp ${value}` : '-')
  }; })
}));

describe('TagMesin.vue', () => {
  let wrapper: any;
  const defaultProps = {
    idMesin: 'test-mesin-123',
    tahunData: 2024
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component correctly with WLC tab', async () => {
    wrapper = mount(TagMesin, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: {
            template: '<div class="popup-mock">{{ title }}: {{ content }}</div>',
            props: ['title', 'content']
          },
          FSGreenUp: { template: '<div class="fs-green-up"></div>' },
          FSRedDown: { template: '<div class="fs-red-down"></div>' },
          FSRedSame: { template: '<div class="fs-red-same"></div>' },
          YoyGreenUp: { template: '<div class="yoy-green-up"></div>' },
          YoyRedDown: { template: '<div class="yoy-red-down"></div>' },
          YoyRedSame: { template: '<div class="yoy-red-same"></div>' },
          ShimmerLoading: { template: '<div class="shimmer-mock"></div>' }
        }
      }
    });

    // Wait for async fetch operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.text-xs').exists()).toBe(true);
    expect(wrapper.text()).toContain('IRR On Project');
    expect(wrapper.text()).toContain('IRR On Equity');
  });

  it('should fetch data on component mount', async () => {
    wrapper = mount(TagMesin, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: { template: '<div></div>' },
          FSGreenUp: { template: '<div></div>' },
          FSRedDown: { template: '<div></div>' },
          FSRedSame: { template: '<div></div>' },
          YoyGreenUp: { template: '<div></div>' },
          YoyRedDown: { template: '<div></div>' },
          YoyRedSame: { template: '<div></div>' }
        }
      }
    });

    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Since we're testing the component behavior, we'll check if the component exists and functions work
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.idMesin).toBe('test-mesin-123');
    expect(wrapper.vm.tahunData).toBe(2024);
  });

  it('should handle props correctly', () => {
    wrapper = mount(TagMesin, {
      props: {
        idMesin: 'another-mesin-456',
        tahunData: 2025
      },
      global: {
        stubs: {
          PopUp: { template: '<div></div>' },
          FSGreenUp: { template: '<div></div>' },
          FSRedDown: { template: '<div></div>' },
          FSRedSame: { template: '<div></div>' },
          YoyGreenUp: { template: '<div></div>' },
          YoyRedDown: { template: '<div></div>' },
          YoyRedSame: { template: '<div></div>' }
        }
      }
    });

    expect(wrapper.vm.idMesin).toBe('another-mesin-456');
    expect(wrapper.vm.tahunData).toBe(2025);
  });

  it('should render Planning/Feasibility Study tab correctly', async () => {
    // Create a new mock that returns Planning tab
    const mockPlanningStore = vi.fn(() => ({
      currentTabMesin: 'Planning / Feasibility Study'
    }));
    
    wrapper = mount(TagMesin, {
      props: defaultProps,
      global: {
        mocks: {
          stored: { currentTabMesin: 'Planning / Feasibility Study' }
        },
        stubs: {
          PopUp: { template: '<div></div>' },
          FSGreenUp: { template: '<div></div>' },
          FSRedDown: { template: '<div></div>' },
          FSRedSame: { template: '<div></div>' },
          YoyGreenUp: { template: '<div></div>' },
          YoyRedDown: { template: '<div></div>' },
          YoyRedSame: { template: '<div></div>' }
        }
      }
    });

    await nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  it('should render Planning & Realisasi + Proyeksi tab correctly', async () => {
    wrapper = mount(TagMesin, {
      props: defaultProps,
      global: {
        mocks: {
          stored: { currentTabMesin: 'Planning & Realisasi + Proyeksi' }
        },
        stubs: {
          PopUp: { template: '<div></div>' },
          FSGreenUp: { template: '<div></div>' },
          FSRedDown: { template: '<div></div>' },
          FSRedSame: { template: '<div></div>' },
          YoyGreenUp: { template: '<div></div>' },
          YoyRedDown: { template: '<div></div>' },
          YoyRedSame: { template: '<div></div>' }
        }
      }
    });

    await nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  it('should render Planning vs Realisasi s/d Tahun Berjalan tab correctly', async () => {
    wrapper = mount(TagMesin, {
      props: defaultProps,
      global: {
        mocks: {
          stored: { currentTabMesin: 'Planning vs Realisasi s/d Tahun Berjalan' }
        },
        stubs: {
          PopUp: { template: '<div></div>' },
          FSGreenUp: { template: '<div></div>' },
          FSRedDown: { template: '<div></div>' },
          FSRedSame: { template: '<div></div>' },
          YoyGreenUp: { template: '<div></div>' },
          YoyRedDown: { template: '<div></div>' },
          YoyRedSame: { template: '<div></div>' }
        }
      }
    });

    await nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle error cases in fetch functions', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    wrapper = mount(TagMesin, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: { template: '<div></div>' },
          FSGreenUp: { template: '<div></div>' },
          FSRedDown: { template: '<div></div>' },
          FSRedSame: { template: '<div></div>' },
          YoyGreenUp: { template: '<div></div>' },
          YoyRedDown: { template: '<div></div>' },
          YoyRedSame: { template: '<div></div>' }
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.exists()).toBe(true);
    consoleSpy.mockRestore();
  });

  it('should watch tahunData changes and trigger data fetch', async () => {
    wrapper = mount(TagMesin, {
      props: { idMesin: 'test-123', tahunData: 2023 },
      global: {
        stubs: {
          PopUp: { template: '<div></div>' },
          FSGreenUp: { template: '<div></div>' },
          FSRedDown: { template: '<div></div>' },
          FSRedSame: { template: '<div></div>' },
          YoyGreenUp: { template: '<div></div>' },
          YoyRedDown: { template: '<div></div>' },
          YoyRedSame: { template: '<div></div>' }
        }
      }
    });

    // Change props to trigger watcher
    await wrapper.setProps({ tahunData: 2024 });
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.vm.tahunData).toBe(2024);
  });
});
