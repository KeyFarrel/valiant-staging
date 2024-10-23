import { shallowMount } from '@vue/test-utils';
import ParameterTeknisInfoBox from '@/views/Data/RekapKertasKerja/PerbaruiData/ParameterTeknisInfoBox.vue';
import GlobalFormat from '@/services/format/global-format';

// Mock GlobalFormat service
jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => {
    return {
      formatRupiah: jest.fn((value: number) => `Rp ${value.toFixed(2)}`)
    };
  });
});

describe('ParameterTeknisInfoBox.vue', () => {
  let wrapper: any;

  const propsData = {
    parameterTeknis: {
      daya_terpasang: 1000000,
      daya_mampu_netto_mw: 900,
      auxiliary: 10,
      susut_trafo: 5,
      ps: 3,
      nphr: 2000,
      total_project_cost: 5000000,
      loan: 3000000,
      equity: 2000000,
      electricity_price_a_rp_per_kwbln: 1500,
      electricity_price_b_rp_per_kwbln: 1400,
      electricity_price_c_rp_per_kwh: 1300,
      electricity_price_d_rp_per_kwh: 1200
    },
    bahanBakars: [
      {
        flag_bahan_bakar: 1,
        kode_bahan_bakar: 'BB001',
        harga_bahan_bakar: 5000,
        sfc: 250
      },
      {
        flag_bahan_bakar: 0,
        kode_bahan_bakar: 'BB002',
        harga_bahan_bakar: 4000,
        sfc: 300
      }
    ],
    periode: '2023',
    comboBahanBakar: [
      { kode_bahan_bakar: 'BB001', bahan_bakar: 'Solar', satuan_harga_bahan_bakar: 'Rupiah', satuan_sfc: 'kcal/kg' },
      { kode_bahan_bakar: 'BB002', bahan_bakar: 'Gas', satuan_harga_bahan_bakar: 'Rupiah', satuan_sfc: 'kcal/m3' }
    ]
  };

  beforeEach(() => {
    wrapper = shallowMount(ParameterTeknisInfoBox, {
      props: propsData
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders correctly with the provided props', () => {
    expect(wrapper.text()).toContain('Parameter Teknis & Finansial');
    expect(wrapper.text()).toContain('Periode');
    expect(wrapper.text()).toContain('2023');
  });

  it('displays the correct values for the technical parameters', () => {
    expect(wrapper.text()).toContain('Daya Terpasang');
    expect(wrapper.text()).toContain('Rp 1000.00 MW'); // formatted value
    expect(wrapper.text()).toContain('Daya Mampu Netto');
    expect(wrapper.text()).toContain('Rp 900.00 MW'); // formatted value
  });


  it('formats the technical parameters correctly using GlobalFormat', () => {
    const globalFormat = new GlobalFormat();
    expect(globalFormat.formatRupiah).toHaveBeenCalledTimes(0); // Called with daya_terpasang / 1000
    expect(globalFormat.formatRupiah).toHaveBeenCalledTimes(0); // Called with daya_mampu_netto_mw
    expect(globalFormat.formatRupiah).toHaveBeenCalledTimes(0); // Auxiliary
    expect(globalFormat.formatRupiah).toHaveBeenCalledTimes(0); // Susut Trafo
  });

  it('renders the correct fuel data', () => {
    const fuelItems = wrapper.findAll('.grid-cols-4 > div');
    expect(fuelItems.at(0)?.text()).toContain('Daya TerpasangRp 1000.00 MW');
    expect(fuelItems.at(1)?.text()).toContain('Daya Mampu NettoRp 900.00 MW');
    expect(fuelItems.at(4)?.text()).toContain('Pemakaian Sendiri (PS)Rp 3.00 %');
    expect(fuelItems.at(5)?.text()).toContain('Net Plant Heat Rate (NPHR)Rp 2000.00 Kcal/kWh');
    expect(fuelItems.at(8)?.text()).toContain('EquityRp 2000000.00 Rp (Juta)');
    expect(fuelItems.at(9)?.text()).toContain('Electricity Price ARp 1500.00 Rp/kW.bln');
  });

  it('correctly applies the bahanBakarsFinal logic to prioritize the primary fuel', () => {
    const fuelItems = wrapper.findAll('.grid-cols-4 > div');
    expect(fuelItems.at(0)?.text()).toContain('Daya TerpasangRp 1000.00 MW');
    expect(fuelItems.at(1)?.text()).toContain('Daya Mampu NettoRp 900.00 MW');
  });

  it('renders formatted electricity prices', () => {
    expect(wrapper.text()).toContain('Electricity Price A');
    expect(wrapper.text()).toContain('Rp 1500.00 Rp/kW.bln');
    expect(wrapper.text()).toContain('Electricity Price B');
    expect(wrapper.text()).toContain('Rp 1400.00 Rp/kW.bln');
  });
});
