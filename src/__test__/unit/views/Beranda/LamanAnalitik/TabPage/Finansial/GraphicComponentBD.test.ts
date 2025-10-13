import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import GraphicComponentBD from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentBD.vue';
import GrafikService from '@/services/grafik-service';
import { notifyError } from '@/services/helper/toast-notification';

// Mock the services
vi.mock('@/services/grafik-service');
vi.mock('@/services/helper/toast-notification');

// Mock data
const mockGraphicData = {
  success: true,
  data: {
    data: [
      {
        kode_jenis_kit: 'PLTU',
        data: {
          tahun: '2020',
          value: 100,
        },
        nama_mesin: 'Test Machine 1',
      },
      {
        kode_jenis_kit: 'PLTG',
        data: {
          tahun: '2021',
          value: 150,
        },
        nama_mesin: 'Test Machine 2',
      },
    ],
    legend: [
      { label: 'PLTU', color: '#ff0000' },
      { label: 'PLTG', color: '#00ff00' },
    ],
  }
};

const defaultProps = {
  itemsPembangkit: [
    { id: 'PLTU', name: 'PLTU' },
    { id: 'PLTG', name: 'PLTG' },
    { id: 'PLTS', name: 'PLTS' },
  ],
  itemsDayaMampu: [
    { id: '1', name: 'PLTU < 100' },
    { id: '2', name: 'PLTU 100 - 400' },
  ],
  itemsDaya: [
    { id: '1', daya: '100', satuan: 'MW' },
    { id: '2', daya: '200', satuan: 'MW' },
  ],
  title: 'Test Graphic OpexBD',
  yearRange: [2020, 2025],
};

describe('GraphicComponentBD', () => {
  let wrapper: any;
  let mockGrafikService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockGrafikService = {
      getInitialPembangkit: vi.fn(),
      getGraphicBiaya: vi.fn(),
    };
    
    vi.mocked(GrafikService).mockImplementation(() => mockGrafikService);
    
    wrapper = mount(GraphicComponentBD, {
      props: defaultProps,
      global: {
        stubs: {
          'el-select': true,
          'el-option': true,
          'el-checkbox': true,
          'VueDatePicker': true,
          'ModalWrapper': true,
          'ShimmerLoading': true,
          'DynamicScatterPlotVertiLine': true,
          'Empty': true,
        },
      },
    });
  });

  describe('Component Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(wrapper.vm.checkAll).toBe(false);
      expect(wrapper.vm.checkDmn).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
      expect(wrapper.vm.value).toEqual([]);
      expect(wrapper.vm.dmn).toEqual([1, 2, 3]);
      expect(wrapper.vm.showModal).toBe(false);
      expect(wrapper.vm.isLoading).toBe(false);
      expect(wrapper.vm.graphData.isEmpty).toBe(true);
    });
  });

  describe('fetchInitialPembangkit', () => {
    it('should fetch initial pembangkit data successfully', async () => {
      const mockResponse = {
        data: [
          { kode_jenis_pembangkit: 'PLTU' },
          { kode_jenis_pembangkit: 'PLTG' },
        ],
      };
      
      mockGrafikService.getInitialPembangkit.mockResolvedValue(mockResponse);
      
      await wrapper.vm.fetchInitialPembangkit();
      
      expect(mockGrafikService.getInitialPembangkit).toHaveBeenCalled();
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG']);
    });

    it('should handle error in fetchInitialPembangkit', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Network error');
      
      mockGrafikService.getInitialPembangkit.mockRejectedValue(error);
      
      await wrapper.vm.fetchInitialPembangkit();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Initial Pembangkit Error : ', error);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getDataGraph', () => {
    it('should fetch graph data successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = [1, 2];
      wrapper.vm.filter.periode = [2020, 2025];
      
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockGraphicData);
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.isLoading).toBe(false);
      expect(wrapper.vm.graphData.isEmpty).toBe(false);
      expect(wrapper.vm.graphData.series).toHaveLength(2);
      expect(wrapper.vm.graphData.legends).toHaveLength(2);
    });

    it('should handle empty data response', async () => {
      const emptyResponse = {
        success: true,
        data: {
          data: [],
          legend: [],
        },
      };
      
      mockGrafikService.getGraphicBiaya.mockResolvedValue(emptyResponse);
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(true);
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it('should handle error in getDataGraph', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const error = new Error('API error');
      
      mockGrafikService.getGraphicBiaya.mockRejectedValue(error);
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.isLoading).toBe(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      consoleLogSpy.mockRestore();
    });

    it('should handle null periode in filter', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = [1];
      wrapper.vm.filter.periode = null;
      
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockGraphicData);
      
      await wrapper.vm.getDataGraph();
      
      expect(mockGrafikService.getGraphicBiaya).toHaveBeenCalledWith({
        komponen: 'BD',
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: [1],
        tahun_awal: '',
        tahun_akhir: '',
      });
    });
  });

  describe('getDataGraphNoDMN', () => {
    it('should fetch graph data without DMN successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = [2020, 2025];
      
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockGraphicData);
      
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(wrapper.vm.isLoading).toBe(false);
      expect(wrapper.vm.graphData.isEmpty).toBe(false);
      expect(mockGrafikService.getGraphicBiaya).toHaveBeenCalledWith({
        komponen: 'BD',
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: [],
        tahun_awal: '2020',
        tahun_akhir: '2025',
      });
    });

    it('should handle error in getDataGraphNoDMN', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const error = new Error('API error');
      
      mockGrafikService.getGraphicBiaya.mockRejectedValue(error);
      
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(wrapper.vm.isLoading).toBe(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      consoleLogSpy.mockRestore();
    });

    it('should handle null periode in getDataGraphNoDMN', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = null;
      
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockGraphicData);
      
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(mockGrafikService.getGraphicBiaya).toHaveBeenCalledWith({
        komponen: 'BD',
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: [],
        tahun_awal: '',
        tahun_akhir: '',
      });
    });
  });

  describe('closeModal', () => {
    it('should close modal when value has length', () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.showModal = true;
      
      wrapper.vm.closeModal();
      
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when no kategori pembangkit and no periode', () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should show error when no periode only', () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should close modal when value has length even if periode is null', () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = null;
      wrapper.vm.showModal = true;
      
      wrapper.vm.closeModal();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(notifyError).not.toHaveBeenCalled();
    });

    it('should show error when no kategori pembangkit only', () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2020, 2025];
      
      wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!',
        5000
      );
    });
  });

  describe('applyFilter', () => {
    it('should apply filter successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.showModal = true;
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockGraphicData);
      
      await wrapper.vm.applyFilter();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikService.getGraphicBiaya).toHaveBeenCalled();
    });

    it('should show error when no kategori pembangkit and no periode in applyFilter', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should show error when no periode only in applyFilter', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should apply filter successfully when value has length even if periode is null', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = null;
      wrapper.vm.showModal = true;
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockGraphicData);
      
      await wrapper.vm.applyFilter();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikService.getGraphicBiaya).toHaveBeenCalled();
      expect(notifyError).not.toHaveBeenCalled();
    });

    it('should show error when no kategori pembangkit only in applyFilter', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2020, 2025];
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!',
        5000
      );
    });
  });

  describe('applyFilterNoDMN', () => {
    it('should apply filter without DMN successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.showModal = true;
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockGraphicData);
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikService.getGraphicBiaya).toHaveBeenCalled();
    });

    it('should show error when no kategori pembangkit and no periode in applyFilterNoDMN', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should show error when no periode only in applyFilterNoDMN', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should apply filter successfully when value has length even if periode is null in applyFilterNoDMN', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = null;
      wrapper.vm.showModal = true;
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockGraphicData);
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikService.getGraphicBiaya).toHaveBeenCalled();
      expect(notifyError).not.toHaveBeenCalled();
    });

    it('should show error when no kategori pembangkit only in applyFilterNoDMN', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2020, 2025];
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!',
        5000
      );
    });
  });

  describe('watch value', () => {
    it('should update checkAll and indeterminate when value changes to empty', async () => {
      wrapper.vm.value = [];
      await nextTick();
      
      expect(wrapper.vm.checkAll).toBe(false);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update checkAll when value length equals itemsPembangkit length', async () => {
      wrapper.vm.value = ['PLTU', 'PLTG', 'PLTS'];
      await nextTick();
      
      expect(wrapper.vm.checkAll).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should set indeterminate when value length is between 0 and max', async () => {
      wrapper.vm.value = ['PLTU'];
      await nextTick();
      
      expect(wrapper.vm.indeterminate).toBe(true);
    });
  });

  describe('handleCheckAll', () => {
    it('should select all items when val is true', () => {
      wrapper.vm.handleCheckAll(true);
      
      expect(wrapper.vm.indeterminate).toBe(false);
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG', 'PLTS']);
    });

    it('should clear all items when val is false', () => {
      wrapper.vm.value = ['PLTU', 'PLTG'];
      wrapper.vm.handleCheckAll(false);
      
      expect(wrapper.vm.indeterminate).toBe(false);
      expect(wrapper.vm.value).toEqual([]);
    });
  });

  describe('watch dmn', () => {
    it('should update checkDmn and indeterminateDmn when dmn changes to empty', async () => {
      wrapper.vm.dmn = [];
      await nextTick();
      
      expect(wrapper.vm.checkDmn).toBe(false);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should update checkDmn when dmn length equals itemsDayaMampu length', async () => {
      wrapper.vm.dmn = ['1', '2'];
      await nextTick();
      
      expect(wrapper.vm.checkDmn).toBe(true);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should set indeterminateDmn when dmn length is between 0 and max', async () => {
      wrapper.vm.dmn = ['1'];
      await nextTick();
      
      expect(wrapper.vm.indeterminateDmn).toBe(true);
    });
  });

  describe('handleCheckDmn', () => {
    it('should select all DMN items when val is true', () => {
      wrapper.vm.handleCheckDmn(true);
      
      expect(wrapper.vm.indeterminateDmn).toBe(false);
      expect(wrapper.vm.dmn).toEqual(['1', '2']);
    });

    it('should clear all DMN items when val is false', () => {
      wrapper.vm.dmn = ['1', '2'];
      wrapper.vm.handleCheckDmn(false);
      
      expect(wrapper.vm.indeterminateDmn).toBe(false);
      expect(wrapper.vm.dmn).toEqual([]);
    });
  });

  describe('Component Rendering', () => {
    it('should render title correctly', () => {
      expect(wrapper.text()).toContain(defaultProps.title);
    });

    it('should toggle modal when filter button is clicked', async () => {
      const filterButton = wrapper.find('#hover-button');
      
      expect(wrapper.vm.showModal).toBe(false);
      
      await filterButton.trigger('click');
      
      expect(wrapper.vm.showModal).toBe(true);
    });

    it('should show loading shimmer when isLoading is true', async () => {
      wrapper.vm.isLoading = true;
      await nextTick();
      
      expect(wrapper.findComponent({ name: 'ShimmerLoading' }).exists()).toBe(true);
    });

    it('should show empty state when graphData is empty', async () => {
      wrapper.vm.isLoading = false;
      wrapper.vm.graphData.isEmpty = true;
      await nextTick();
      
      expect(wrapper.findComponent({ name: 'Empty' }).exists()).toBe(true);
      expect(wrapper.text()).toContain('Grafik Tidak Tersedia');
    });

    it('should show DynamicScatterPlotVertiLine when data is available', async () => {
      wrapper.vm.isLoading = false;
      wrapper.vm.graphData.isEmpty = false;
      wrapper.vm.graphData.series = [{ name: 'Test', data: [] }];
      wrapper.vm.graphData.legends = [{ label: 'Test', color: '#ff0000' }];
      await nextTick();
      
      expect(wrapper.findComponent({ name: 'DynamicScatterPlotVertiLine' }).exists()).toBe(true);
    });
  });

  describe('Graph Data Processing', () => {
    it('should process legend and series data correctly in getDataGraph', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = [1];
      wrapper.vm.filter.periode = [2020, 2025];
      
      const mockResponse = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTU',
              data: {
                tahun: '2020',
                value: 100,
              },
              nama_mesin: 'Machine 1',
            },
          ],
          legend: [
            { label: 'PLTU', color: '#ff0000' },
          ],
        },
      };
      
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockResponse);
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.graphData.legends).toEqual([{ label: 'PLTU', color: '#ff0000' }]);
      expect(wrapper.vm.graphData.series).toHaveLength(1);
      expect(wrapper.vm.graphData.series[0].data).toEqual([[2020, 100, 5, 'Machine 1']]);
      expect(wrapper.vm.graphData.years).toContain(2020);
      expect(wrapper.vm.graphData.values).toContain(100);
    });

    it('should process data correctly when kode_jenis_kit does not match', async () => {
      wrapper.vm.value = ['PLTU'];
      
      const mockResponse = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTG', // Different from legend
              data: {
                tahun: '2020',
                value: 100,
              },
              nama_mesin: 'Machine 1',
            },
          ],
          legend: [
            { label: 'PLTU', color: '#ff0000' },
          ],
        },
      };
      
      mockGrafikService.getGraphicBiaya.mockResolvedValue(mockResponse);
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.graphData.series[0].data).toEqual([]);
    });
  });
});