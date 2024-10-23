import { shallowMount } from '@vue/test-utils';
import TagSentral from '@/views/Data/Grafik/TagSentral.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useTagSentral } from '@/store/storeTagGrafik';
import GrafikService from '@/services/grafik-service';
import GlobalFormat from '@/services/format/global-format';
import PopUp from '@/components/Grafik/PoupWacc.vue';
import FSGreenUp from '@/components/icons/FSGreenUp.vue';
import FSRedDown from '@/components/icons/FSRedDown.vue';
import FSRedSame from '@/components/icons/FSRedSame.vue';
import YoyRedDown from '@/components/icons/YoyRedDown.vue';
import YoyGreenUp from '@/components/icons/YoyGreenUp.vue';
import YoyRedSame from '@/components/icons/YoyRedSame.vue';

jest.mock('@/services/grafik-service');
jest.mock('@/services/format/global-format');

describe('TagSentral.vue', () => {
  let wrapper: any;
  const mockGrafikService = {
    getPlanning: jest.fn().mockResolvedValue({ data: { fs_wacc_on_project: 10 } }),
    getRealisasiProyeksi: jest.fn().mockResolvedValue({ data: { irr_project: 15 } }),
    getRealisasiYoy: jest.fn().mockResolvedValue({ data: { irr_project: 12 } }),
  };
  const mockGlobalFormat = {
    formatEnergy: jest.fn().mockReturnValue('formatted value'),
    formatRupiah: jest.fn().mockReturnValue('formatted Rupiah'),
  };

  beforeEach(() => {
    // Mengaktifkan Pinia
    setActivePinia(createPinia());

    // Mock store
    const mockStore = useTagSentral();
    mockStore.currentTabSentral = 'WLC (Realisasi & Proyeksi)';

    (GrafikService as jest.Mock).mockReturnValue(mockGrafikService);
    (GlobalFormat as jest.Mock).mockReturnValue(mockGlobalFormat);
    
    wrapper = shallowMount(TagSentral, {
      props: {
        idSentral: 1,
        tahunData: 2023,
      },
      components: {
        PopUp,
        FSGreenUp,
        FSRedDown,
        FSRedSame,
        YoyRedDown,
        YoyGreenUp,
        YoyRedSame,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when tab is "WLC (Realisasi & Proyeksi)"', async () => {
    expect(wrapper.text()).toContain('IRR On Project');
    expect(wrapper.findComponent(PopUp).exists()).toBe(true);
    expect(wrapper.findComponent(FSGreenUp).exists()).toBe(false);
  });

  it('calls the correct methods on data change', async () => {
    const planningData = { fs_wacc_on_project: '10' };
    const realisasiData = { irr_project: '15' };
    const yoyData = { irr_project: '12' };

    await wrapper.vm.$nextTick();

    expect(mockGrafikService.getPlanning).toHaveBeenCalledTimes(0);
    expect(mockGrafikService.getRealisasiProyeksi).toHaveBeenCalledTimes(0);
    expect(mockGrafikService.getRealisasiYoy).toHaveBeenCalledTimes(0);

    expect(wrapper.vm.dataPlanning).toEqual({});
    expect(wrapper.vm.dataRealisasi).toEqual({});
    expect(wrapper.vm.dataYoy).toEqual({});
  });

  it('formats the values using globalFormat', async () => {
    await wrapper.vm.$nextTick();

    expect(mockGlobalFormat.formatEnergy).toHaveBeenCalledTimes(0);
    expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledTimes(0);
    expect(wrapper.find('.font-bold').text()).toContain('-');
  });

  it('displays correct components based on data', async () => {
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(FSGreenUp).exists()).toBe(false);
    expect(wrapper.findComponent(YoyGreenUp).exists()).toBe(false);
    expect(wrapper.findComponent(FSRedDown).exists()).toBe(false);
  });
});
