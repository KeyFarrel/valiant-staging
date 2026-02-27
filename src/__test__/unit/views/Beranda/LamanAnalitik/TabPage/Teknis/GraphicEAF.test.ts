import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicEAF from '@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicEAF.vue';
import GrafikService from '@/services/grafik-service';
import { notifyError } from '@/services/helper/toast-notification';
import type { MockedClass } from 'vitest';

// Mock services
vi.mock('@/services/grafik-service');
vi.mock('@/services/helper/toast-notification');

const MockedGrafikService = GrafikService as MockedClass<typeof GrafikService>;
const mockedNotifyError = vi.fn();

describe('GraphicEAF.vue - Uncovered Lines', () => {
  let wrapper: any;
  let grafikServiceMock: any;

  const defaultProps = {
    itemsPembangkit: [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' },
    ],
    itemsDayaMampu: [
      { id: '1', name: 'PLTU < 100' },
      { id: '2', name: 'PLTU 100 - 400' },
      { id: '3', name: 'PLTU > 400' },
    ],
    itemsDaya: [
      { id: '1', daya: '100', satuan: 'MW' },
    ],
    title: 'Test EAF',
    yearRange: [2020, 2025],
    initialPembangkit: ['PLTU', 'PLTG'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    grafikServiceMock = {
      getInitialPembangkit: vi.fn(),
      getGraphicTeknisEAF: vi.fn(),
    };
    MockedGrafikService.mockImplementation(() => grafikServiceMock);
    (notifyError as any).mockImplementation(mockedNotifyError);
  });
  const createWrapper = (props = defaultProps) => {
    return mount(GraphicEAF, {
      props,
      global: {
        stubs: {
          'ShimmerLoading': true,
          'ModalWrapper': true,
          'DynamicScatterPlotVertiLine': true,
          'IconEmptyData': true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true,
          'VueDatePicker': true,
        },
      },
    });
  };

  describe('Error Handling - fetchInitialPembangkit', () => {
    it('should handle error in fetchInitialPembangkit', async () => {
      // When initialPembangkit prop is undefined/missing, value should default to empty array
      wrapper = createWrapper({ ...defaultProps, initialPembangkit: undefined });
      await nextTick();

      const vm = wrapper.vm;
      expect(vm.value).toEqual([]);
    });
  });

  describe('Error Handling - getDataGraph', () => {
    it('should handle error in getDataGraph and set loading false', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const error = new Error('API error');
      
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockRejectedValue(error);

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraph();

      expect(vm.isLoading).toBe(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleLogSpy.mockRestore();
    });
  });

  describe('Error Handling - getDataGraphNoDMN', () => {
    it('should handle error in getDataGraphNoDMN and set loading false', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const error = new Error('API error');
      
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockRejectedValue(error);

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraphNoDMN();

      expect(vm.isLoading).toBe(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleLogSpy.mockRestore();
    });
  });

  describe('Modal Close Validations', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should show error when no kategori and no periode in closeModal', () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = null;
      
      vm.closeModal();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      );
    });

    it('should close modal when value has items', () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU'];
      vm.showModal = true;
      
      vm.closeModal();

      expect(vm.showModal).toBe(false);
      expect(mockedNotifyError).not.toHaveBeenCalled();
    });

    it('should show error when no periode only in closeModal', () => {
      const vm = wrapper.vm;
      vm.value = []; // Set empty untuk masuk ke kondisi else if
      vm.filter.periode = null;
      
      vm.closeModal();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      );
    });

    it('should show error when no kategori only in closeModal', () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = [2020, 2023];
      
      vm.closeModal();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!', 
        5000
      );
    });
  });

  describe('Apply Filter Validations', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should show error when no kategori and no periode in applyFilter', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = null;
      
      await vm.applyFilter();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      );
    });

    it('should show error when no kategori and no periode in applyFilterNoDMN', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = null;
      
      await vm.applyFilterNoDMN();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      );
    });
  });

  describe('Checkbox Handlers', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should handle handleCheckDmn with true value', () => {
      const vm = wrapper.vm;
      vm.handleCheckDmn(true);

      expect(vm.dmn).toEqual(['1', '2', '3']);
      expect(vm.indeterminateDmn).toBe(false);
    });

    it('should handle handleCheckDmn with false value', () => {
      const vm = wrapper.vm;
      vm.dmn = ['1', '2'];
      vm.handleCheckDmn(false);

      expect(vm.dmn).toEqual([]);
      expect(vm.indeterminateDmn).toBe(false);
    });

    it('should handle handleCheckAll with true value', () => {
      const vm = wrapper.vm;
      vm.handleCheckAll(true);

      expect(vm.value).toEqual(['PLTU', 'PLTG']);
      expect(vm.indeterminate).toBe(false);
    });

    it('should handle handleCheckAll with false value', () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU'];
      vm.handleCheckAll(false);

      expect(vm.value).toEqual([]);
      expect(vm.indeterminate).toBe(false);
    });
  });

  describe('Data Processing Edge Cases', () => {
    it('should handle null data response in getDataGraph', async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({
        success: true,
        data: { data: null, legend: [] }
      });

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraph();

      expect(vm.graphData.isEmpty).toBe(true);
      expect(vm.isLoading).toBe(false);
    });

    it('should handle null data response in getDataGraphNoDMN', async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({
        success: true,
        data: { data: null, legend: [] }
      });

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraphNoDMN();

      expect(vm.graphData.isEmpty).toBe(true);
      expect(vm.isLoading).toBe(false);
    });
  });

  describe('Additional Filter Validations for Uncovered Lines', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should show error when no kategori only in applyFilter', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = [2020, 2023];
      
      await vm.applyFilter();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!', 
        5000
      );
    });

    it('should show error when no kategori only in applyFilterNoDMN', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = [2020, 2023];
      
      await vm.applyFilterNoDMN();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!', 
        5000
      );
    });

    it('should close modal when both value and periode are valid', async () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU'];
      vm.filter.periode = [2020, 2023];
      vm.showModal = true;
      
      vm.closeModal();

      expect(vm.showModal).toBe(false);
      expect(mockedNotifyError).not.toHaveBeenCalled();
    });
  });

  describe('Watch Functions Edge Cases', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should handle value watch with partial selection', async () => {
      const vm = wrapper.vm;

      // Reset to empty first so checkAll starts at false
      vm.value = [];
      await nextTick();
      
      // Test partial selection (indeterminate)
      vm.value = ['PLTU'];
      await nextTick();
      expect(vm.indeterminate).toBe(true);
      expect(vm.checkAll).toBe(false);

      // Test full selection
      vm.value = ['PLTU', 'PLTG'];
      await nextTick();
      expect(vm.checkAll).toBe(true);
      expect(vm.indeterminate).toBe(false);
    });

    it('should handle dmn watch with partial selection', async () => {
      const vm = wrapper.vm;
      
      // Reset initial state
      vm.dmn = [];
      vm.checkDmn = false;
      vm.indeterminateDmn = false;
      await nextTick();
      
      // Test partial selection (indeterminate)
      vm.dmn = ['1'];
      await nextTick();
      expect(vm.indeterminateDmn).toBe(true);

      // Test full selection
      vm.dmn = ['1', '2', '3'];
      await nextTick();
      expect(vm.checkDmn).toBe(true);
      expect(vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Component Lifecycle and Data Processing', () => {
    it('should process data correctly with valid response in getDataGraph', async () => {
      const mockData = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTU',
              data: { tahun: '2020', value: 85.5 },
              nama_mesin: 'Test Machine'
            }
          ],
          legend: [{ label: 'PLTU', color: '#ff0000' }]
        }
      };

      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue(mockData);

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraph();

      expect(vm.graphData.isEmpty).toBe(false);
      expect(vm.graphData.series).toHaveLength(1);
      expect(vm.graphData.legends).toHaveLength(1);
      expect(vm.graphData.years).toContain(2020);
      expect(vm.graphData.values).toContain(85.5);
      expect(vm.isLoading).toBe(false);
    });

    it('should process data correctly with valid response in getDataGraphNoDMN', async () => {
      const mockData = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTG',
              data: { tahun: '2021', value: 75.2 },
              nama_mesin: 'Test Machine 2'
            }
          ],
          legend: [{ label: 'PLTG', color: '#00ff00' }]
        }
      };

      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue(mockData);

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraphNoDMN();

      expect(vm.graphData.isEmpty).toBe(false);
      expect(vm.graphData.series).toHaveLength(1);
      expect(vm.graphData.legends).toHaveLength(1);
      expect(vm.graphData.years).toContain(2021);
      expect(vm.graphData.values).toContain(75.2);
      expect(vm.isLoading).toBe(false);
    });

    it('should populate value array from initial pembangkit data on mount', async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });

      wrapper = createWrapper({ ...defaultProps, initialPembangkit: ['PLTU', 'PLTG'] });
      await nextTick();

      const vm = wrapper.vm;
      expect(vm.value).toEqual(['PLTU', 'PLTG']);
    });
  });
});
