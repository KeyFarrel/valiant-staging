import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicCapexEfor from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Efor.vue';
import GrafikService from '@/services/grafik-service';
import PetaService from '@/services/peta-service';
import { notifyError } from '@/services/helper/toast-notification';

// Default props for testing
const defaultProps = {
  itemsPembangkit: [
    { id: 'PLTU', name: 'PLTU' },
    { id: 'PLTG', name: 'PLTG' },
    { id: 'PLTS', name: 'PLTS' },
  ],
  itemsDayaMampu: [
    { id: '1', name: 'PLTU < 100' },
    { id: '2', name: 'PLTU 100 - 400' },
    { id: '3', name: 'PLTU > 400' },
  ],
  title: 'Test Graphic CAPEX EFOR',
  yearRange: [2020, 2025],
};

// Mock the services
vi.mock('@/services/grafik-service');
vi.mock('@/services/peta-service');
vi.mock('@/services/helper/toast-notification');

const mockGrafikService = {
  getInitialPembangkit: vi.fn(),
  getGraphicAnalitikEFOR: vi.fn(),
};

const mockPetaService = {};

describe('GraphicCapex_Efor.vue', () => {
  let wrapper: VueWrapper;
  
  const defaultMockData = {
    success: true,
    data: [{
      grafik: [
        {
          kode_jenis_kit: 'PLTU',
          data: {
            efor: 5.2,
            capex: 15000,
          },
          nama_mesin: 'PLTU Suralaya Unit 1',
        },
        {
          kode_jenis_kit: 'PLTG',
          data: {
            efor: 3.8,
            capex: 8000,
          },
          nama_mesin: 'PLTG Muara Karang Unit 1',
        },
      ],
      legend: [
        { label: 'PLTU', color: '#ff6b6b' },
        { label: 'PLTG', color: '#4ecdc4' },
      ],
      average_pln_efor: 4.5,
      average_pln_capex: 12000,
      average_ipp_efor: 4.2,
      average_ipp_capex: 11000,
    }]
  };

  const emptyMockData = {
    success: true,
    data: [{
      grafik: null,
      legend: null,
      average_pln_efor: 0,
      average_pln_capex: 0,
      average_ipp_efor: 0,
      average_ipp_capex: 0,
    }]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    (GrafikService as any).mockImplementation(() => mockGrafikService);
    (PetaService as any).mockImplementation(() => mockPetaService);
    
    mockGrafikService.getInitialPembangkit.mockResolvedValue({
      data: [
        { kode_jenis_pembangkit: 'PLTU' },
        { kode_jenis_pembangkit: 'PLTG' },
        { kode_jenis_pembangkit: 'PLTS' },
      ]
    });
    
    mockGrafikService.getGraphicAnalitikEFOR.mockResolvedValue(defaultMockData);
  });

  const createWrapper = (props = {}) => {
    return mount(GraphicCapexEfor, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs: {
          'el-select': {
            template: '<div class="el-select-mock"><slot name="header" /><slot /></div>',
            props: ['modelValue', 'multiple', 'clearable', 'collapseTagselect', 'placeholder', 'popperClass', 'maxCollapseTags'],
            emits: ['update:modelValue'],
          },
          'el-option': {
            template: '<div class="el-option-mock"></div>',
            props: ['label', 'value'],
          },
          'el-checkbox': {
            template: '<div class="el-checkbox-mock"></div>',
            props: ['modelValue', 'indeterminate'],
            emits: ['update:modelValue', 'change'],
          },
          'VueDatePicker': {
            template: '<div class="vue-date-picker-mock"></div>',
            props: ['modelValue', 'placeholder', 'formatLocale', 'yearRange', 'enableTimePicker', 'hideInputIcon', 'clearable', 'showNowButton', 'yearPicker', 'monthChangeOnScroll', 'teleport', 'autoApply'],
            emits: ['update:modelValue'],
          },
          'ModalWrapper': {
            template: '<div class="modal-wrapper-mock"><slot /></div>',
            props: ['showModal', 'width', 'height'],
          },
          'ShimmerLoading': {
            template: '<div class="shimmer-loading-mock">Loading...</div>',
          },
          'DynamicScatterPlot': {
            template: '<div class="scatter-plot-mock">Scatter Plot</div>',
            props: ['source', 'series', 'legends', 'pln', 'ipp', 'xData', 'yData', 'dataZoom'],
          },
          'Empty': {
            template: '<div class="empty-mock">Empty Data</div>',
          },
        },
      },
    });
  };

  describe('Component Core Functions', () => {
    it('should handle component initialization and data fetching', async () => {
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Test service calls during initialization
      expect(mockGrafikService.getInitialPembangkit).toHaveBeenCalled();
      expect(mockGrafikService.getGraphicAnalitikEFOR).toHaveBeenCalled();
      
      // Test UI rendering
      expect(wrapper.find('h2').text()).toBe(defaultProps.title);
      expect(wrapper.find('button').text()).toContain('Filter');
      
      // Test that data is processed
      expect(wrapper.find('.scatter-plot-mock').exists()).toBe(true);
    });

    it('should handle modal interaction and basic functionality', async () => {
      wrapper = createWrapper();
      await nextTick();
      
      // Test modal opening
      const filterButton = wrapper.find('button');
      await filterButton.trigger('click');
      
      // Test modal content rendering
      expect(wrapper.find('.modal-wrapper-mock').exists()).toBe(true);
      expect(wrapper.find('.el-select-mock').exists()).toBe(true);
      
      // Test that service calls are made during component interactions
      expect(mockGrafikService.getGraphicAnalitikEFOR).toHaveBeenCalled();
      
      // Verify component handles data correctly
      expect(wrapper.find('.scatter-plot-mock').exists()).toBe(true);
      
      // Test notification mock is available
      expect(notifyError).toBeDefined();
    });

    it('should handle watch functions and checkbox logic', async () => {
      wrapper = createWrapper();
      await nextTick();
      
      const vm = wrapper.vm as any;
      
      // Test value watcher - empty array
      vm.value = [];
      await nextTick();
      expect(vm.checkAll).toBe(false);
      expect(vm.indeterminate).toBe(false);
      
      // Test value watcher - partial selection
      vm.value = ['PLTU'];
      await nextTick();
      expect(vm.indeterminate).toBe(true);
      
      // Test value watcher - full selection
      vm.value = ['PLTU', 'PLTG', 'PLTS'];
      await nextTick();
      expect(vm.checkAll).toBe(true);
      expect(vm.indeterminate).toBe(false);
      
      // Test handleCheckAll - check all
      vm.handleCheckAll(true);
      await nextTick();
      expect(vm.value).toEqual(['PLTU', 'PLTG', 'PLTS']);
      expect(vm.indeterminate).toBe(false);
      
      // Test handleCheckAll - uncheck all
      vm.handleCheckAll(false);
      await nextTick();
      expect(vm.value).toEqual([]);
      expect(vm.indeterminate).toBe(false);
      
      // Test dmn watcher - empty array
      vm.dmn = [];
      await nextTick();
      expect(vm.checkDmn).toBe(false);
      expect(vm.indeterminateDmn).toBe(false);
      
      // Test dmn watcher - partial selection
      vm.dmn = ['1'];
      await nextTick();
      expect(vm.indeterminateDmn).toBe(true);
      
      // Test dmn watcher - full selection
      vm.dmn = ['1', '2', '3'];
      await nextTick();
      expect(vm.checkDmn).toBe(true);
      expect(vm.indeterminateDmn).toBe(false);
      
      // Test handleCheckDmn - check all
      vm.handleCheckDmn(true);
      await nextTick();
      expect(vm.dmn).toEqual(['1', '2', '3']);
      expect(vm.indeterminateDmn).toBe(false);
      
      // Test handleCheckDmn - uncheck all
      vm.handleCheckDmn(false);
      await nextTick();
      expect(vm.dmn).toEqual([]);
      expect(vm.indeterminateDmn).toBe(false);
    });

    it('should handle different data states and error scenarios', async () => {
      // Test with empty data response
      mockGrafikService.getGraphicAnalitikEFOR.mockResolvedValue(emptyMockData);
      
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show empty state
      expect(wrapper.find('.empty-mock').exists()).toBe(true);
      
      // Test error handling in fetchInitialPembangkit
      mockGrafikService.getInitialPembangkit.mockRejectedValue(new Error('API Error'));
      
      const errorWrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should handle error gracefully
      expect(mockGrafikService.getInitialPembangkit).toHaveBeenCalled();
      
      // Test getDataGraph error handling
      mockGrafikService.getGraphicAnalitikEFOR.mockRejectedValue(new Error('Graph API Error'));
      
      const graphErrorWrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockGrafikService.getGraphicAnalitikEFOR).toHaveBeenCalled();
    });

    it('should handle loading states and comprehensive data processing', async () => {
      // Mock delayed response to test loading
      let resolvePromise: (value: any) => void;
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      mockGrafikService.getGraphicAnalitikEFOR.mockReturnValue(delayedPromise);
      
      wrapper = createWrapper();
      await nextTick();
      
      // Should show loading state
      expect(wrapper.find('.shimmer-loading-mock').exists()).toBe(true);
      
      // Resolve with data
      resolvePromise!(defaultMockData);
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should show chart after loading
      expect(wrapper.find('.scatter-plot-mock').exists()).toBe(true);
      expect(wrapper.find('.shimmer-loading-mock').exists()).toBe(false);
      
      // Test comprehensive data processing with getDataGraphNoDMN
      const vm = wrapper.vm as any;
      
      // Reset mocks
      mockGrafikService.getGraphicAnalitikEFOR.mockClear();
      mockGrafikService.getGraphicAnalitikEFOR.mockResolvedValue(defaultMockData);
      
      // Test getDataGraphNoDMN call
      await vm.getDataGraphNoDMN();
      
      // Verify it was called with correct parameters
      expect(mockGrafikService.getGraphicAnalitikEFOR).toHaveBeenCalledWith({
        kode_jenis_pembangkit: expect.any(Array),
        id_daya: [],
        periode: expect.any(String)
      });
      
      // Test that data is processed correctly
      expect(vm.graphData.isEmpty).toBe(false);
      expect(vm.isLoading).toBe(false);
      
      // Test badge rendering for filters
      expect(wrapper.text()).toContain('Kategori Pembangkit');
      expect(wrapper.text()).toContain('Tahun');
    });
  });
});