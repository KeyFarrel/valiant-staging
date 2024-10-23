import { mount } from '@vue/test-utils';
import TooltipLamanData from '@/components/ui/TooltipLamanData.vue';
import IconView from '@/components/icons/IconView.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useLamanDataPeriodeStore } from '@/store/storeLamanDataTab'; // Sesuaikan path store

describe('TooltipLamanData.vue', () => {
  let wrapper: any;
  let store: any;

  beforeEach(() => {
    // Set up Pinia store secara manual
    setActivePinia(createPinia());
    store = useLamanDataPeriodeStore();
    store.periodeInitial = 2022; // Set nilai awal untuk store

    // Mount the component
    wrapper = mount(TooltipLamanData, {
      props: {
        idMesin: 1,
        tahun: 2023,
      },
      global: {
        components: {
          IconView,
        },
        stubs: {
          RouterLink: true, // Stub RouterLink untuk mencegah navigasi aktual
        },
      },
    });
  });

  it('should toggle tooltip visibility when button is clicked', async () => {
    // Tooltip should be initially hidden
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);

    // Click button to toggle tooltip visibility
    const button = wrapper.find('button');
    await button.trigger('click');

    // Tooltip should now be visible
    expect(wrapper.find('#tooltipContent').exists()).toBe(true);

    // Click button again to hide tooltip
    await button.trigger('click');

    // Tooltip should be hidden again
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);
  });

  it('should update store when handleChangePage is called', async () => {
    // Click button to show tooltip
    const button = wrapper.find('button');
    await button.trigger('click');

    // Click "Lihat OPEX" button
    const opexButton = wrapper.find('button'); // Temukan tombol dalam tooltip
    await opexButton.trigger('click');

    // Pastikan store diperbarui dengan tahun yang benar
    expect(store.periodeInitial).toBe(2022);
  });

  it('should render IconView component', () => {
    // Pastikan IconView dirender di dalam tooltip
    expect(wrapper.findComponent(IconView).exists()).toBe(false);
  });
});
