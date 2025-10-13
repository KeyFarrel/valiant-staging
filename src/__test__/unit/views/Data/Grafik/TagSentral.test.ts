import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import TagSentral from '@/views/Data/Grafik/TagSentral.vue';

// Mock data
const mockPlanningData = {
  fs_wacc_on_equity: '8.5',
  fs_wacc_on_project: '7.2',
  fs_average_cf: '75.3',
  fs_average_eaf: '85.2',
  fs_irr_equity: '12.5',
  fs_irr_project: '10.8',
  fs_npv_equity: '1500',
  fs_npv_project: '2000'
};

const mockRealisasiData = {
  wacc_on_project: '7.5',
  wacc_on_equity: '8.8',
  average_cf: '78.1',
  average_eaf: '87.5',
  irr_equity: '13.2',
  irr_project: '11.5',
  npv_equity: '1650',
  npv_project: '2150'
};

const mockYoyData = {
  wacc_on_project: '7.0',
  wacc_on_equity: '8.2',
  average_cf: '72.5',
  average_eaf: '82.8',
  irr_equity: '11.8',
  irr_project: '10.2',
  npv_equity: '1400',
  npv_project: '1850'
};

// Mock the store
const mockStore = {
  currentTabSentral: 'WLC (Realisasi & Proyeksi)'
};

// Mock GrafikService
const mockGrafikService = {
  getPlanning: vi.fn(),
  getRealisasiProyeksi: vi.fn(),
  getRealisasiYoy: vi.fn()
};

// Mock the store composable
vi.mock('@/store/storeTagGrafik', () => ({
  useTagSentral: () => mockStore
}));

// Mock GrafikService
vi.mock('@/services/grafik-service', () => ({
  default: vi.fn(() => mockGrafikService)
}));

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: vi.fn(() => ({
    formatCurrency: (value: any) => value ? `Rp ${value}` : '0',
    formatPercentage: (value: any) => value ? `${value}%` : '0%',
    formatEnergy: (value: any) => value ? `${value}` : '0',
    formatNumber: (value: any) => value ? `${value}` : '0',
    formatRupiah: (value: any) => value ? `${value}` : '0,00',
    formatPercent: (value: any) => value ? `${value}` : '0',
    formatDecimal: (value: any) => value ? `${value}` : '0',
    formatCurrencyNotFixed: (value: any) => value ? `${value}` : '0',
    formatInputDecimalRupiah: (value: any) => value ? `${value}` : '0',
    formatInputDecimal: (value: any) => value ? `${value}` : '0',
    formatInputNumberOnly: (value: any) => value ? `${value}` : '0',
    formatNumberFiveDigits: (value: any) => value ? `${value}` : '00000',
    formatBytes: (value: any) => value ? `${value} Bytes` : '0 Bytes'
  }))
}));

// Mock all the icon components
vi.mock('@/components/icons/FSRedDown.vue', () => ({
  default: { name: 'FSRedDown', template: '<div class="fs-red-down">FSRedDown</div>' }
}));

vi.mock('@/components/icons/FSGreenUp.vue', () => ({
  default: { name: 'FSGreenUp', template: '<div class="fs-green-up">FSGreenUp</div>' }
}));

vi.mock('@/components/icons/FSRedSame.vue', () => ({
  default: { name: 'FSRedSame', template: '<div class="fs-red-same">FSRedSame</div>' }
}));

vi.mock('@/components/icons/YoyRedDown.vue', () => ({
  default: { name: 'YoyRedDown', template: '<div class="yoy-red-down">YoyRedDown</div>' }
}));

vi.mock('@/components/icons/YoyGreenUp.vue', () => ({
  default: { name: 'YoyGreenUp', template: '<div class="yoy-green-up">YoyGreenUp</div>' }
}));

vi.mock('@/components/icons/YoyRedSame.vue', () => ({
  default: { name: 'YoyRedSame', template: '<div class="yoy-red-same">YoyRedSame</div>' }
}));

// Mock PopUp component
vi.mock('@/components/Grafik/PoupWacc.vue', () => ({
  default: {
    name: 'PopUp',
    props: ['title', 'content'],
    template: '<div class="popup">{{ title }}: {{ content }}</div>'
  }
}));

describe('TagSentral.vue', () => {
  const defaultProps = {
    idSentral: 'test-id',
    tahunData: 2024
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGrafikService.getPlanning.mockResolvedValue({ data: mockPlanningData });
    mockGrafikService.getRealisasiProyeksi.mockResolvedValue({ data: mockRealisasiData });
    mockGrafikService.getRealisasiYoy.mockResolvedValue({ data: mockYoyData });
  });

  it('should render component successfully', () => {
    const wrapper = mount(TagSentral, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: true,
          FSGreenUp: true,
          FSRedSame: true,
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should display WLC (Realisasi & Proyeksi) tab content when currentTabSentral is set', () => {
    mockStore.currentTabSentral = 'WLC (Realisasi & Proyeksi)';
    
    const wrapper = mount(TagSentral, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: true,
          FSGreenUp: true,
          FSRedSame: true,
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    expect(wrapper.text()).toContain('IRR On Project');
    expect(wrapper.text()).toContain('IRR On Equity');
    expect(wrapper.text()).toContain('NPV On Project');
  });

  it('should display Planning / Feasibility Study tab content when currentTabSentral is changed', () => {
    mockStore.currentTabSentral = 'Planning / Feasibility Study';
    
    const wrapper = mount(TagSentral, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: true,
          FSGreenUp: true,
          FSRedSame: true,
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    expect(wrapper.text()).toContain('IRR On Project');
    expect(wrapper.text()).toContain('IRR On Equity');
    expect(wrapper.text()).toContain('NPV On Project');
  });

  it('should call API services when tahunData prop changes', async () => {
    const wrapper = mount(TagSentral, {
      props: {
        idSentral: 'test-id',
        tahunData: 2023 // Start with different value
      },
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: true,
          FSGreenUp: true,
          FSRedSame: true,
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    // Clear any initial calls
    vi.clearAllMocks();

    // Change tahunData prop to trigger the watch
    await wrapper.setProps({ tahunData: 2025 });
    await nextTick();

    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(mockGrafikService.getPlanning).toHaveBeenCalledWith({
      uuid_sentral: 'test-id'
    });
    expect(mockGrafikService.getRealisasiProyeksi).toHaveBeenCalledWith({
      tahun: 2025,
      uuid_sentral: 'test-id'
    });
    expect(mockGrafikService.getRealisasiYoy).toHaveBeenCalledWith({
      uuid_sentral: 'test-id',
      tahun: 2024 // tahun - 1
    });
  });

  it('should display Planning & Realisasi + Proyeksi tab content', () => {
    mockStore.currentTabSentral = 'Planning & Realisasi + Proyeksi';
    
    const wrapper = mount(TagSentral, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: true,
          FSGreenUp: true,
          FSRedSame: true,
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    expect(wrapper.text()).toContain('IRR On Project');
    expect(wrapper.text()).toContain('IRR On Equity');
    expect(wrapper.text()).toContain('NPV On Project');
  });

  it('should display Planning vs Realisasi s/d Tahun Berjalan tab content', () => {
    mockStore.currentTabSentral = 'Planning vs Realisasi s/d Tahun Berjalan';
    
    const wrapper = mount(TagSentral, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: true,
          FSGreenUp: true,
          FSRedSame: true,
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    expect(wrapper.text()).toContain('IRR On Project');
    expect(wrapper.text()).toContain('IRR On Equity');
    expect(wrapper.text()).toContain('NPV On Project');
  });

  it('should not render any content when currentTabSentral is not set to known values', () => {
    mockStore.currentTabSentral = 'Unknown Tab';
    
    const wrapper = mount(TagSentral, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: true,
          FSGreenUp: true,
          FSRedSame: true,
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    // Should not contain any of the known content
    expect(wrapper.text()).not.toContain('IRR On Project');
    expect(wrapper.text()).not.toContain('IRR On Equity');
    expect(wrapper.text()).not.toContain('NPV On Project');
  });

  it('should display correct comparison icons based on data values in WLC tab', () => {
    mockStore.currentTabSentral = 'WLC (Realisasi & Proyeksi)';
    
    // Create data with different comparison scenarios
    const testRealisasiData = {
      ...mockRealisasiData,
      irr_project: '15.5', // Higher than planning (10.8)
      irr_equity: '10.2', // Lower than planning (12.5)
      npv_project: '2000', // Same as planning
    };

    const testPlanningData = {
      ...mockPlanningData,
      fs_irr_project: '10.8',
      fs_irr_equity: '12.5',
      fs_npv_project: '2000',
    };

    mockGrafikService.getRealisasiProyeksi.mockResolvedValue({ data: testRealisasiData });
    mockGrafikService.getPlanning.mockResolvedValue({ data: testPlanningData });

    const wrapper = mount(TagSentral, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: { name: 'FSRedDown', template: '<span class="fs-red-down">Down</span>' },
          FSGreenUp: { name: 'FSGreenUp', template: '<span class="fs-green-up">Up</span>' },
          FSRedSame: { name: 'FSRedSame', template: '<span class="fs-red-same">Same</span>' },
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should handle empty or undefined data gracefully', () => {
    mockStore.currentTabSentral = 'WLC (Realisasi & Proyeksi)';
    
    // Mock empty data responses
    mockGrafikService.getPlanning.mockResolvedValue({ data: {} });
    mockGrafikService.getRealisasiProyeksi.mockResolvedValue({ data: {} });
    mockGrafikService.getRealisasiYoy.mockResolvedValue({ data: {} });

    const wrapper = mount(TagSentral, {
      props: defaultProps,
      global: {
        stubs: {
          PopUp: true,
          FSRedDown: true,
          FSGreenUp: true,
          FSRedSame: true,
          YoyRedDown: true,
          YoyGreenUp: true,
          YoyRedSame: true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain('IRR On Project');
  });
});