import { mount } from '@vue/test-utils';
import ParameterTeknisApprove from '@/components/ui/ParameterTeknisApprove.vue';
import GlobalFormat from '@/services/format/global-format';
import ComponentDisetujui from '@/components/Status/ComponentDisetujui.vue';
import ComponentDitolakT1 from '@/components/Status/ComponentDitolakT1.vue';
import ComponentDitolakT2 from '@/components/Status/ComponentDitolakT2.vue';
import ComponentWaitingT1 from '@/components/Status/ComponentWaitingT1.vue';
import ComponentWaitingT2 from '@/components/Status/ComponentWaitingT2.vue';
import ComponentDraft from '@/components/Status/ComponentDraft.vue';
import ReloadComponent from '@/components/ui/ReloadComponent.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';

describe('ParameterTeknisApprove.vue', () => {
  const globalFormat = new GlobalFormat();

  const defaultProps = {
    data: 'Sample Data',
    status: 'Disetujui',
    tahun: 2024,
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
    ]
  };

  it('renders the component with props', () => {
    const wrapper = mount(ParameterTeknisApprove, {
      props: defaultProps,
      global: {
        components: {
          ComponentDisetujui,
          ComponentDitolakT1,
          ComponentDitolakT2,
          ComponentWaitingT1,
          ComponentWaitingT2,
          ComponentDraft,
          ReloadComponent,
          ShimmerLoading,
        },
      },
    });

    // Check if the props are rendered correctly
    expect(wrapper.text()).toContain('Parameter Teknis & Finansial');
    expect(wrapper.text()).toContain('Periode');
    expect(wrapper.text()).toContain('Sample Data');
    expect(wrapper.text()).toContain('Disetujui');
    expect(wrapper.text()).toContain(globalFormat.formatRupiah(defaultProps.dayaTerpasang / 1000));
    expect(wrapper.text()).toContain(globalFormat.formatRupiah(defaultProps.dayaMampuNetto));
  });

  it('shows the correct status component based on the status prop', () => {
    const wrapper = mount(ParameterTeknisApprove, {
      props: { ...defaultProps, status: 'Ditolak T1' },
    });

    expect(wrapper.findComponent(ComponentDitolakT1).exists()).toBe(true);
  });

  it('shows shimmer loading when data is loading', () => {
    const wrapper = mount(ParameterTeknisApprove, {
      props: { ...defaultProps, dayaTerpasang: null, dayaMampuNetto: null },
    });

    expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(true);
  });

  it('handles the fetch error and displays reload component', () => {
    const wrapper = mount(ParameterTeknisApprove, {
      props: { ...defaultProps, isFetchingError: true, dayaTerpasang: null, dayaMampuNetto: null },
    });

    expect(wrapper.findComponent(ReloadComponent).exists()).toBe(true);
  });
});
