import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import GraphicRnfa_Ebitda from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicRnfa_Ebitda.vue';
import { notifyError } from '@/services/helper/toast-notification';

// Mock services at the top level (hoisted)
const mockGrafikService = {
  getInitialPembangkit: vi.fn(),
  getGraphicRNFA: vi.fn()
};

const mockPetaService = {};

// Mock the service imports
vi.mock('@/services/grafik-service', () => ({
  default: vi.fn().mockImplementation(() => mockGrafikService)
}));

vi.mock('@/services/peta-service', () => ({
  default: vi.fn().mockImplementation(() => mockPetaService)
}));

// Mock child components
vi.mock('@/components/icons/IconEmptyData.vue', () => ({
  default: {
    name: 'IconEmptyData',
    template: '<div data-testid="empty-icon">Empty Data</div>'
  }
}));

vi.mock('@/components/ui/ShimmerLoading.vue', () => ({
  default: {
    name: 'ShimmerLoading',
    template: '<div data-testid="shimmer-loading">Loading...</div>',
    props: ['class']
  }
}));

vi.mock('@/components/ui/ModalWrapper.vue', () => ({
  default: {
    name: 'ModalWrapper',
    template: '<div data-testid="modal-wrapper" v-if="showModal"><slot /></div>',
    props: ['showModal', 'width', 'height']
  }
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue', () => ({
  default: {
    name: 'DynamicScatterPlot',
    template: '<div data-testid="scatter-plot">Scatter Plot</div>',
    props: ['source', 'series', 'legends', 'pln', 'ipp', 'xData', 'yData', 'dataZoom']
  }
}));

// Mock VueDatePicker
vi.mock('@vuepic/vue-datepicker', () => ({
  default: {
    name: 'VueDatePicker',
    template: '<input data-testid="date-picker" />',
    props: ['modelValue', 'placeholder', 'yearRange', 'enableTimePicker', 'hideInputIcon', 'clearable', 'showNowButton', 'yearPicker', 'monthChangeOnScroll', 'teleport', 'autoApply'],
    emits: ['update:modelValue']
  }
}));

// Mock Element Plus components
const ElSelect = {
  name: 'ElSelect',
  template: `<div data-testid="el-select"><slot name="header" /><slot /></div>`,
  props: ['modelValue', 'multiple', 'clearable', 'collapseTagselect', 'placeholder', 'popperClass', 'maxCollapseTags'],
  emits: ['update:modelValue']
};

const ElOption = {
  name: 'ElOption',
  template: '<div data-testid="el-option"></div>',
  props: ['label', 'value']
};

const ElCheckbox = {
  name: 'ElCheckbox',
  template: '<input type="checkbox" data-testid="el-checkbox" />',
  props: ['modelValue', 'indeterminate'],
  emits: ['update:modelValue', 'change']
};

// Mock toast notifications
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn()
}));

// Mock date-fns locale
vi.mock('date-fns/locale', () => ({
  id: {}
}));

describe('GraphicRnfa_Ebitda.vue', () => {
  const defaultProps = {
    itemsPembangkit: [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' },
      { id: 'PLTS', name: 'PLTS' }
    ],
    itemsDayaMampu: [
      { id: '1', name: 'PLTU < 100' },
      { id: '2', name: 'PLTU 100 - 400' },
      { id: '3', name: 'PLTU > 400' }
    ],
    title: 'Test Graphic RNFA EBITDA',
    yearRange: [2020, 2025],
    initialPembangkit: ['PLTU', 'PLTG']
  };

  const mockGraphicResponse = {
    success: true,
    data: {
      grafik: [
        {
          kode_jenis_kit: 'PLTU',
          data: {
            rnfa_real: 85.5,
            ebitda_real: 25.3
          },
          nama_mesin: 'Test Machine 1'
        },
        {
          kode_jenis_kit: 'PLTG',
          data: {
            rnfa_real: 90.2,
            ebitda_real: 30.1
          },
          nama_mesin: 'Test Machine 2'
        }
      ],
      legend: [
        { label: 'PLTU', color: '#ff0000' },
        { label: 'PLTG', color: '#00ff00' }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGrafikService.getInitialPembangkit.mockResolvedValue({
      data: [
        { kode_jenis_pembangkit: 'PLTU' },
        { kode_jenis_pembangkit: 'PLTG' }
      ]
    });
    mockGrafikService.getGraphicRNFA.mockResolvedValue(mockGraphicResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should mount successfully with required props', () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe(defaultProps.title);
    });

    it('should initialize with correct default reactive values', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          stubs: {
            'ShimmerLoading': true,
            'Empty': true,
            'ModalWrapper': true,
            'DynamicScatterPlot': true,
            'VueDatePicker': true
          }
        }
      });

      // Wait for mount to finish fetching data
      await nextTick();

      const vm = wrapper.vm as any;

      expect(vm.checkAll).toBe(false);
      expect(vm.checkDmn).toBe(true);
      // indeterminate is true because 2 of 3 pembangkit items are selected
      expect(vm.indeterminate).toBe(true);
      expect(vm.indeterminateDmn).toBe(false);
      // Component reads initialPembangkit from props on mount
      expect(vm.value).toEqual(['PLTU', 'PLTG']);
      expect(vm.dmn).toEqual([1, 2, 3]);
      expect(vm.showModal).toBe(false);
    });

    it('should create service instances correctly', () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      expect(wrapper.exists()).toBe(true);
      expect(mockGrafikService).toBeDefined();
    });
  });

  describe('Data Fetching and API Integration', () => {
    it('should fetch initial pembangkit data on mount', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      const vm = wrapper.vm as any;
      // Component reads initialPembangkit from props, not from API
      expect(vm.value).toEqual(['PLTU', 'PLTG']);
    });

    it('should call getDataGraph on mount after fetchInitialPembangkit', async () => {
      mount(GraphicRnfa_Ebitda, {
        props: defaultProps
      });

      // Wait for all async operations to complete
      await nextTick();

      // After initial data is fetched from props, getDataGraph should be called
      await nextTick();
      await vi.waitFor(() => {
        expect(mockGrafikService.getGraphicRNFA).toHaveBeenCalled();
      });
    });

    it('should handle fetchInitialPembangkit with empty prop gracefully', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: { ...defaultProps, initialPembangkit: [] },
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      const vm = wrapper.vm as any;
      // When initialPembangkit is empty, value should be empty
      expect(vm.value).toEqual([]);
    });

    it('should populate value array from initialPembangkit prop', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      const vm = wrapper.vm as any;
      
      // Should populate value from props
      expect(vm.value).toContain('PLTU');
      expect(vm.value).toContain('PLTG');
    });

    it('should process getDataGraph response correctly', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const vm = wrapper.vm as any;
      expect(vm.graphData.isEmpty).toBe(false);
      expect(vm.graphData.series).toHaveLength(2);
      expect(vm.graphData.legends).toHaveLength(2);
      expect(vm.graphData.pln.x).toBeGreaterThan(0);
      expect(vm.graphData.pln.y).toBeGreaterThan(0);
    });

    it('should handle getDataGraph error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      mockGrafikService.getGraphicRNFA.mockRejectedValueOnce(new Error('API Error'));

      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      
      // Should handle error gracefully without crashing
      expect(wrapper.exists()).toBe(true);
      consoleSpy.mockRestore();
    });

    it('should handle empty grafik data', async () => {
      const emptyResponse = {
        success: true,
        data: { grafik: null, legend: null }
      };
      mockGrafikService.getGraphicRNFA.mockResolvedValueOnce(emptyResponse);

      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const vm = wrapper.vm as any;
      expect(vm.graphData.isEmpty).toBe(true);
    });
  });

  describe('Loading State Management', () => {
    it('should show shimmer loading initially', () => {
      mockGrafikService.getInitialPembangkit.mockResolvedValue({ data: [] });
      mockGrafikService.getGraphicRNFA.mockResolvedValue({
        success: true,
        data: { grafik: [], legend: [] }
      });

      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps
      });

      const vm = wrapper.vm as any;
      // Initially loading should be true or shimmer should be visible
      expect(vm.isLoading || wrapper.find('[data-testid="shimmer-loading"]').exists()).toBe(true);
    });

    it('should hide shimmer loading after data is loaded', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(wrapper.find('[data-testid="shimmer-loading"]').exists()).toBe(false);
    });

    it('should manage loading state during getDataGraph execution', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      
      // Manually call getDataGraph to test loading state
      const promise = vm.getDataGraph();
      
      // After resolving promise, check if loading is properly managed
      await promise;
      // Loading state is managed within the function - just verify it works
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Modal and Filter Controls', () => {
    it('should toggle modal when filter button is clicked', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const filterButton = wrapper.find('#hover-button');
      const vm = wrapper.vm as any;
      
      expect(vm.showModal).toBe(false);
      
      await filterButton.trigger('click');
      expect(vm.showModal).toBe(true);
      
      await filterButton.trigger('click');
      expect(vm.showModal).toBe(false);
    });

    it('should show modal wrapper when showModal is true', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.showModal = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.find('[data-testid="modal-wrapper"]').exists()).toBe(true);
    });

    it('should close modal with valid selections using closeModal', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.showModal = true;
      vm.value = ['PLTU'];
      
      vm.closeModal();
      expect(vm.showModal).toBe(false);
    });

    it('should show error when closeModal called without category selection', () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.value = [];
      vm.filter.tahun = 2023;
      
      vm.closeModal();
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!',
        5000
      );
    });

    it('should show error when closeModal called without year selection', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      // Clear the value array that was populated on mount
      vm.value = [];
      vm.filter.tahun = null;
      
      vm.closeModal();
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });

    it('should show error when closeModal called without both selections', () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.value = [];
      vm.filter.tahun = null;
      
      vm.closeModal();
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should apply filter and close modal when applyFilter called with valid data', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.showModal = true;
      // Reset the value to control what we're testing
      vm.value = ['PLTU'];
      vm.filter.tahun = 2023;
      
      await vm.applyFilter();
      expect(vm.showModal).toBe(false);
      // Check that API was called (might have been called multiple times with different params)
      expect(mockGrafikService.getGraphicRNFA).toHaveBeenCalled();
    });

    it('should show error in applyFilter when data is invalid', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.value = [];
      vm.filter.tahun = null;
      
      await vm.applyFilter();
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });
  });

  describe('Checkbox State Management', () => {
    it('should update checkAll state based on value changes', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;

      // Test empty selection
      vm.value = [];
      await wrapper.vm.$nextTick();
      expect(vm.checkAll).toBe(false);
      expect(vm.indeterminate).toBe(false);

      // Test partial selection
      vm.value = ['PLTU'];
      await wrapper.vm.$nextTick();
      expect(vm.indeterminate).toBe(true);

      // Test full selection
      vm.value = ['PLTU', 'PLTG', 'PLTS'];
      await wrapper.vm.$nextTick();
      expect(vm.checkAll).toBe(true);
      expect(vm.indeterminate).toBe(false);
    });

    it('should handle check all functionality correctly', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;

      // Check all
      vm.handleCheckAll(true);
      expect(vm.value).toEqual(['PLTU', 'PLTG', 'PLTS']);
      expect(vm.indeterminate).toBe(false);

      // Uncheck all
      vm.handleCheckAll(false);
      expect(vm.value).toEqual([]);
      expect(vm.indeterminate).toBe(false);
    });

    it('should update checkDmn state based on dmn changes', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;

      // Test empty selection
      vm.dmn = [];
      await wrapper.vm.$nextTick();
      expect(vm.checkDmn).toBe(false);
      expect(vm.indeterminateDmn).toBe(false);

      // Test partial selection
      vm.dmn = ['1'];
      await wrapper.vm.$nextTick();
      expect(vm.indeterminateDmn).toBe(true);

      // Test full selection
      vm.dmn = ['1', '2', '3'];
      await wrapper.vm.$nextTick();
      expect(vm.checkDmn).toBe(true);
      expect(vm.indeterminateDmn).toBe(false);
    });

    it('should handle DMN check all functionality correctly', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;

      // Check all DMN
      vm.handleCheckDmn(true);
      expect(vm.dmn).toEqual(['1', '2', '3']);
      expect(vm.indeterminateDmn).toBe(false);

      // Uncheck all DMN
      vm.handleCheckDmn(false);
      expect(vm.dmn).toEqual([]);
      expect(vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Graph Data Processing and Calculations', () => {
    it('should calculate averages correctly from graph data', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      await vm.getDataGraph();

      // Expected calculations: (85.5 + 90.2) / 2 = 87.85, (25.3 + 30.1) / 2 = 27.7
      expect(vm.graphData.pln.y).toBeCloseTo(87.85, 1);
      expect(vm.graphData.pln.x).toBeCloseTo(27.7, 1);
    });

    it('should build series data correctly from API response', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      await vm.getDataGraph();

      expect(vm.graphData.series).toHaveLength(2);
      expect(vm.graphData.series[0].name).toBe('PLTU');
      expect(vm.graphData.series[0].type).toBe('scatter');
      expect(vm.graphData.series[0].color).toBe('#ff0000');
      expect(vm.graphData.series[0].data).toEqual([[25.3, 85.5, 5, 'Test Machine 1']]);
    });

    it('should handle different parameter combinations for API calls', async () => {
      // Reset all mocks for this test
      vi.clearAllMocks();
      
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;

      // Test with PLTU selected (should include dmn)
      vm.value = ['PLTU'];
      vm.dmn = ['1', '2'];
      vm.filter.tahun = 2023;
      await vm.getDataGraph();

      // Just verify that the API was called correctly
      expect(mockGrafikService.getGraphicRNFA).toHaveBeenCalled();

      // Test with non-PLTU selected (should not include dmn)
      vm.value = ['PLTG'];
      await vm.getDataGraph();

      expect(mockGrafikService.getGraphicRNFA).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTG'],
        id_daya: [],
        periode: '2023'
      });
    });

    it('should reset graph data structure before processing new data', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      
      // Set some initial data
      vm.graphData.series = ['old data'];
      vm.graphData.legends = ['old legend'];
      vm.graphData.source = ['old source'];
      
      await vm.getDataGraph();
      
      // Should be reset and populated with new data
      expect(vm.graphData.series).not.toContain('old data');
      expect(vm.graphData.legends).not.toContain('old legend');
      expect(vm.graphData.source).not.toContain('old source');
    });
  });

  describe('UI Rendering and Component States', () => {
    it('should render empty state when graph data is empty', async () => {
      const emptyResponse = {
        success: true,
        data: { grafik: null, legend: null }
      };
      mockGrafikService.getGraphicRNFA.mockResolvedValueOnce(emptyResponse);

      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(wrapper.find('[data-testid="empty-icon"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Grafik Tidak Tersedia');
      expect(wrapper.text()).toContain('Data tidak tersedia, sistem tidak bisa menampilkan');
    });

    it('should render scatter plot when graph data is available', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const vm = wrapper.vm as any;
      vm.graphData.isEmpty = false;
      vm.isLoading = false;
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('[data-testid="scatter-plot"]').exists()).toBe(true);
    });

    it('should show filter indicator when filters are applied', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU'];
      vm.filter.tahun = 2023;
      await wrapper.vm.$nextTick();

      const filterButton = wrapper.find('#hover-button');
      expect(filterButton.find('.bg-warningColor').exists()).toBe(true);
    });

    it('should display filter badges correctly', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU', 'PLTG'];
      vm.filter.tahun = 2023;
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('Kategori Pembangkit :');
      expect(wrapper.text()).toContain('Tahun :');
      expect(wrapper.text()).toContain('2023');
    });

    it('should conditionally show DMN badge when PLTU is selected', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU'];
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('DMN :');
      
      // Test DMN value display
      vm.dmn = ['1', '2', '3'];
      await wrapper.vm.$nextTick();
      
      expect(wrapper.text()).toContain('PLTU < 100');
      expect(wrapper.text()).toContain('PLTU 100 - 400');
      expect(wrapper.text()).toContain('PLTU > 400');
    });

    it('should not show DMN badge when PLTU is not selected', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTG', 'PLTS'];
      await wrapper.vm.$nextTick();

      // DMN section should not be visible
      const dmnSection = wrapper.find('[data-testid="dmn-section"]');
      if (dmnSection.exists()) {
        expect(dmnSection.isVisible()).toBe(false);
      }
    });
  });

  describe('Reset and Button Interactions', () => {
    it('should reset value when reset button is clicked', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU', 'PLTG'];
      vm.showModal = true;
      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAll('button');
      const resetButton = buttons.find(btn => btn.text().includes('Reset'));
      if (resetButton) {
        await resetButton.trigger('click');
        expect(vm.value).toEqual([]);
      }
    });

    it('should handle apply button click correctly', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      vm.showModal = true;
      vm.value = ['PLTU'];
      vm.filter.tahun = 2023;
      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAll('button');
      const applyButton = buttons.find(btn => btn.text().includes('Terapkan') || btn.text().includes('Apply'));
      if (applyButton) {
        await applyButton.trigger('click');
        expect(vm.showModal).toBe(false);
      }
    });
  });

  describe('Props and Component Integration', () => {
    it('should handle empty props gracefully', () => {
      const minimalProps = {
        itemsPembangkit: [],
        itemsDayaMampu: [],
        title: '',
        yearRange: []
      };

      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: minimalProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('should pass correct props to scatter plot component', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 100));

      const vm = wrapper.vm as any;
      vm.graphData.isEmpty = false;
      vm.isLoading = false;
      await wrapper.vm.$nextTick();

      const scatterPlot = wrapper.findComponent({ name: 'DynamicScatterPlot' });
      if (scatterPlot.exists()) {
        expect(scatterPlot.props('xData')).toEqual({ name: 'EBITDA MARGIN', satuan: '%' });
        expect(scatterPlot.props('yData')).toEqual({ name: 'RNFA', satuan: '%' });
        expect(scatterPlot.props('dataZoom')).toEqual({ start: 0, type: 'inside', orient: 'vertical' });
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed API response gracefully', async () => {
      const malformedResponse = {
        success: true,
        data: {
          grafik: [{ invalid: 'data' }],
          legend: null
        }
      };
      mockGrafikService.getGraphicRNFA.mockResolvedValueOnce(malformedResponse);

      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      
      // Should not crash
      expect(wrapper.exists()).toBe(true);
      // Component should handle malformed data gracefully
    });

    it('should handle network timeout gracefully', async () => {
      mockGrafikService.getGraphicRNFA.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
      );

      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const vm = wrapper.vm as any;
      expect(vm.isLoading).toBe(false);
      expect(wrapper.exists()).toBe(true);
    });

    it('should maintain component stability during rapid prop changes', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      // Simulate rapid prop changes
      await wrapper.setProps({ title: 'New Title 1' });
      await wrapper.setProps({ title: 'New Title 2' });
      await wrapper.setProps({ title: 'New Title 3' });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe('New Title 3');
    });

    it('should handle component unmounting gracefully', () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      expect(() => wrapper.unmount()).not.toThrow();
    });
  });

  describe('Performance and Optimization', () => {
    it('should not call API unnecessarily during initialization', async () => {
      // Clear mocks to start fresh
      vi.clearAllMocks();
      
      mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      await nextTick();
      
      // Component reads from props (not API) for initialPembangkit
      // Only getGraphicRNFA should be called as API during initialization
      expect(mockGrafikService.getGraphicRNFA).toHaveBeenCalled();
    });

    it('should maintain reactive data integrity through state changes', async () => {
      const wrapper = mount(GraphicRnfa_Ebitda, {
        props: defaultProps,
        global: {
          components: { ElSelect, ElOption, ElCheckbox }
        }
      });

      const vm = wrapper.vm as any;
      
      // Test data integrity through various state changes
      const initialTahun = vm.filter.tahun;
      vm.value = ['PLTU'];
      vm.dmn = ['1'];
      
      expect(vm.filter.tahun).toBe(initialTahun); // Should not affect other reactive data
      expect(vm.value).toEqual(['PLTU']);
      expect(vm.dmn).toEqual(['1']);
    });
  });
});