import { shallowMount } from '@vue/test-utils';
import GrafikSentral from '@/views/Data/Grafik/GrafikSentral.vue';
import GrafikService from '@/services/grafik-service';
import { createPinia, setActivePinia } from 'pinia';

jest.mock('@/services/grafik-service');

describe('GrafikSentral.vue', () => {
  let wrapper;
  const grafikService = GrafikService as any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    wrapper = shallowMount(GrafikSentral, {
      props: {
        idSentral: '123',
        tahunData: 2022,
      },
    });
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  // it("is fetching handleClickWlcAll", async () => {
  //   const handleClickWlcAllSpy = jest.spyOn(wrapper.vm, "handleClickWlcAll");
  //   await wrapper.vm.handleClickWlcAll();
  //   expect(handleClickWlcAllSpy).toHaveBeenCalled();
  // });
});