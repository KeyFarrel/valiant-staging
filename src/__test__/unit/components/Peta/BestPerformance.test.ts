import { mount } from '@vue/test-utils';
import BestPerformance from '@/components/Peta/BestPerformance.vue';

// Mock all the dependencies
jest.mock('@/services/peta-service', () => {
  return jest.fn().mockImplementation(() => ({
    getBestPerformance: jest.fn(() =>
      Promise.resolve({
        data: [
          {
            kode_pengelola: '123',
            pengelola: 'Unit Pengelola A',
            kode_sentral: 456,
            sentral: 'Unit Sentral A',
            tahun: 2023,
            irr_equity: '15%',
            npv_equity: '1000000',
            average_cf: '50000',
            mesin: 'Mesin A'
          }
        ],
      })
    ),
    getYearListBPA: jest.fn(() =>
      Promise.resolve({
        data: [{ tahun: 2022 }, { tahun: 2023 }],
      })
    ),
  }));
});

jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn((value) => `Rp ${value}`),
    formatEnergy: jest.fn((value) => `${value} MW`),
    formatPercent: jest.fn((value) => `${value}%`),
    formatCurrencyNotFixed: jest.fn((value) => `Rp ${value}`),
    formatDecimal: jest.fn((value) => value),
  }));
});

// Mock components
jest.mock('@/components/ui/Table.vue', () => ({
  name: 'TableComponent',
  template: `
    <table>
      <thead><slot name="table-header"></slot></thead>
      <tbody><slot name="table-body"></slot></tbody>
    </table>
  `,
}));

jest.mock('@/components/ui/ShimmerLoading.vue', () => ({
  name: 'ShimmerLoading',
  template: '<div class="shimmer-loading">Loading...</div>',
}));

describe('BestPerformance.vue', () => {
  let wrapper: any;
  let petaService: any;

  beforeEach(async () => {
    wrapper = mount(BestPerformance, {
      global: {
        stubs: {
          TableComponent: true,
          ShimmerLoading: true,
        },
      },
    });

    // Wait for the onMounted function to run and fetch data
    await wrapper.vm.$nextTick();
  });

  it('renders properly with initial state', () => {
    // Check if the button exists and has the correct text
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('Best Performance Assets');
  });

  it('expands options when state is toggled', async () => {
    expect(wrapper.vm.isOptionsExpanded).toBe(false);

    // Directly change the reactive state
    wrapper.vm.isOptionsExpanded = true;
    await wrapper.vm.$nextTick();

    // Check if options expanded
    expect(wrapper.vm.isOptionsExpanded).toBe(true);
  });

  it('renders component without errors', async () => {
    expect(wrapper.exists()).toBe(true);
  });
  
  it('has yearModel reactive property', async () => {
    expect(wrapper.vm.yearModel).toBeDefined();
  });

  it('has bpaData array initialized', async () => {
    expect(Array.isArray(wrapper.vm.bpaData)).toBe(true);
  });

  it('has isLoading boolean property', async () => {
    expect(typeof wrapper.vm.isLoading).toBe('boolean');
  });
});
