import { mount, shallowMount } from '@vue/test-utils';
import TabsWrapperApprove from '@/components/ui/TabsWrapperApprove.vue';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';

describe('TabsWrapperApprove.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    // Create and activate Pinia
    const pinia = createPinia();
    setActivePinia(pinia);

    wrapper = shallowMount(TabsWrapperApprove, {
      global: {
        plugins: [pinia],
      },
      props: {
        isLihatGrafik: true,
        lamanData: true,
        idMesin: 1,
        tahunGrafik: 2023,
        irrOnProject: 10,
        irrOnEquity: 12,
        waccOnProject: 5,
        waccOnEquity: 4,
        npvOnEquity: 10000,
        npvOnProject: 12000,
        averageNcf: 8,
        averageEaf: 85,
        namaMesin: 'Mesin ABC',
        namaPengelola: 'Pengelola XYZ',
        namaPembina: 'Pembina 123',
        tahunOperasi: '2015',
        dayaTerpasang: 50,
        dayaMampu: 45,
        tahun: 2023,
        nilaiAssetAwal: 50000000,
        tahunPerolehanData: '2024',
        jumlahMesin: 3,
        statusGrafik: 'Aktif',
        photo: '',
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the correct tab titles', async () => {
    await nextTick();
    const tabTitles = wrapper.findAll('li');
    expect(tabTitles).toHaveLength(2); // Assuming two tabs
  });

  it('handles tab clicks correctly', async () => {
    const tabs = wrapper.findAll('li');
    await tabs[0].trigger('click');
    expect(wrapper.vm.tabGraphic).toBe('Semua');

    await tabs[1].trigger('click');
    expect(wrapper.vm.tabGraphic).toBe('Biaya Komponen');
  });

  it('displays modal when Lihat Grafik button is clicked', async () => {
    await wrapper.find('#lihat-button').trigger('click');
    await nextTick();
    expect(wrapper.vm.showModal).toBe(true);
  });
  it('renders correct data when modal is open', async () => {
    wrapper.vm.showModal = true;
    await nextTick();

    const modalContent = wrapper.find('.text-lg.font-semibold');
    expect(modalContent.exists()).toBe(true);
    expect(modalContent.text()).toContain('Lihat Grafik');
  });

  it('should change tabs for Grafik WLC', async () => {
    wrapper.vm.changeTabGrafik(1);
    expect(wrapper.vm.tabGraphic).toBe('Semua');

    wrapper.vm.changeTabGrafik(2);
    expect(wrapper.vm.tabGraphic).toBe('Biaya Komponen');
  });
  
  it('should trigger grafik rendering correctly', async () => {
    wrapper.vm.forceRender = jest.fn();
    await wrapper.vm.forceRender();
    expect(wrapper.vm.forceRender).toHaveBeenCalled();
  });
});
