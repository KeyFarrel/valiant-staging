import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ParameterTeknis from '@/components/ui/ParameterTeknis.vue';

describe('ParameterTeknis.vue', () => {
  let wrapper: any;
  
  const defaultProps = {
    dayaTerpasang: 100000,
    dayaMampuNetto: 90,
    auxiliary: 5.5,
    susutTrafo: 2.5,
    pemakaianSendiri: 8.0,
    netPlantHeatRate: 2500,
    totalProjectCost: 1000000,
    loan: 700000,
    equity: 300000,
    electricityPriceA: 1500,
    electricityPriceB: 1200,
    electricityPriceC: 800,
    electricityPriceD: 1000,
    comboBahanBakar: [
      {
        kode_bahan_bakar: 'BBM001',
        bahan_bakar: 'Batubara',
        satuan_harga_bahan_bakar: 'Rupiah per Ton',
        satuan_sfc: 'Ton per MWh'
      }
    ],
    isFetchingError: false,
    bahanBakars: [
      {
        kode_bahan_bakar: 'BBM001',
        harga_bahan_bakar: '850000',
        sfc: '0.45',
        flag_bahan_bakar: 1
      }
    ],
    listTahunAsumsi: { start: 2020, end: 2025 },
    selectedYear: 2023
  };

  beforeEach(() => {
    wrapper = mount(ParameterTeknis, {
      props: defaultProps,
      global: {
        stubs: {
          ShimmerLoading: true,
          ReloadComponent: true
        }
      }
    });
  });

  it('should render component with basic parameter teknis data', () => {
    expect(wrapper.find('p').text()).toContain('Parameter Teknis & Finansial');
    expect(wrapper.html()).toContain('Daya Terpasang');
    expect(wrapper.html()).toContain('Daya Mampu Netto');
    expect(wrapper.html()).toContain('MW');
  });

  it('should display formatted values correctly', () => {
    expect(wrapper.html()).toContain('100'); // Daya Terpasang formatted
    expect(wrapper.html()).toContain('90'); // Daya Mampu Netto
    expect(wrapper.html()).toContain('5,5'); // Auxiliary with comma formatting
  });

  it('should show selected year when provided', () => {
    expect(wrapper.html()).toContain('Periode');
    expect(wrapper.html()).toContain('2023');
  });

  it('should render ReloadComponent when fetching error and no data', () => {
    const errorWrapper = mount(ParameterTeknis, {
      props: {
        ...defaultProps,
        dayaTerpasang: null,
        dayaMampuNetto: null,
        isFetchingError: true
      },
      global: {
        stubs: {
          ShimmerLoading: true,
          ReloadComponent: {
            name: 'ReloadComponent',
            template: '<div data-testid="reload-component">Reload Component</div>',
            emits: ['on-clicks', 'on-key-down']
          }
        }
      }
    });

    expect(errorWrapper.find('[data-testid="reload-component"]').exists()).toBe(true);
  });

  it('should render ShimmerLoading when no data and no error', () => {
    const loadingWrapper = mount(ParameterTeknis, {
      props: {
        ...defaultProps,
        dayaTerpasang: null,
        dayaMampuNetto: null,
        isFetchingError: false
      },
      global: {
        stubs: {
          ShimmerLoading: {
            name: 'ShimmerLoading',
            template: '<div data-testid="shimmer-loading">Loading...</div>'
          },
          ReloadComponent: true
        }
      }
    });

    expect(loadingWrapper.find('[data-testid="shimmer-loading"]').exists()).toBe(true);
  });

  it('should handle bahan bakar functions with missing data', () => {
    const wrapperWithMissingData = mount(ParameterTeknis, {
      props: {
        ...defaultProps,
        comboBahanBakar: [], // Empty combo data to test return '-' and ''
        bahanBakars: [
          {
            kode_bahan_bakar: 'UNKNOWN',
            harga_bahan_bakar: '850000',
            sfc: '0.45',
            flag_bahan_bakar: 0
          }
        ]
      },
      global: {
        stubs: {
          ShimmerLoading: true,
          ReloadComponent: true
        }
      }
    });

    // Test that it renders without error when combo data is missing
    expect(wrapperWithMissingData.exists()).toBe(true);
    expect(wrapperWithMissingData.html()).toContain('Bahan Bakar');
  });

  it('should reorder bahan bakar when flag_bahan_bakar is 1 but not at index 0', () => {
    const bahanBakarsData = [
      {
        kode_bahan_bakar: 'BBM002',
        harga_bahan_bakar: '750000',
        sfc: '0.35',
        flag_bahan_bakar: 0
      },
      {
        kode_bahan_bakar: 'BBM001',
        harga_bahan_bakar: '850000',
        sfc: '0.45',
        flag_bahan_bakar: 1 // This should be moved to first position
      }
    ];

    const reorderWrapper = mount(ParameterTeknis, {
      props: {
        ...defaultProps,
        bahanBakars: bahanBakarsData
      },
      global: {
        stubs: {
          ShimmerLoading: true,
          ReloadComponent: true
        }
      }
    });

    expect(reorderWrapper.exists()).toBe(true);
    expect(reorderWrapper.html()).toContain('Bahan Bakar Utama');
  });

  it('should emit events when ReloadComponent triggers them', () => {
    const errorWrapper = mount(ParameterTeknis, {
      props: {
        ...defaultProps,
        dayaTerpasang: null,
        dayaMampuNetto: null,
        isFetchingError: true
      },
      global: {
        stubs: {
          ShimmerLoading: true,
          ReloadComponent: {
            name: 'ReloadComponent',
            template: '<div @click="$emit(\'on-clicks\')" @keydown="$emit(\'on-key-down\')">Reload</div>',
            emits: ['on-clicks', 'on-key-down']
          }
        }
      }
    });

    const reloadComponent = errorWrapper.findComponent({ name: 'ReloadComponent' });
    
    reloadComponent.vm.$emit('on-clicks');
    expect(errorWrapper.emitted('onClickReload')).toBeTruthy();

    reloadComponent.vm.$emit('on-key-down');
    expect(errorWrapper.emitted('onKeyDown')).toBeTruthy();
  });
});