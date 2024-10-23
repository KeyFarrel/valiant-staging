import { mount } from '@vue/test-utils';
import TahunBerjalan from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import ReloadComponent from '@/components/ui/ReloadComponent.vue';

describe('TahunBerjalan.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(TahunBerjalan, {
      props: {
        irrOnProject: 10,
        irrOnEquity: 12,
        npvOnEquity: 15000,
        npvOnProject: 20000,
        averageNcf: 8,
        averageEaf: 85,
        isFetchingError: false,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders IRR and NPV sections correctly', () => {
    // Check if IRR section is displayed
    expect(wrapper.text()).toContain('Internal Rate of Return (IRR)');
    expect(wrapper.text()).toContain('IRR on Project');
    expect(wrapper.text()).toContain('IRR on Equity');
    
    // Check if NPV section is displayed
    expect(wrapper.text()).toContain('Net Present Value (NPV)');
    expect(wrapper.text()).toContain('NPV on Project');
    expect(wrapper.text()).toContain('NPV on Equity');

    // Validate the displayed values
    const irrOnProject = wrapper.findAll('p')[1];
    const irrOnEquity = wrapper.findAll('p')[3];
    const npvOnProject = wrapper.findAll('p')[5];
    const npvOnEquity = wrapper.findAll('p')[7];

    expect(irrOnProject.text()).toContain('IRR on Project');
    expect(irrOnEquity.text()).toContain('IRR on Equity');
    expect(npvOnProject.text()).toContain('Net Present Value (NPV)');
    expect(npvOnEquity.text()).toContain('20.000,00 Rp (Juta)');
  });

  it('renders NCF and EAF sections correctly', () => {
    // Check if NCF and EAF sections are displayed
    expect(wrapper.text()).toContain('Average Net Capacity Factor (NCF)');
    expect(wrapper.text()).toContain('Average Equivalent Availability Factor (EAF)');

    // Validate the displayed values
    const averageNcf = wrapper.findAll('p')[9];
    const averageEaf = wrapper.findAll('p')[11];

    expect(averageNcf.text()).toContain('15.000,00 Rp (Juta)');
    expect(averageEaf.text()).toContain('8,00 %');
  });

  it('displays shimmer loading when data is not available', async () => {
    await wrapper.setProps({
      irrOnProject: null,
      irrOnEquity: null,
      npvOnEquity: null,
      npvOnProject: null,
      averageNcf: null,
      averageEaf: null,
    });
    await wrapper.vm.$nextTick();

    const shimmerComponents = wrapper.findAllComponents(ShimmerLoading);
    expect(shimmerComponents.length).toBe(4);
  });

  it('displays reload component on fetch error', async () => {
    await wrapper.setProps({
      isFetchingError: true,
      irrOnProject: null,
      irrOnEquity: null,
      npvOnEquity: null,
      npvOnProject: null,
      averageNcf: null,
      averageEaf: null,
    });
    await wrapper.vm.$nextTick();

    const reloadComponent = wrapper.findComponent(ReloadComponent);
    expect(reloadComponent.exists()).toBe(true);
  });
});
