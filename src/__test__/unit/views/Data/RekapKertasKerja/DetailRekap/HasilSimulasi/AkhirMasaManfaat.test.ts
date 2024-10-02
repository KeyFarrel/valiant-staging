import { mount } from '@vue/test-utils';
import AkhirMasaManfaat from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue';
import GlobalFormat from '@/services/format/global-format';
import ReloadComponent from '@/components/ui/ReloadComponent.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';

jest.mock('@/services/format/global-format');

describe('AkhirMasaManfaat.vue - SonarQube Coverage', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(AkhirMasaManfaat, {
      props: {
        irrOnProject: '',
        irrOnEquity: '',
        npvOnEquity: 0,
        npvOnProject: 0,
        averageNcf: 0,
        averageEaf: 0,
        isFetchingError: false
      }
    });
  });

  it('should create an instance of GlobalFormat', () => {
    // Verifikasi bahwa GlobalFormat diinisialisasi
    expect(GlobalFormat).toHaveBeenCalled();
  });

  it('should have default prop isFetchingError set to false', () => {
    // Verifikasi bahwa prop isFetchingError default-nya false
    expect(wrapper.props().isFetchingError).toBe(false);
  });

  it('should emit onClick when ReloadComponent is clicked', async () => {
    wrapper.setProps({ isFetchingError: true });  // Aktifkan isFetchingError
    await wrapper.vm.$nextTick();

    const reloadComponent = wrapper.findComponent(ReloadComponent);
    await reloadComponent.vm.$emit('onClick');

    // Verifikasi bahwa event onClick diemit
    expect(wrapper.emitted('onClick')).toBeTruthy();
  });

  it('should render ShimmerLoading component', () => {
    const shimmerLoading = wrapper.findComponent(ShimmerLoading);
    
    // Verifikasi bahwa ShimmerLoading dirender
    expect(shimmerLoading.exists()).toBe(true);
  });
});
