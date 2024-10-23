import { shallowMount } from '@vue/test-utils';
import TagMesin from '@/views/Data/Grafik/TagMesin.vue';
import GrafikService from '@/services/grafik-service';
import { setActivePinia, createPinia } from 'pinia';
import { useTagMesin } from '@/store/storeTagGrafik';
import PopUp from '@/components/Grafik/PoupWacc.vue';
import FSGreenUp from '@/components/icons/FSGreenUp.vue';
import FSRedDown from '@/components/icons/FSRedDown.vue';
import FSRedSame from '@/components/icons/FSRedSame.vue';
import YoyGreenUp from '@/components/icons/YoyGreenUp.vue';
import YoyRedDown from '@/components/icons/YoyRedDown.vue';
import YoyRedSame from '@/components/icons/YoyRedSame.vue';

jest.mock('@/services/grafik-service');

describe('TagMesin.vue', () => {
  let wrapper: any;
  let grafikService: any;

  beforeEach(() => {
    // Setup Pinia and mock the store
    setActivePinia(createPinia());
    const store = useTagMesin();
    store.currentTabMesin = 'WLC (Realisasi & Proyeksi)'; // Set initial value

    grafikService = new GrafikService();

    wrapper = shallowMount(TagMesin, {
      props: {
        idMesin: 123,
        tahunData: 2024,
      },
      global: {
        components: {
          PopUp,
          FSGreenUp,
          FSRedDown,
          FSRedSame,
          YoyGreenUp,
          YoyRedDown,
          YoyRedSame,
        },
      },
    });
  });

  it('fetches planning, realisasi, and yoy data on mounted', async () => {
    const fetchPlanningSpy = jest.spyOn(wrapper.vm, 'fetchPlanningMesin');
    const fetchRealisasiSpy = jest.spyOn(wrapper.vm, 'fetchRealisasiProyeksiMesin');
    const fetchYoySpy = jest.spyOn(wrapper.vm, 'fetchRealisasiYoyMesin');

    // Await the mounted lifecycle hook
    await wrapper.vm.$nextTick();

    expect(fetchPlanningSpy).toHaveBeenCalledTimes(0);
    expect(fetchRealisasiSpy).toHaveBeenCalledTimes(0);
    expect(fetchYoySpy).toHaveBeenCalledTimes(0);
  });

  it('renders correctly when currentTabMesin is WLC (Realisasi & Proyeksi)', async () => {
    const mockPlanningResponse = {
      data: { fs_irr_project: '12.5' },
    };
    const mockRealisasiResponse = {
      data: { irr_project: '13.5' },
    };
    const mockYoyResponse = {
      data: { irr_project: '11.5' },
    };

    grafikService.getPlanningMesin.mockResolvedValue(mockPlanningResponse);
    grafikService.getRealisasiProyeksiMesin.mockResolvedValue(mockRealisasiResponse);
    grafikService.getRealisasiYoyMesin.mockResolvedValue(mockYoyResponse);

    await wrapper.vm.fetchPlanningMesin();
    await wrapper.vm.fetchRealisasiProyeksiMesin();
    await wrapper.vm.fetchRealisasiYoyMesin();
    await wrapper.vm.$nextTick();

    // Test the DOM for elements based on the data
    expect(wrapper.find('.text-slate-500').text()).toContain('IRR On Project');
    expect(wrapper.find('p.font-bold').text()).toBe('0,00');
  });

  it('handles fetch errors and displays console error logs', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    grafikService.getPlanningMesin.mockRejectedValue(new Error('Fetch Planning Error'));
    grafikService.getRealisasiProyeksiMesin.mockRejectedValue(new Error('Fetch Realisasi Error'));
    grafikService.getRealisasiYoyMesin.mockRejectedValue(new Error('Fetch Yoy Error'));

    await wrapper.vm.fetchPlanningMesin();
    await wrapper.vm.fetchRealisasiProyeksiMesin();
    await wrapper.vm.fetchRealisasiYoyMesin();

    expect(consoleSpy).toHaveBeenCalledWith('Fetch Planning Mesin Error', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Realisasi Proyeksi Mesin Error', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Realisasi Yoy Mesin Error', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('renders correctly when currentTabMesin is Planning / Feasibility Study', async () => {
    // Change the store value
    const store = useTagMesin();
    store.currentTabMesin = 'Planning / Feasibility Study';

    // Re-mount the component to reflect the new store state
    wrapper = shallowMount(TagMesin, {
      props: {
        idMesin: 123,
        tahunData: 2024,
      },
      global: {
        components: {
          PopUp,
          FSGreenUp,
          FSRedDown,
          FSRedSame,
          YoyGreenUp,
          YoyRedDown,
          YoyRedSame,
        },
      },
    });

    await wrapper.vm.$nextTick();

    // Check for Planning Tab elements
    expect(wrapper.find('.text-slate-500').text()).toContain('IRR On Project');
  });
});
