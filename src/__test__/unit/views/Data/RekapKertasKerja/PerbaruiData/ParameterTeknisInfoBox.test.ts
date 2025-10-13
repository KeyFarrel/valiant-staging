import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ParameterTeknisInfoBox from '@/views/Data/RekapKertasKerja/PerbaruiData/ParameterTeknisInfoBox.vue';

describe('ParameterTeknisInfoBox', () => {
  let wrapper: any;
  
  const mockProps = {
    periode: '2024',
    parameterTeknis: {
      daya_terpasang: 100000, // 100 MW in kW
      daya_mampu_netto_mw: 95,
      auxiliary: 5.5,
      susut_trafo: 2.3,
      ps: 7.8,
      nphr: 2400,
      total_project_cost: 5000000,
      loan: 3500000,
      equity: 1500000,
      electricity_price_a_rp_per_kwbln: 150000,
      electricity_price_b_rp_per_kwbln: 175000,
      electricity_price_c_rp_per_kwh: 1500,
      electricity_price_d_rp_per_kwh: 1800
    },
    bahanBakars: [
      {
        flag_bahan_bakar: 1,
        kode_bahan_bakar: 'BBM001',
        harga_bahan_bakar: 12000,
        sfc: 0.25
      },
      {
        flag_bahan_bakar: 0,
        kode_bahan_bakar: 'BBM002',
        harga_bahan_bakar: 8000,
        sfc: 0.30
      }
    ],
    comboBahanBakar: [
      {
        kode_bahan_bakar: 'BBM001',
        bahan_bakar: 'Solar',
        satuan_harga_bahan_bakar: 'Rupiah per Liter',
        satuan_sfc: 'Liter per kWh'
      },
      {
        kode_bahan_bakar: 'BBM002',
        bahan_bakar: 'Gas',
        satuan_harga_bahan_bakar: 'Rupiah per m3',
        satuan_sfc: 'm3 per kWh'
      }
    ]
  };

  beforeEach(() => {
    wrapper = mount(ParameterTeknisInfoBox, {
      props: mockProps
    });
  });

  it('should render component properly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.border-l-\\[\\#0099AD\\]')).toBeTruthy();
  });

  it('should display periode correctly', () => {
    const periodeElement = wrapper.find('.text-primaryColor');
    expect(periodeElement.text()).toBe('2024');
  });

  it('should display parameter teknis values correctly', () => {
    const dayaTerpasangText = wrapper.text();
    expect(dayaTerpasangText).toContain('100,00'); // Daya terpasang should show 100 MW
    expect(dayaTerpasangText).toContain('95,00'); // Daya mampu netto
    expect(dayaTerpasangText).toContain('5,50'); // Auxiliary (formatted with comma)
  });

  it('should return dash when bahan bakar code is not found', () => {
    const wrapperWithUnknownBahanBakar = mount(ParameterTeknisInfoBox, {
      props: {
        ...mockProps,
        bahanBakars: [
          {
            flag_bahan_bakar: 1,
            kode_bahan_bakar: 'UNKNOWN_CODE',
            harga_bahan_bakar: 12000,
            sfc: 0.25
          }
        ]
      }
    });
    
    const text = wrapperWithUnknownBahanBakar.text();
    expect(text).toContain('-'); // Should display dash for unknown bahan bakar
  });

  it('should return empty string when satuan labels are not found', () => {
    const wrapperWithEmptyCombo = mount(ParameterTeknisInfoBox, {
      props: {
        ...mockProps,
        comboBahanBakar: [] // Empty combo bahan bakar
      }
    });
    
    // Component should render without error even with empty combo
    expect(wrapperWithEmptyCombo.exists()).toBe(true);
  });

  it('should handle bahanBakarsFinal function with non-primary fuel first', () => {
    const wrapperWithReorderedBahanBakar = mount(ParameterTeknisInfoBox, {
      props: {
        ...mockProps,
        bahanBakars: [
          {
            flag_bahan_bakar: 0,
            kode_bahan_bakar: 'BBM002',
            harga_bahan_bakar: 8000,
            sfc: 0.30
          },
          {
            flag_bahan_bakar: 1, // Primary fuel at second position
            kode_bahan_bakar: 'BBM001',
            harga_bahan_bakar: 12000,
            sfc: 0.25
          }
        ]
      }
    });
    
    const text = wrapperWithReorderedBahanBakar.text();
    expect(text).toContain('Solar'); // Primary fuel should be displayed
    expect(text).toContain('Gas'); // Secondary fuel should also be displayed
  });

  it('should handle case when no primary fuel exists', () => {
    const wrapperWithNoPrimaryFuel = mount(ParameterTeknisInfoBox, {
      props: {
        ...mockProps,
        bahanBakars: [
          {
            flag_bahan_bakar: 0,
            kode_bahan_bakar: 'BBM001',
            harga_bahan_bakar: 12000,
            sfc: 0.25
          },
          {
            flag_bahan_bakar: 0,
            kode_bahan_bakar: 'BBM002',
            harga_bahan_bakar: 8000,
            sfc: 0.30
          }
        ]
      }
    });
    
    // Component should render without error even without primary fuel
    expect(wrapperWithNoPrimaryFuel.exists()).toBe(true);
    const text = wrapperWithNoPrimaryFuel.text();
    expect(text).toContain('Solar');
    expect(text).toContain('Gas');
  });

  it('should handle edge cases for harga bahan bakar and sfc values', () => {
    const wrapperWithEdgeCases = mount(ParameterTeknisInfoBox, {
      props: {
        ...mockProps,
        bahanBakars: [
          {
            flag_bahan_bakar: 1,
            kode_bahan_bakar: 'BBM001',
            harga_bahan_bakar: 0, // Zero value
            sfc: 0 // Zero value
          },
          {
            flag_bahan_bakar: 0,
            kode_bahan_bakar: 'BBM002',
            harga_bahan_bakar: '', // Empty string
            sfc: null // Null value
          }
        ]
      }
    });
    
    const text = wrapperWithEdgeCases.text();
    // Should handle zero and empty values gracefully
    expect(text).toContain('0,00'); // Zero should be formatted
    expect(text).toContain('-'); // Empty should show dash
  });
});