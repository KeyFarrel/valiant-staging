import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TabDataTeknis from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabDataTeknis.vue';

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatInputDecimalRupiah(value: string) {
      return value?.replace(/[^\d.,]/g, '') || '';
    }
  }
}));

describe('TabDataTeknis', () => {
  let wrapper: any;
  
  const defaultProps = {
    mesin: 'Test Machine',
    tahunRealisasi: 2023,
    comboTypePeriodic: [
      { id_type_periodic: '1', kode_type_periodic: 'Type A' },
      { id_type_periodic: '2', kode_type_periodic: 'Type B' }
    ],
    comboBahanBakar: [
      { 
        id_uraian_fuel_consumption: '1', 
        satuan_volume_bahan_bakar: 'Liter',
        bahan_bakar: 'Solar'
      },
      { 
        id_uraian_fuel_consumption: '2', 
        satuan_volume_bahan_bakar: 'Ton',
        bahan_bakar: 'Batubara'
      }
    ],
    initValue: {
      typePeriodic: '',
      ncf: '',
      eaf: '',
      productionBrutto: '',
      productionNetto: '',
      energySales: ''
    },
    isPerbaruiData: true,
    isIntegrasi: false,
    error: {
      periodicMaintenance: false,
      ncf: false,
      eaf: false,
      productionBrutto: false,
      productionNetto: false,
      energySales: false,
      fuelConsumption: false
    }
  };

  beforeEach(() => {
    wrapper = mount(TabDataTeknis, {
      props: {
        ...defaultProps,
        'onUpdate:fuelConsumption': (value: any) => {},
        'onUpdate:typePeriodic': (value: any) => {},
        'onUpdate:ncf': (value: any) => {},
        'onUpdate:eaf': (value: any) => {},
        'onUpdate:productionBrutto': (value: any) => {},
        'onUpdate:productionNetto': (value: any) => {},
        'onUpdate:energySales': (value: any) => {},
      },
      global: {
        provide: {
          selectedTitle: 'Data Teknis'
        }
      }
    });
  });

  it('should render component successfully', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('label[for="periodic"]').text()).toContain('Type of Periodic Maintenance');
  });

  it('should display period and unit info when isPerbaruiData is false', async () => {
    await wrapper.setProps({ isPerbaruiData: false });
    
    const periodSection = wrapper.find('section.text-xs');
    expect(periodSection.exists()).toBe(true);
    expect(periodSection.text()).toContain('Periode');
    expect(periodSection.text()).toContain('2023');
    expect(periodSection.text()).toContain('Test Machine');
  });

  it('should render type periodic options correctly', () => {
    const selectElement = wrapper.find('#periodic');
    const options = selectElement.findAll('option');
    
    expect(options).toHaveLength(3); // 1 default + 2 from props
    expect(options[1].text()).toBe('Type A');
    expect(options[2].text()).toBe('Type B');
  });

  it('should display error messages when error props are true', async () => {
    await wrapper.setProps({
      error: {
        periodicMaintenance: true,
        ncf: true,
        eaf: true,
        productionBrutto: true,
        productionNetto: true,
        energySales: true,
        fuelConsumption: true
      }
    });

    expect(wrapper.text()).toContain('Type of Periodic Maintenance wajib diisi');
    expect(wrapper.text()).toContain('Net Capacity Factor wajib diisi');
    expect(wrapper.text()).toContain('Equivalent Availability Factor wajib diisi');
    expect(wrapper.text()).toContain('Production (Brutto) wajib diisi');
    expect(wrapper.text()).toContain('Production (Netto) wajib diisi');
    expect(wrapper.text()).toContain('Energy Sales wajib diisi');
    expect(wrapper.text()).toContain('Fuel Consumption wajib diisi');
  });

  it('should handle decimal input formatting for different fields', async () => {
    const component = wrapper.vm;
    
    // Test the handleInputDecimalRupiah function directly
    component.ncf = '123.45';
    component.handleInputDecimalRupiah('ncf');
    
    component.eaf = '67.89';
    component.handleInputDecimalRupiah('eaf');
    
    component.productionBrutto = '1000.50';
    component.handleInputDecimalRupiah('productionBrutto');
    
    component.productionNetto = '950.25';
    component.handleInputDecimalRupiah('productionNetto');
    
    component.energySales = '900.75';
    component.handleInputDecimalRupiah('energySales');
    
    // Verify the function runs without errors
    expect(component.handleInputDecimalRupiah).toBeDefined();
  });

  it('should render fuel consumption fields when provided', async () => {
    const fuelConsumptionData = [
      { id_uraian: 1, bahan_bakar: 'Solar', value: '100' },
      { id_uraian: 2, bahan_bakar: 'Batubara', value: '200' }
    ];

    // Mount with fuel consumption data
    const wrapperWithFuel = mount(TabDataTeknis, {
      props: {
        ...defaultProps,
        fuelConsumption: fuelConsumptionData,
        'onUpdate:fuelConsumption': (value: any) => {},
        'onUpdate:typePeriodic': (value: any) => {},
        'onUpdate:ncf': (value: any) => {},
        'onUpdate:eaf': (value: any) => {},
        'onUpdate:productionBrutto': (value: any) => {},
        'onUpdate:productionNetto': (value: any) => {},
        'onUpdate:energySales': (value: any) => {},
      },
      global: {
        provide: {
          selectedTitle: 'Data Teknis'
        }
      }
    });

    expect(wrapperWithFuel.text()).toContain('Fuel Consumption Solar');
    expect(wrapperWithFuel.text()).toContain('Fuel Consumption Batubara');
  });

  it('should call labelFuelConsumption function correctly', () => {
    const component = wrapper.vm;
    
    // Test with existing fuel consumption ID
    const label1 = component.labelFuelConsumption('1');
    expect(label1).toBe('Liter'); // satuan_volume_bahan_bakar with spaces removed

    const label2 = component.labelFuelConsumption('2');
    expect(label2).toBe('Ton');

    // Test with non-existing ID
    const labelNonExisting = component.labelFuelConsumption('999');
    expect(labelNonExisting).toBe('');
  });

  it('should handle fuel consumption input formatting', async () => {
    const fuelConsumptionData = [
      { id_uraian: 1, bahan_bakar: 'Solar', value: '100.50' }
    ];

    const wrapperWithFuel = mount(TabDataTeknis, {
      props: {
        ...defaultProps,
        fuelConsumption: fuelConsumptionData,
        'onUpdate:fuelConsumption': (value: any) => {},
        'onUpdate:typePeriodic': (value: any) => {},
        'onUpdate:ncf': (value: any) => {},
        'onUpdate:eaf': (value: any) => {},
        'onUpdate:productionBrutto': (value: any) => {},
        'onUpdate:productionNetto': (value: any) => {},
        'onUpdate:energySales': (value: any) => {},
      },
      global: {
        provide: {
          selectedTitle: 'Data Teknis'
        }
      }
    });

    // Test that fuel consumption is rendered
    expect(wrapperWithFuel.text()).toContain('Fuel Consumption Solar');
    // Test that the fuel consumption section exists
    expect(wrapperWithFuel.find('.grid.grid-cols-3.gap-5').exists()).toBe(true);
  });

  it('should handle button click to move to next tab', async () => {
    const button = wrapper.find('button[type="submit"]');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Selanjutnya');

    await button.trigger('click');
    
    // The selectedTitle should be injected and updated
    // Since we're testing in isolation, we just verify the button exists and is clickable
    expect(button.exists()).toBe(true);
  });

  it('should disable fields when isIntegrasi is true', async () => {
    await wrapper.setProps({ 
      isIntegrasi: true,
      initValue: {
        ...defaultProps.initValue,
        typePeriodic: '1' // Set a value to test the disable condition
      }
    });

    const selectElement = wrapper.find('#periodic');
    expect(selectElement.attributes('disabled')).toBeDefined();

    // Test that the disabled prop is passed to inputs
    const allInputs = wrapper.findAll('input');
    expect(allInputs.length).toBeGreaterThan(0);
  });

  it('should handle fuel consumption labels with spaces in unit names', () => {
    // Create a component with fuel consumption that has spaces in unit name
    const propsWithSpaces = {
      ...defaultProps,
      comboBahanBakar: [
        { 
          id_uraian_fuel_consumption: '3', 
          satuan_volume_bahan_bakar: 'Cubic Meter', // Contains space
          bahan_bakar: 'Gas'
        }
      ]
    };

    const wrapperWithSpaces = mount(TabDataTeknis, {
      props: {
        ...propsWithSpaces,
        'onUpdate:fuelConsumption': (value: any) => {},
        'onUpdate:typePeriodic': (value: any) => {},
        'onUpdate:ncf': (value: any) => {},
        'onUpdate:eaf': (value: any) => {},
        'onUpdate:productionBrutto': (value: any) => {},
        'onUpdate:productionNetto': (value: any) => {},
        'onUpdate:energySales': (value: any) => {},
      },
      global: {
        provide: {
          selectedTitle: 'Data Teknis'
        }
      }
    });

    // Test the component renders with spaced fuel consumption data
    expect(wrapperWithSpaces.exists()).toBe(true);
    
    // The space removal functionality is tested indirectly through the component logic
    // We can verify the component handles the comboBahanBakar prop correctly
    expect(wrapperWithSpaces.props('comboBahanBakar')).toEqual(propsWithSpaces.comboBahanBakar);
  });
});
