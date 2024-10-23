import { shallowMount } from '@vue/test-utils';
import TabDataTeknis from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabDataTeknis.vue';

describe('TabDataTeknis.vue', () => {
  let wrapper: any;

  const propsData = {
    mesin: 'Unit 1',
    tahunRealisasi: 2023,
    comboTypePeriodic: [
      { id_type_periodic: '1', kode_type_periodic: 'Monthly' },
      { id_type_periodic: '2', kode_type_periodic: 'Yearly' }
    ],
    comboBahanBakar: [
      { id_uraian_fuel_consumption: '1', satuan_volume_bahan_bakar: 'L' },
      { id_uraian_fuel_consumption: '2', satuan_volume_bahan_bakar: 'Gallon' }
    ],
    initValue: {
      typePeriodic: '',
      ncf: '5.0',
      eaf: '90.0',
      productionBrutto: '10000',
      productionNetto: '9000',
      energySales: '8500',
    },
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
    wrapper = shallowMount(TabDataTeknis, {
      props: propsData,
      global: {
        stubs: ['TextField', 'WarningIcon']
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly with the given props', () => {
    expect(wrapper.find('section').exists()).toBe(false);
    expect(wrapper.text()).toContain('Type of Periodic Maintenance *Pilih Type of Periodic MaintenanceMonthlyYearlyNet Capacity Factor (NCF) *%Equivalent Availability Factor (EAF) *%Production (Bruto) *MWhProduction (Netto) *MWhEnergy Sales *MWhFuel Consumption Selanjutnya');
    expect(wrapper.text()).toContain('Type of Periodic Maintenance *Pilih Type of Periodic MaintenanceMonthlyYearlyNet Capacity Factor (NCF) *%Equivalent Availability Factor (EAF) *%Production (Bruto) *MWhProduction (Netto) *MWhEnergy Sales *MWhFuel Consumption Selanjutnya');
  });

  it('renders the correct type of periodic maintenance options', () => {
    const options = wrapper.findAll('option');
    expect(options.length).toBe(3); // Includes the "Pilih" option
    expect(options.at(1)?.text()).toBe('Monthly');
    expect(options.at(2)?.text()).toBe('Yearly');
  });

  it('validates required fields for Net Capacity Factor (NCF)', async () => {
    await wrapper.setProps({
      error: { ...propsData.error, ncf: true }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Net Capacity Factor wajib diisi');
  });

  it('validates required fields for Equivalent Availability Factor (EAF)', async () => {
    await wrapper.setProps({
      error: { ...propsData.error, eaf: true }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Equivalent Availability Factor wajib diisi');
  });

  it('validates required fields for Production (Brutto)', async () => {
    await wrapper.setProps({
      error: { ...propsData.error, productionBrutto: true }
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Production (Brutto) wajib diisi');
  });

  it('renders fuel consumption labels correctly based on comboBahanBakar', () => {
    const fuelConsumption = [
      { id_uraian: '1', bahan_bakar: 'Diesel', value: '500' },
      { id_uraian: '2', bahan_bakar: 'Gasoline', value: '1000' }
    ];
    wrapper.setProps({ fuelConsumption });

    const fuelLabels = wrapper.findAll('label');
    expect(fuelLabels.at(6)?.text()).toContain('MWh');
    expect(fuelLabels.at(7)?.text()).toContain('Production (Netto) *');
  });

  it('correctly handles labelFuelConsumption function', () => {
    expect(wrapper.vm.labelFuelConsumption('1')).toBe('L');
    expect(wrapper.vm.labelFuelConsumption('2')).toBe('Gallon');
    expect(wrapper.vm.labelFuelConsumption('3')).toBe(''); // Should return empty if not found
  });

  it('navigates to "Data Finansial" when the button is clicked', async () => {
    await wrapper.find('button').trigger('click');
    expect(wrapper.vm.selectedTitle).toBe('Data Finansial');
  });
});
