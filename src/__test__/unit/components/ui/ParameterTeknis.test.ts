import { mount } from '@vue/test-utils';
import ParameterTeknis from '@/components/ui/ParameterTeknis.vue';
import GlobalFormat from '@/services/format/global-format';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import ReloadComponent from '@/components/ui/ReloadComponent.vue';

describe('ParameterTeknis.vue', () => {
  const globalFormat = new GlobalFormat();

  const defaultProps = {
    dayaTerpasang: 1000,
    dayaMampuNetto: 2000,
    auxiliary: 5,
    susutTrafo: 2,
    pemakaianSendiri: 10,
    netPlantHeatRate: 3000,
    totalProjectCost: 50000000,
    loan: 10000000,
    equity: 40000000,
    electricityPriceA: 1000,
    electricityPriceB: 2000,
    electricityPriceC: 3000,
    electricityPriceD: 4000,
    comboBahanBakar: [
      { kode_bahan_bakar: 1, bahan_bakar: 'Solar', satuan_harga_bahan_bakar: 'Rupiah/Liter', satuan_sfc: 'Liter/kWh' }
    ],
    isFetchingError: false,
    bahanBakars: [
      { flag_bahan_bakar: 1, kode_bahan_bakar: 1, harga_bahan_bakar: 1000, sfc: 1.5 }
    ],
    listTahunAsumsi: { start: 2020, end: 2025 },
    selectedYear: 2024,
  };

  it('renders the component with props', () => {
    const wrapper = mount(ParameterTeknis, {
      props: defaultProps,
      global: {
        components: {
          ShimmerLoading,
          ReloadComponent,
        },
      },
    });

    // Check if the props are rendered correctly
    expect(wrapper.text()).toContain('Parameter Teknis & Finansial');
    expect(wrapper.text()).toContain('Periode');
    expect(wrapper.text()).toContain('2024');
    expect(wrapper.text()).toContain(globalFormat.formatRupiah(defaultProps.dayaTerpasang / 1000));
    expect(wrapper.text()).toContain(globalFormat.formatRupiah(defaultProps.dayaMampuNetto));
  });

  it('shows shimmer loading when data is loading', () => {
    const wrapper = mount(ParameterTeknis, {
      props: { ...defaultProps, dayaTerpasang: null, dayaMampuNetto: null },
    });

    expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(true);
  });

  it('handles the fetch error and displays reload component', () => {
    const wrapper = mount(ParameterTeknis, {
      props: { ...defaultProps, isFetchingError: true, dayaTerpasang: null, dayaMampuNetto: null },
    });

    expect(wrapper.findComponent(ReloadComponent).exists()).toBe(true);
  });

  it('formats electricity prices correctly', () => {
    const wrapper = mount(ParameterTeknis, {
      props: defaultProps,
    });

    expect(wrapper.text()).toContain(globalFormat.formatRupiah(defaultProps.electricityPriceA));
    expect(wrapper.text()).toContain(globalFormat.formatRupiah(defaultProps.electricityPriceB));
    expect(wrapper.text()).toContain(globalFormat.formatRupiah(defaultProps.electricityPriceC));
    expect(wrapper.text()).toContain(globalFormat.formatRupiah(defaultProps.electricityPriceD));
  });
});
