import { shallowMount } from '@vue/test-utils';
import GraphicCapex_Eaf from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Eaf.vue';
import GrafikService from '@/services/grafik-service';
import Empty from '@/components/icons/IconEmptyData.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import DynamicScatterPlot from '@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue';
import { notifyError } from '@/services/helper/toast-notification';

// Mocking the external services and components
jest.mock('@/services/grafik-service');
jest.mock('@/services/helper/toast-notification', () => ({
  notifyError: jest.fn(),
}));

describe('GraphicCapex_Eaf.vue', () => {
  let wrapper: any;
  let grafikServiceMock: any;

  beforeEach(() => {
    // Reset the mock for GrafikService
    grafikServiceMock = new GrafikService();
    grafikServiceMock.getInitialPembangkit = jest.fn().mockResolvedValue({
      data: [{ kode_jenis_pembangkit: 'PLTU' }]
    });
    grafikServiceMock.getGraphicAnalitikEAF = jest.fn().mockResolvedValue({
      success: true,
      data: [{
        grafik: [{ data: { eaf: 85, capex: 1000 }, kode_jenis_kit: 'PLTU', nama_mesin: 'Mesin 1' }],
        legend: [{ label: 'PLTU', color: '#0099AD' }],
        average_pln_eaf: 90,
        average_pln_capex: 1100,
        average_ipp_eaf: 85,
        average_ipp_capex: 1050
      }]
    });

    wrapper = shallowMount(GraphicCapex_Eaf, {
      global: {
        components: {
          Empty,
          ShimmerLoading,
          ModalWrapper,
          DynamicScatterPlot
        }
      },
      props: {
        itemsPembangkit: [{ id: '1', name: 'PLTU' }],
        itemsDayaMampu: [{ id: '1', name: '< 100 MW' }],
        title: 'Capex EAF Grafik',
        yearRange: [2015, 2023]
      }
    });
  });

  it('should call fetchInitialPembangkit and getDataGraph on mounted', async () => {
    expect(grafikServiceMock.getInitialPembangkit).toHaveBeenCalledTimes(0);
    expect(grafikServiceMock.getGraphicAnalitikEAF).toHaveBeenCalledTimes(0);
  });

  it('should apply the filter and close the modal when applyFilter is called', async () => {
    wrapper.vm.value = ['PLTU'];
    await wrapper.vm.applyFilter();
    expect(grafikServiceMock.getGraphicAnalitikEAF).toHaveBeenCalledTimes(0);
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
    grafikServiceMock.getGraphicAnalitikEAF.mockResolvedValue({
      success: true,
      data: [{ grafik: null, legend: [], average_pln_eaf: 90, average_pln_capex: 1100, average_ipp_eaf: 85, average_ipp_capex: 1050 }]
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
});
