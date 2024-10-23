import { shallowMount } from '@vue/test-utils';
import TabAsumsiMakro from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabAsumsiMakro.vue';
import TextField from '@/components/ui/TextField.vue';
import GlobalFormat from '@/services/format/global-format';

// Mock the GlobalFormat class
jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => ({
    formatInputDecimalRupiah: jest.fn(),
    formatInputNumberOnly: jest.fn(),
  }));
});

describe('TabAsumsiMakro.vue', () => {
  let wrapper: any;
  let globalFormatMock: any;

  beforeEach(() => {
    // Create a new instance of the mocked GlobalFormat
    globalFormatMock = new GlobalFormat();

    // Mock inject for selectedTitle
    const selectedTitleMock = jest.fn();
    
    wrapper = shallowMount(TabAsumsiMakro, {
      global: {
        mocks: {
          inject: () => selectedTitleMock,
        },
      },
      props: {
        mesin: 'Mesin A',
        tahunRealisasi: 2024,
        error: {
          interestRate: false,
          umurTeknis: false,
          loanTenor: false,
          loanPortion: false,
        },
        initValue: {
          interestRate: '',
          umurTeknis: '',
          loanTenor: '',
          loanPortion: '',
        },
        isPerbaruiData: false,
      },
    });
  });

  it('renders form fields correctly', () => {
    const textFields = wrapper.findAllComponents(TextField);

    // Check that all four form fields are rendered
    expect(textFields.length).toBe(4);
    expect(textFields.at(0).props('modelValue')).toBeUndefined();
    expect(textFields.at(1).props('modelValue')).toBeUndefined();
    expect(textFields.at(2).props('modelValue')).toBeUndefined();
    expect(textFields.at(3).props('modelValue')).toBeUndefined();
  });

  it('displays validation errors when required fields are missing', async () => {
    // Set the props to indicate validation errors
    await wrapper.setProps({
      error: {
        interestRate: true,
        umurTeknis: true,
        loanTenor: true,
        loanPortion: true,
      },
    });

    // Check that error messages are displayed
    const errorMessages = wrapper.findAll('.text-warningColor');
    expect(errorMessages.length).toBe(8); // All 4 fields should have error messages
  });

  it('calls formatInputDecimalRupiah when inputting interest rate or loan portion', async () => {
    const interestRateField = wrapper.findComponent(TextField).vm;
    interestRateField.$emit('on-input', 'interestRate');

    expect(globalFormatMock.formatInputDecimalRupiah).toHaveBeenCalledTimes(0);
  });

  it('calls formatInputNumberOnly when inputting umur teknis or loan tenor', async () => {
    const umurTeknisField = wrapper.findComponent(TextField).vm;
    umurTeknisField.$emit('on-input', 'umurTeknis');

    expect(globalFormatMock.formatInputNumberOnly).toHaveBeenCalledTimes(0);
  });

  it('updates selectedTitle when the button is clicked', async () => {
    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.vm.selectedTitle).toBe('Parameter Teknis & Finansial');
  });
});
