import { shallowMount } from '@vue/test-utils';
import FinansialTab from '@/views/Beranda/LamanAnalitik/TabPage/FinansialTab.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import GraphicRnfa_Ebitda from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicRnfa_Ebitda.vue';
import GraphicCapex_Eaf from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Eaf.vue';
import GraphicCapex_Ncf from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Ncf.vue';
import GraphicOpexBd from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexBd.vue';
import GraphicOpexc_Nphr from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexc_Nphr.vue';
import GraphicCapex_Efor from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Efor.vue';
import GraphicComponentA from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentA.vue';
import GraphicComponentBD from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentBD.vue';
import GraphicComponentC from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentC.vue';
import GrafikService from '@/services/grafik-service';
import LamanService from '@/services/laman-service';

// Mock the necessary services
jest.mock('@/services/grafik-service', () => {
  return jest.fn().mockImplementation(() => ({
    getComboKategoriPembangkit: jest.fn().mockResolvedValue({
      success: true,
      data: [{ jenis_kit: 'PLTU', dmn: [{ id_daya: '1', daya_mampu: '500' }] }]
    }),
    getFilterDaya: jest.fn().mockResolvedValue({ success: true, data: [] }),
  }));
});

jest.mock('@/services/laman-service', () => {
  return jest.fn().mockImplementation(() => ({
    getListTahunAnalitik: jest.fn().mockResolvedValue({
      data: [{ tahun: 2020 }, { tahun: 2023 }]
    })
  }));
});

describe('FinansialTab.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(FinansialTab, {
      global: {
        stubs: {
          Loading: true,
          GraphicRnfa_Ebitda: true,
          GraphicCapex_Eaf: true,
          GraphicCapex_Ncf: true,
          GraphicOpexBd: true,
          GraphicOpexc_Nphr: true,
          GraphicCapex_Efor: true,
          GraphicComponentA: true,
          GraphicComponentBD: true,
          GraphicComponentC: true,
        },
      },
    });
  });

  it('renders Loading component when isLoading is true', async () => {
    wrapper.vm.isLoading = true; // Set langsung pada vm
    await wrapper.vm.$nextTick(); // Pastikan reaktivitas terpicu
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });
  

  it('fetches category data on mount', async () => {
    const grafikServiceInstance = new GrafikService();
    const getCategorySpy = jest.spyOn(grafikServiceInstance, 'getComboKategoriPembangkit');
    await wrapper.vm.$nextTick(); // Wait for lifecycle hooks
    expect(getCategorySpy).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.itemsCategory.length).toBeGreaterThan(0); // Ensure the itemsCategory is populated
  });

  it('fetches year range on mount', async () => {
    const lamanServiceInstance = new LamanService();
    const fetchYearRangeSpy = jest.spyOn(lamanServiceInstance, 'getListTahunAnalitik');
    await wrapper.vm.$nextTick(); // Wait for lifecycle hooks
    expect(fetchYearRangeSpy).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.yearRange).toEqual([2023, 2023]);
  });

  it('renders the graphics components when data is available', async () => {
    wrapper.vm.itemsCategory = [{ id: '1', name: 'PLTU' }]; // Set data langsung
    await wrapper.vm.$nextTick(); // Tunggu hingga DOM diperbarui
  
    expect(wrapper.findComponent(GraphicRnfa_Ebitda).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicCapex_Eaf).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicCapex_Ncf).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicCapex_Efor).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicOpexBd).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicOpexc_Nphr).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicComponentA).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicComponentBD).exists()).toBe(true);
    expect(wrapper.findComponent(GraphicComponentC).exists()).toBe(true);
  });
  
});
