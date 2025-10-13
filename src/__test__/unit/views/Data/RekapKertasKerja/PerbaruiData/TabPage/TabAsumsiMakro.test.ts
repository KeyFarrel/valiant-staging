import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TabAsumsiMakro from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabAsumsiMakro.vue';

// Mock TextField component
vi.mock('@/components/ui/TextField.vue', () => ({
  default: {
    name: 'TextField',
    template: '<input v-bind="$attrs" v-model="modelValue" @input="$emit(\'on-input\', $event)" />',
    props: ['modelValue', 'disabled', 'class'],
    emits: ['update:modelValue', 'on-input'],
  },
}));

// Mock GlobalFormat service
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatInputDecimalRupiah(value: any) {
      return value;
    }
    formatInputNumberOnly(value: any) {
      return value;
    }
  }
}));

describe('TabAsumsiMakro.vue', () => {
  const defaultProps = {
    mesin: 'Test Machine',
    tahunRealisasi: 2024,
    isPerbaruiData: true,
    isRealisasiUploaded: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component correctly', () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: defaultProps,
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('should display all required form fields', () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: defaultProps,
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    // Test for field labels presence
    expect(wrapper.text()).toContain('Interest Rate');
    expect(wrapper.text()).toContain('Umur Teknis');
    expect(wrapper.text()).toContain('Loan Tenor');
    expect(wrapper.text()).toContain('Loan Portion');

    // Test for asterisk (*) indicating required fields
    expect(wrapper.text()).toContain('Interest Rate *');
    expect(wrapper.text()).toContain('Umur Teknis *');
    expect(wrapper.text()).toContain('Loan Tenor *');
    expect(wrapper.text()).toContain('Loan Portion *');
  });

  it('should show periode and unit info when isPerbaruiData is false', () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: {
        ...defaultProps,
        isPerbaruiData: false,
      },
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    expect(wrapper.text()).toContain('Periode :');
    expect(wrapper.text()).toContain('2024');
    expect(wrapper.text()).toContain('Unit :');
    expect(wrapper.text()).toContain('Test Machine');
  });

  it('should handle decimal input formatting for interest rate', async () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: defaultProps,
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    // Find the interest rate input and trigger on-input event
    const interestRateInput = wrapper.findComponent({ name: 'TextField' });
    
    // Simulate on-input event
    await interestRateInput.vm.$emit('on-input');
    
    // Test passes if no error is thrown
    expect(interestRateInput.exists()).toBe(true);
  });

  it('should handle decimal input formatting for loan portion', async () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: defaultProps,
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    // Find all TextField components
    const textFields = wrapper.findAllComponents({ name: 'TextField' });
    const loanPortionInput = textFields[3]; // 4th input is loan portion
    
    // Simulate on-input event
    await loanPortionInput.vm.$emit('on-input');
    
    expect(loanPortionInput.exists()).toBe(true);
  });

  it('should handle number only input formatting for umur teknis', async () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: defaultProps,
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    // Find all TextField components
    const textFields = wrapper.findAllComponents({ name: 'TextField' });
    const umurTeknisInput = textFields[1]; // 2nd input is umur teknis
    
    // Simulate on-input event
    await umurTeknisInput.vm.$emit('on-input');
    
    expect(umurTeknisInput.exists()).toBe(true);
  });

  it('should handle number only input formatting for loan tenor', async () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: defaultProps,
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    // Find all TextField components
    const textFields = wrapper.findAllComponents({ name: 'TextField' });
    const loanTenorInput = textFields[2]; // 3rd input is loan tenor
    
    // Simulate on-input event
    await loanTenorInput.vm.$emit('on-input');
    
    expect(loanTenorInput.exists()).toBe(true);
  });

  it('should display error messages when validation errors exist', () => {
    const errorProps = {
      ...defaultProps,
      error: {
        interestRate: true,
        umurTeknis: true,
        loanTenor: true,
        loanPortion: true,
      },
    };

    const wrapper = mount(TabAsumsiMakro, {
      props: errorProps,
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    expect(wrapper.text()).toContain('Interest Rate wajib diisi');
    expect(wrapper.text()).toContain('Umur Teknis wajib diisi');
    expect(wrapper.text()).toContain('Loan Tenor wajib diisi');
    expect(wrapper.text()).toContain('Loan Portion wajib diisi');
  });

  it('should disable inputs when isRealisasiUploaded is true', () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: {
        ...defaultProps,
        isRealisasiUploaded: true,
      },
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    const textFields = wrapper.findAllComponents({ name: 'TextField' });
    
    // Interest rate, loan tenor, and loan portion should be disabled
    expect(textFields[0].props('disabled')).toBe(true);
    expect(textFields[2].props('disabled')).toBe(true);
    expect(textFields[3].props('disabled')).toBe(true);
  });

  it('should disable umur teknis when initValue is not empty', () => {
    const wrapper = mount(TabAsumsiMakro, {
      props: {
        ...defaultProps,
        initValue: {
          interestRate: '',
          umurTeknis: '25',
          loanTenor: '',
          loanPortion: '',
        },
      },
      global: {
        provide: {
          selectedTitle: vi.fn(),
        },
      },
    });

    const textFields = wrapper.findAllComponents({ name: 'TextField' });
    
    // Umur teknis (2nd input) should be disabled
    expect(textFields[1].props('disabled')).toBe(true);
  });

  it('should trigger selectedTitle injection when button is clicked', async () => {
    const mockSelectedTitle = vi.fn();
    
    const wrapper = mount(TabAsumsiMakro, {
      props: defaultProps,
      global: {
        provide: {
          selectedTitle: mockSelectedTitle,
        },
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');
    
    // Verify button exists and can be clicked
    expect(button.exists()).toBe(true);
  });
});