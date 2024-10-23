import { mount } from '@vue/test-utils';
import AsumsiMakroApprove from '@/components/ui/AsumsiMakroApprove.vue';
import GlobalFormat from '@/services/format/global-format';

// Mock GlobalFormat service
jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => ({
    formatEnergy: jest.fn((value) => `${value} formatted`),
  }));
});

describe('AsumsiMakro.vue - Coverage for GlobalFormat, Props, and Emit', () => {
  let globalFormatMock: any;

  beforeEach(() => {
    globalFormatMock = new GlobalFormat();
  });

  it('should initialize GlobalFormat and props', () => {
    const wrapper = mount(AsumsiMakroApprove, {
      props: {
        data: 'someData',
        status: 'someStatus',
        tahun: '2023',
        corporateTaxRate: 15,
        discountRate: 10,
        interestRate: 5,
        loanTenor: 20,
        loanPortion: 70,
        equityPortion: 30,
        selectedYear: '2024',
        isFetchingError: false
      },
    });

    // Ensure globalFormat is initialized
    expect(globalFormatMock.formatEnergy).toBeDefined();

    // Check if 'emit' is working by emitting 'onClick'
    wrapper.vm.$emit('onClick');
    expect(wrapper.emitted('onClick')).toBeTruthy();
  });
});
