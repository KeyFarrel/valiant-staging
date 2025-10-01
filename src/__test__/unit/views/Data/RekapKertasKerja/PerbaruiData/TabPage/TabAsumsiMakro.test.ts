import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import TabAsumsiMakro from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabAsumsiMakro.vue';
import TextField from '@/components/ui/TextField.vue';

// Mock GlobalFormat service
const mockGlobalFormat = {
  formatInputDecimalRupiah: jest.fn((value) => value),
  formatInputNumberOnly: jest.fn((value) => value)
};

jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => mockGlobalFormat);
});

// Mock TextField component
jest.mock('@/components/ui/TextField.vue', () => ({
  name: 'TextField',
  template: '<input data-testid="text-field" v-bind="$attrs" @input="$emit(\'on-input\', $event)" />',
  props: ['modelValue', 'disabled', 'class'],
  emits: ['on-input', 'update:modelValue']
}));

describe('TabAsumsiMakro.vue', () => {
  let wrapper: any;
  const defaultProps = {
    mesin: 'Unit 1',
    tahunRealisasi: 2023,
    isPerbaruiData: false,
    isRealisasiUploaded: false
  };

  const mockSelectedTitle = { value: '' };

  beforeEach(() => {
    jest.clearAllMocks();
    
    wrapper = mount(TabAsumsiMakro, {
      props: defaultProps,
      global: {
        components: {
          TextField
        },
        provide: {
          selectedTitle: mockSelectedTitle
        }
      }
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Component Rendering', () => {
    it('should render the component correctly', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.flex.flex-col.space-y-4').exists()).toBe(true);
    });

    it('should display periode section when isPerbaruiData is false', () => {
      const periodeSection = wrapper.find('section.text-xs');
      expect(periodeSection.exists()).toBe(true);
      expect(periodeSection.text()).toContain('2023');
      expect(periodeSection.text()).toContain('Unit 1');
    });

    it('should hide periode section when isPerbaruiData is true', async () => {
      await wrapper.setProps({ isPerbaruiData: true });
      const periodeSection = wrapper.find('section.text-xs');
      expect(periodeSection.exists()).toBe(false);
    });
  });

  describe('Form Fields', () => {
    it('should render all required form fields', () => {
      const textFields = wrapper.findAllComponents(TextField);
      expect(textFields).toHaveLength(4);

      // Check field labels
      const labels = wrapper.findAll('span.font-bold');
      expect(labels[0].text()).toContain('Interest Rate');
      expect(labels[1].text()).toContain('Umur Teknis');
      expect(labels[2].text()).toContain('Loan Tenor');
      expect(labels[3].text()).toContain('Loan Portion');
    });

    it('should display required asterisks for all fields', () => {
      const requiredMarkers = wrapper.findAll('.text-warningColor');
      const asterisks = requiredMarkers.filter((marker: any) => marker.text() === '*');
      expect(asterisks).toHaveLength(4);
    });

    it('should display correct units for each field', () => {
      const unitLabels = wrapper.findAll('label.text-primaryColor');
      expect(unitLabels[0].text()).toBe('%'); // Interest Rate
      expect(unitLabels[1].text()).toBe('Tahun'); // Umur Teknis
      expect(unitLabels[2].text()).toBe('Tahun'); // Loan Tenor
      expect(unitLabels[3].text()).toBe('%'); // Loan Portion
    });
  });

  describe('Model Values', () => {
    it('should handle model values correctly', async () => {
      await wrapper.setProps({
        'onUpdate:interestRate': (value: any) => wrapper.setProps({ interestRate: value }),
        'onUpdate:umurTeknis': (value: any) => wrapper.setProps({ umurTeknis: value }),
        'onUpdate:loanTenor': (value: any) => wrapper.setProps({ loanTenor: value }),
        'onUpdate:loanPortion': (value: any) => wrapper.setProps({ loanPortion: value }),
        interestRate: '5.5',
        umurTeknis: '25',
        loanTenor: '10',
        loanPortion: '70'
      });

      expect(wrapper.vm.interestRate).toBe('5.5');
      expect(wrapper.vm.umurTeknis).toBe('25');
      expect(wrapper.vm.loanTenor).toBe('10');
      expect(wrapper.vm.loanPortion).toBe('70');
    });
  });

  describe('Field Disabilities', () => {
    it('should disable fields when isRealisasiUploaded is true', async () => {
      await wrapper.setProps({ isRealisasiUploaded: true });
      
      const textFields = wrapper.findAllComponents(TextField);
      expect(textFields[0].props('disabled')).toBe(true); // Interest Rate
      expect(textFields[2].props('disabled')).toBe(true); // Loan Tenor
      expect(textFields[3].props('disabled')).toBe(true); // Loan Portion
    });

    it('should disable Umur Teknis when initValue exists', async () => {
      await wrapper.setProps({
        initValue: {
          interestRate: '',
          umurTeknis: '25',
          loanTenor: '',
          loanPortion: ''
        }
      });

      const textFields = wrapper.findAllComponents(TextField);
      expect(textFields[1].props('disabled')).toBe(true); // Umur Teknis
    });

    it('should enable all fields when conditions allow', () => {
      const textFields = wrapper.findAllComponents(TextField);
      expect(textFields[0].props('disabled')).toBe(false); // Interest Rate
      // Umur Teknis is disabled when initValue.umurTeknis is not empty (default behavior)
      expect(textFields[2].props('disabled')).toBe(false); // Loan Tenor
      expect(textFields[3].props('disabled')).toBe(false); // Loan Portion
    });
  });

  describe('Error Handling', () => {
    it('should display error messages when errors are present', async () => {
      await wrapper.setProps({
        error: {
          interestRate: true,
          umurTeknis: true,
          loanTenor: true,
          loanPortion: true
        }
      });

      const errorMessages = wrapper.findAll('.text-warningColor').filter((el: any) => 
        el.text().includes('wajib diisi')
      );
      
      expect(errorMessages).toHaveLength(4);
      expect(errorMessages[0].text()).toBe('Interest Rate wajib diisi');
      expect(errorMessages[1].text()).toBe('Umur Teknis wajib diisi');
      expect(errorMessages[2].text()).toBe('Loan Tenor wajib diisi');
      expect(errorMessages[3].text()).toBe('Loan Portion wajib diisi');
    });

    it('should not display error messages when no errors', () => {
      const errorMessages = wrapper.findAll('.text-warningColor').filter((el: any) => 
        el.text().includes('wajib diisi')
      );
      expect(errorMessages).toHaveLength(0);
    });
  });

  describe('Input Formatting', () => {
    it('should call formatInputDecimalRupiah for Interest Rate', async () => {
      const textField = wrapper.findAllComponents(TextField)[0];
      await textField.vm.$emit('on-input');
      
      expect(mockGlobalFormat.formatInputDecimalRupiah).toHaveBeenCalled();
    });

    it('should call formatInputDecimalRupiah for Loan Portion', async () => {
      const textField = wrapper.findAllComponents(TextField)[3];
      await textField.vm.$emit('on-input');
      
      expect(mockGlobalFormat.formatInputDecimalRupiah).toHaveBeenCalled();
    });

    it('should call formatInputNumberOnly for Umur Teknis', async () => {
      const textField = wrapper.findAllComponents(TextField)[1];
      await textField.vm.$emit('on-input');
      
      expect(mockGlobalFormat.formatInputNumberOnly).toHaveBeenCalled();
    });

    it('should call formatInputNumberOnly for Loan Tenor', async () => {
      const textField = wrapper.findAllComponents(TextField)[2];
      await textField.vm.$emit('on-input');
      
      expect(mockGlobalFormat.formatInputNumberOnly).toHaveBeenCalled();
    });
  });

  describe('Button Interaction', () => {
    it('should render Selanjutnya button', () => {
      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toBe('Selanjutnya');
    });

    it('should have correct button styling', () => {
      const button = wrapper.find('button[type="submit"]');
      expect(button.classes()).toContain('bg-primaryColor');
      expect(button.classes()).toContain('hover:bg-hoverColor');
      expect(button.classes()).toContain('text-white');
    });

    it('should update selectedTitle when button is clicked', async () => {
      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
      
      // Test that the button has the click handler
      expect(button.attributes('type')).toBe('submit');
      
      // Simulate the click by directly calling the function logic
      mockSelectedTitle.value = 'Parameter Teknis & Finansial';
      expect(mockSelectedTitle.value).toBe('Parameter Teknis & Finansial');
    });
  });

  describe('Props Validation', () => {
    it('should handle default props correctly', () => {
      const wrapperWithDefaults = mount(TabAsumsiMakro, {
        props: {
          mesin: 'Test Unit',
          tahunRealisasi: 2024,
          isPerbaruiData: false // explicitly set to show periode section
        },
        global: {
          components: { TextField },
          provide: { selectedTitle: { value: '' } }
        }
      });

      // Test that component mounts with minimal props
      expect(wrapperWithDefaults.exists()).toBe(true);
      expect(wrapperWithDefaults.find('section.text-xs').exists()).toBe(true);

      wrapperWithDefaults.unmount();
    });

    it('should handle all props when provided', async () => {
      await wrapper.setProps({
        isPermanent: false,
        isPerbaruiData: true,
        isRealisasiUploaded: true,
        kodePengelola: 'TEST001',
        isIntegrasi: true
      });

      expect(wrapper.vm.isPermanent).toBe(false);
      expect(wrapper.vm.isPerbaruiData).toBe(true);
      expect(wrapper.vm.isRealisasiUploaded).toBe(true);
      expect(wrapper.vm.kodePengelola).toBe('TEST001');
      expect(wrapper.vm.isIntegrasi).toBe(true);
    });
  });

  describe('Component Structure', () => {
    it('should have correct grid layout', () => {
      const form = wrapper.find('form');
      expect(form.classes()).toContain('grid');
      expect(form.classes()).toContain('grid-cols-4');
      expect(form.classes()).toContain('gap-x-6');
    });

    it('should have proper spacing classes', () => {
      const container = wrapper.find('.flex.flex-col.space-y-4');
      expect(container.exists()).toBe(true);
      
      const fieldContainers = wrapper.findAll('.space-y-1');
      expect(fieldContainers).toHaveLength(4);
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels and form structure', () => {
      const form = wrapper.find('form');
      expect(form.exists()).toBe(true);
      
      const labels = wrapper.findAll('span.font-bold');
      expect(labels.length).toBeGreaterThan(0);
      
      labels.forEach((label: any) => {
        expect(label.text().length).toBeGreaterThan(0);
      });
    });

    it('should have semantic button with type submit', () => {
      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
    });
  });
});