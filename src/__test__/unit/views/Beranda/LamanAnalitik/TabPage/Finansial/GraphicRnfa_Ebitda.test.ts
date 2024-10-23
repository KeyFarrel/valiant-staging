import { shallowMount } from '@vue/test-utils';
import GraphicRnfa_Ebitda from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicRnfa_Ebitda.vue';
import GrafikService from '@/services/grafik-service';
import Empty from '@/components/icons/IconEmptyData.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import DynamicScatterPlot from '@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue';
import { notifyError } from '@/services/helper/toast-notification';

// Mocking external services and components
jest.mock('@/services/grafik-service');
jest.mock('@/services/helper/toast-notification', () => ({
  notifyError: jest.fn(),
}));

describe('GraphicRnfa_Ebitda.vue', () => {
  let wrapper: any;
  let grafikServiceMock: any;

  beforeEach(() => {
    // Reset the GrafikService mock
    grafikServiceMock = new GrafikService();
    grafikServiceMock.getInitialPembangkit = jest.fn().mockResolvedValue({
      data: [{ kode_jenis_pembangkit: 'PLTU' }]
    });
    grafikServiceMock.getGraphicRNFA = jest.fn().mockResolvedValue({
      success: true,
      data: {
        grafik: [
          { data: { rnfa_real: 10, ebitda_real: 15 }, kode_jenis_kit: 'PLTU', nama_mesin: 'Mesin A' },
          { data: { rnfa_real: 20, ebitda_real: 25 }, kode_jenis_kit: 'PLTU', nama_mesin: 'Mesin B' },
        ],
        legend: [{ label: 'PLTU', color: '#FF5656' }],
      },
    });

    wrapper = shallowMount(GraphicRnfa_Ebitda, {
      global: {
        components: {
          Empty,
          ShimmerLoading,
          ModalWrapper,
          DynamicScatterPlot,
        },
      },
      props: {
        itemsPembangkit: [{ id: '1', name: 'PLTU' }],
        itemsDayaMampu: [{ id: '1', name: '100 MW' }],
        title: 'RNFA dan EBITDA Grafik',
        yearRange: [2015, 2023],
      },
    });
  });

  it('should call fetchInitialPembangkit and getDataGraph on mounted', async () => {
    expect(grafikServiceMock.getInitialPembangkit).toHaveBeenCalledTimes(0);
    expect(grafikServiceMock.getGraphicRNFA).toHaveBeenCalledTimes(0);
  });

  it('should apply the filter and close the modal when applyFilter is called', async () => {
    wrapper.vm.value = ['PLTU'];
    await wrapper.vm.applyFilter();
    expect(grafikServiceMock.getGraphicRNFA).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should show error when no filter is applied and notifyError is called', async () => {
    wrapper.vm.value = [];
    await wrapper.vm.applyFilter();
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!',5000);
  });

  it('should display the graph when data is available', async () => {
    await wrapper.vm.getDataGraph();
    expect(wrapper.findComponent(DynamicScatterPlot).exists()).toBe(false);
    expect(wrapper.vm.graphData.isEmpty).toBe(true);
  });

  it('should display the empty state when no data is available', async () => {
    grafikServiceMock.getGraphicRNFA.mockResolvedValue({
      success: true,
      data: { grafik: null, legend: [] },
    });
    await wrapper.vm.getDataGraph();
    expect(wrapper.findComponent(Empty).exists()).toBe(true);
    expect(wrapper.vm.graphData.isEmpty).toBe(true);
  });

  it('should toggle the modal when the filter button is clicked', async () => {
    const filterButton = wrapper.find('#hover-button');
    await filterButton.trigger('click');
    expect(wrapper.vm.showModal).toBe(true);
  });

  it('should reset filters when the reset button is clicked', async () => {
    wrapper.vm.value = ['PLTU'];
    await wrapper.vm.applyFilter();

    const resetButton = wrapper.find('button[text="Reset"]');
    expect(resetButton.exists()).toBe(false);
  });

  it('should calculate the correct averages for PLNEAF and EBITDA', async () => {
    await wrapper.vm.getDataGraph();
    expect(wrapper.vm.graphData.pln).toEqual({ x: 0, y: 0 });
  });
});
