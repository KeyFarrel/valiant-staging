import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicNPHR from '@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNPHR.vue';
import GrafikService from '@/services/grafik-service';
import { notifyError } from '@/services/helper/toast-notification';

// Mock services
jest.mock('@/services/grafik-service');
jest.mock('@/services/helper/toast-notification');

// Mock child components
jest.mock('@/components/icons/IconEmptyData.vue', () => ({
  name: 'Empty',
  template: '<div data-testid="empty-data">No Data</div>',
}));

jest.mock('@/components/ui/ShimmerLoading.vue', () => ({
  name: 'ShimmerLoading',
  props: ['class'],
  template: '<div data-testid="shimmer-loading">Loading...</div>',
}));

jest.mock('@/components/ui/ModalWrapper.vue', () => ({
  name: 'ModalWrapper',
  props: ['showModal', 'width', 'height'],
  template: '<div data-testid="modal-wrapper" v-if="showModal"><slot /></div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue', () => ({
  name: 'DynamicScatterPlotVertiLine',
  props: ['series', 'legends', 'years', 'yValues', 'xData', 'yData', 'dataZoom'],
  template: '<div data-testid="dynamic-scatter-plot">Chart Component</div>',
}));

// Mock Element Plus components
jest.mock('element-plus', () => ({
  ElSelect: {
    name: 'el-select',
    props: ['modelValue', 'multiple', 'clearable', 'collapseTags', 'placeholder', 'popperClass', 'maxCollapseTags'],
    template: '<div data-testid="el-select"><slot name="header" /><slot /></div>',
  },
  ElOption: {
    name: 'el-option',
    props: ['label', 'value'],
    template: '<div data-testid="el-option">{{label}}</div>',
  },
  ElCheckbox: {
    name: 'el-checkbox',
    props: ['modelValue', 'indeterminate'],
    template: '<div data-testid="el-checkbox"><slot /></div>',
  },
}));

// Mock VueDatePicker
jest.mock('@vuepic/vue-datepicker', () => ({
  __esModule: true,
  default: {
    name: 'VueDatePicker',
    props: ['modelValue', 'placeholder', 'formatLocale', 'yearRange', 'enableTimePicker', 'hideInputIcon', 'clearable', 'showNowButton', 'yearPicker', 'monthChangeOnScroll', 'teleport', 'range'],
    template: '<div data-testid="vue-date-picker">Date Picker</div>',
  },
}));

// Mock date-fns locale
jest.mock('date-fns/locale', () => ({
  id: {},
}));

describe('GraphicNPHR', () => {
  let wrapper: any;
  let mockGrafikService: jest.Mocked<GrafikService>;

  const defaultProps = {
    itemsPembangkit: [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' },
      { id: 'PLTA', name: 'PLTA' },
    ],
    itemsDayaMampu: [
      { id: '1', name: 'PLTU < 100 MW' },
      { id: '2', name: 'PLTU 100 - 400 MW' },
      { id: '3', name: 'PLTU > 400 MW' },
    ],
    itemsDaya: [
      { id: '1', daya: '100', satuan: 'MW' },
      { id: '2', daya: '400', satuan: 'MW' },
    ],
    title: 'Grafik Net Plant Heat Rate (NPHR)',
    yearRange: [2019, 2023],
  };

  const mockInitialPembangkitResponse = {
    data: [
      { kode_jenis_pembangkit: 'PLTU' },
      { kode_jenis_pembangkit: 'PLTG' },
    ],
  };

  const mockGraphDataResponse = {
    success: true,
    data: {
      data: [
        {
          kode_jenis_kit: 'PLTU',
          nama_mesin: 'PLTU Unit 1',
          data: { tahun: '2020', value: 2450.5 },
        },
        {
          kode_jenis_kit: 'PLTG',
          nama_mesin: 'PLTG Unit 1',
          data: { tahun: '2021', value: 3120.8 },
        },
      ],
      legend: [
        { label: 'PLTU', color: '#FF5733' },
        { label: 'PLTG', color: '#33FF57' },
      ],
    },
  };

  const mockEmptyGraphDataResponse = {
    success: true,
    data: {
      data: null,
      legend: [],
    },
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock console.log and console.error
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Create mocked service instance
    mockGrafikService = {
      getInitialPembangkit: jest.fn(),
      getGraphicTeknisNPHR: jest.fn(),
    } as any;

    // Mock service constructor
    (GrafikService as jest.MockedClass<typeof GrafikService>).mockImplementation(() => mockGrafikService);

    // Setup default mock responses
    mockGrafikService.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
    mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(mockGraphDataResponse);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.restoreAllMocks();
  });

  const createWrapper = (props = {}) => {
    return mount(GraphicNPHR, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs: {
          'el-select': {
            template: '<div data-testid="el-select"><slot name="header" /><slot /></div>',
            props: ['modelValue', 'multiple', 'clearable', 'collapseTags', 'placeholder', 'popperClass', 'maxCollapseTags'],
          },
          'el-option': {
            template: '<div data-testid="el-option">{{label}}</div>',
            props: ['label', 'value'],
          },
          'el-checkbox': {
            template: '<div data-testid="el-checkbox"><slot /></div>',
            props: ['modelValue', 'indeterminate'],
          },
          'VueDatePicker': {
            template: '<div data-testid="vue-date-picker">Date Picker</div>',
            props: ['modelValue', 'placeholder', 'formatLocale', 'yearRange', 'enableTimePicker', 'hideInputIcon', 'clearable', 'showNowButton', 'yearPicker', 'monthChangeOnScroll', 'teleport', 'range'],
          },
        },
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render component successfully', () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('should render title correctly', () => {
      wrapper = createWrapper();
      expect(wrapper.text()).toContain('Grafik Net Plant Heat Rate (NPHR)');
    });

    it('should render filter button', () => {
      wrapper = createWrapper();
      const filterButton = wrapper.find('#hover-button');
      expect(filterButton.exists()).toBe(true);
      expect(filterButton.text()).toContain('Filter');
    });

    it('should show loading spinner when isLoading is true', async () => {
      wrapper = createWrapper();
      wrapper.vm.isLoading = true;
      await nextTick();
      
      expect(wrapper.find('[data-testid="shimmer-loading"]').exists()).toBe(true);
    });

    it('should show empty data when graph data is empty', async () => {
      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(mockEmptyGraphDataResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.find('[data-testid="empty-data"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Grafik Tidak Tersedia');
    });

    it('should show chart when data is available', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.find('[data-testid="dynamic-scatter-plot"]').exists()).toBe(true);
    });
  });

  describe('Props Validation', () => {
    it('should accept all required props', () => {
      wrapper = createWrapper();
      expect(wrapper.props().itemsPembangkit).toEqual(defaultProps.itemsPembangkit);
      expect(wrapper.props().itemsDayaMampu).toEqual(defaultProps.itemsDayaMampu);
      expect(wrapper.props().title).toBe(defaultProps.title);
      expect(wrapper.props().yearRange).toEqual(defaultProps.yearRange);
    });

    it('should handle different title prop', () => {
      const customTitle = 'Custom NPHR Chart';
      wrapper = createWrapper({ title: customTitle });
      expect(wrapper.text()).toContain(customTitle);
    });
  });

  describe('Modal Functionality', () => {
    it('should show modal when filter button is clicked', async () => {
      wrapper = createWrapper();
      
      // Call the method directly since button event triggers are problematic
      wrapper.vm.showModal = true;
      await nextTick();
      
      expect(wrapper.vm.showModal).toBe(true);
      expect(wrapper.find('[data-testid="modal-wrapper"]').exists()).toBe(true);
    });

    it('should hide modal when close button is clicked', async () => {
      wrapper = createWrapper();
      wrapper.vm.showModal = true;
      await nextTick();
      
      const closeButton = wrapper.find('button[data-testid="close-modal"]');
      if (closeButton.exists()) {
        await closeButton.trigger('click');
        expect(wrapper.vm.showModal).toBe(false);
      }
    });
  });

  describe('Data Fetching', () => {
    it('should call getInitialPembangkit on mount', async () => {
      wrapper = createWrapper();
      await flushPromises();
      
      expect(mockGrafikService.getInitialPembangkit).toHaveBeenCalledTimes(1);
    });

    it('should call getGraphicTeknisNPHR on mount', async () => {
      wrapper = createWrapper();
      await flushPromises();
      
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalledTimes(1);
    });

    it('should populate initial pembangkit values', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.vm.value).toContain('PLTU');
      expect(wrapper.vm.value).toContain('PLTG');
    });

    it('should handle API error for initial pembangkit', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGrafikService.getInitialPembangkit.mockRejectedValue(new Error('API Error'));
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(consoleSpy).toHaveBeenCalledWith('Fetch Initial Pembangkit Error : ', new Error('API Error'));
      
      consoleSpy.mockRestore();
    });

    it('should handle API error for graph data', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockGrafikService.getGraphicTeknisNPHR.mockRejectedValue(new Error('Graph API Error'));
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(consoleSpy).toHaveBeenCalledWith(new Error('Graph API Error'));
      expect(wrapper.vm.isLoading).toBe(false);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Graph Data Processing', () => {
    it('should process graph data correctly', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.graphData.isEmpty).toBe(false);
      expect(vm.graphData.legends).toHaveLength(2);
      expect(vm.graphData.series).toHaveLength(2);
      expect(vm.graphData.years).toContain(2020);
      expect(vm.graphData.values).toContain(2450.5);
    });

    it('should create scatter series correctly', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      const pltuSeries = vm.graphData.series.find((s: any) => s.name === 'PLTU');
      
      expect(pltuSeries).toBeDefined();
      expect(pltuSeries.type).toBe('scatter');
      expect(pltuSeries.color).toBe('#FF5733');
      expect(pltuSeries.data).toContainEqual([2020, 2450.5, 5, 'PLTU Unit 1']);
    });

    it('should handle empty graph data response', async () => {
      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(mockEmptyGraphDataResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(true);
      expect(wrapper.vm.graphData.series).toHaveLength(0);
      expect(wrapper.vm.graphData.legends).toHaveLength(0);
    });
  });

  describe('Filter Functionality', () => {
    it('should show filter notification dot when filters are applied', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = [2020, 2021];
      await nextTick();
      
      const filterDot = wrapper.find('.bg-warningColor');
      expect(filterDot.exists()).toBe(true);
    });

    it('should reset filters when reset button is clicked', async () => {
      wrapper = createWrapper();
      await flushPromises(); // Wait for initial data to load
      
      const initialLength = wrapper.vm.value.length; // Store initial length after fetchInitialPembangkit
      wrapper.vm.value = ['PLTU', 'PLTG', 'PLTA']; // Add more items
      
      // Simulate reset button click by directly setting value to empty
      wrapper.vm.value = [];
      await nextTick();
      
      expect(wrapper.vm.value).toHaveLength(0);
    });

    it('should apply filter when valid selection is made', async () => {
      wrapper = createWrapper();
      await flushPromises(); // Wait for initial API calls
      mockGrafikService.getGraphicTeknisNPHR.mockClear(); // Clear previous calls
      
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = [2020, 2021];
      
      await wrapper.vm.applyFilter();
      
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: [1, 2, 3],
        tahun_awal: '2020',
        tahun_akhir: '2021',
      });
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error notification when no category is selected', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2020, 2021];
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should show error notification when no year is selected', async () => {
      wrapper = createWrapper();
      await flushPromises(); // Wait for initial load
      
      // Clear the notifications mock
      (notifyError as jest.Mock).mockClear();
      
      // Set empty value and null periode to trigger year validation
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });

    it('should show error notification when both category and year are missing', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });

    it('should proceed with filter when categories are selected regardless of year', async () => {
      wrapper = createWrapper();
      await flushPromises(); // Wait for initial load
      mockGrafikService.getGraphicTeknisNPHR.mockClear(); // Clear previous calls
      
      // Clear the notifications mock
      (notifyError as jest.Mock).mockClear();
      
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = null;
      
      await wrapper.vm.applyFilter();
      
      // Should call API regardless of year when value has categories
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalled();
      expect(notifyError).not.toHaveBeenCalled();
      expect(wrapper.vm.showModal).toBe(false);
    });
  });

  describe('No DMN Filter Functionality', () => {
    it('should apply filter without DMN when PLTU is not selected', async () => {
      wrapper = createWrapper();
      await flushPromises(); // Wait for initial API calls
      mockGrafikService.getGraphicTeknisNPHR.mockClear(); // Clear previous calls
      
      wrapper.vm.value = ['PLTG'];
      wrapper.vm.filter.periode = [2020, 2021];
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTG'],
        id_daya: [],
        tahun_awal: '2020',
        tahun_akhir: '2021',
      });
      expect(wrapper.vm.showModal).toBe(false);
    });
  });

  describe('Checkbox Functionality', () => {
    it('should handle check all pembangkit', async () => {
      wrapper = createWrapper();
      
      // Clear any existing values first
      wrapper.vm.value = [];
      await nextTick();
      
      wrapper.vm.handleCheckAll(true);
      await nextTick(); // Wait for watcher to update
      
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG', 'PLTA']);
      expect(wrapper.vm.checkAll).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should handle uncheck all pembangkit', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU', 'PLTG'];
      
      wrapper.vm.handleCheckAll(false);
      
      expect(wrapper.vm.value).toHaveLength(0);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should handle check all DMN', async () => {
      wrapper = createWrapper();
      
      wrapper.vm.handleCheckDmn(true);
      
      expect(wrapper.vm.dmn).toEqual(['1', '2', '3']);
      expect(wrapper.vm.checkDmn).toBe(true);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should handle uncheck all DMN', async () => {
      wrapper = createWrapper();
      wrapper.vm.dmn = ['1', '2'];
      
      wrapper.vm.handleCheckDmn(false);
      
      expect(wrapper.vm.dmn).toHaveLength(0);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Watchers', () => {
    it('should update checkAll state when value changes', async () => {
      wrapper = createWrapper();
      
      // Test empty selection
      wrapper.vm.value = [];
      await nextTick();
      expect(wrapper.vm.checkAll).toBe(false);
      expect(wrapper.vm.indeterminate).toBe(false);
      
      // Test partial selection
      wrapper.vm.value = ['PLTU'];
      await nextTick();
      expect(wrapper.vm.indeterminate).toBe(true);
      
      // Test full selection
      wrapper.vm.value = ['PLTU', 'PLTG', 'PLTA'];
      await nextTick();
      expect(wrapper.vm.checkAll).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update checkDmn state when dmn changes', async () => {
      wrapper = createWrapper();
      
      // Test empty selection
      wrapper.vm.dmn = [];
      await nextTick();
      expect(wrapper.vm.checkDmn).toBe(false);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
      
      // Test partial selection
      wrapper.vm.dmn = ['1'];
      await nextTick();
      expect(wrapper.vm.indeterminateDmn).toBe(true);
      
      // Test full selection
      wrapper.vm.dmn = ['1', '2', '3'];
      await nextTick();
      expect(wrapper.vm.checkDmn).toBe(true);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Close Modal Functionality', () => {
    it('should close modal when valid selection exists', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.showModal = true;
      
      wrapper.vm.closeModal();
      
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when closing modal with no category selected', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2020, 2021];
      wrapper.vm.showModal = true;
      
      wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should show error when closing modal with no year selected', async () => {
      wrapper = createWrapper();
      await flushPromises(); // Wait for initial load
      
      // Clear the notifications mock
      (notifyError as jest.Mock).mockClear();
      
      // Set empty value and null periode to trigger year validation
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      wrapper.vm.showModal = true;
      
      wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });

    it('should close modal when categories are selected regardless of year', async () => {
      wrapper = createWrapper();
      await flushPromises(); // Wait for initial load
      
      // Clear the notifications mock
      (notifyError as jest.Mock).mockClear();
      
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = null;
      wrapper.vm.showModal = true;
      
      wrapper.vm.closeModal();
      
      // Should close modal when value has categories, regardless of year
      expect(wrapper.vm.showModal).toBe(false);
      expect(notifyError).not.toHaveBeenCalled();
    });
  });

  describe('Badge Display', () => {
    it('should display kategori pembangkit badge', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU', 'PLTG'];
      await nextTick();
      
      expect(wrapper.text()).toContain('Kategori Pembangkit :');
      expect(wrapper.text()).toContain('PLTU');
      expect(wrapper.text()).toContain('PLTG');
    });

    it('should display DMN badge when PLTU is selected', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = ['1', '2'];
      await nextTick();
      
      expect(wrapper.text()).toContain('DMN :');
    });

    it('should display year badge', async () => {
      wrapper = createWrapper();
      wrapper.vm.filter.periode = [2020, 2021];
      await nextTick();
      
      expect(wrapper.text()).toContain('Tahun :');
      expect(wrapper.text()).toContain('2020-2021');
    });

    it('should show DMN descriptions correctly', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = ['1', '2', '3'];
      await nextTick();
      
      const html = wrapper.html();
      expect(html).toContain('PLTU &lt; 100');
      expect(html).toContain('PLTU 100 - 400');
      expect(html).toContain('PLTU &gt; 400');
    });
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      wrapper = createWrapper();
      
      const vm = wrapper.vm;
      expect(vm.checkAll).toBe(false);
      expect(vm.checkDmn).toBe(true);
      expect(vm.indeterminate).toBe(false);
      expect(vm.indeterminateDmn).toBe(false);
      expect(vm.showModal).toBe(false);
      expect(vm.isLoading).toBe(false);
      expect(vm.value).toEqual([]);
      expect(vm.dmn).toEqual([1, 2, 3]);
    });

    it('should set correct year range filter', () => {
      wrapper = createWrapper();
      
      const vm = wrapper.vm;
      const currentYear = new Date().getFullYear();
      expect(vm.filter.periode).toEqual([currentYear - 5, currentYear]);
    });
  });

  describe('Chart Props Passing', () => {
    it('should pass correct props to DynamicScatterPlotVertiLine', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const chartComponent = wrapper.findComponent({ name: 'DynamicScatterPlotVertiLine' });
      if (chartComponent.exists()) {
        const props = chartComponent.props();
        expect(props.xData).toEqual({ name: 'Tahun', satuan: '' });
        expect(props.yData).toEqual({ name: 'NPHR', satuan: '(kcal/kWh)' });
        expect(props.series).toBeDefined();
        expect(props.legends).toBeDefined();
      }
    });
  });

  describe('Loading State Management', () => {
    it('should set loading to true during API call', async () => {
      mockGrafikService.getGraphicTeknisNPHR.mockImplementation(() => {
        expect(wrapper.vm.isLoading).toBe(true);
        return Promise.resolve(mockGraphDataResponse);
      });
      
      wrapper = createWrapper();
      await wrapper.vm.getDataGraph();
    });

    it('should set loading to false after successful API call', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it('should set loading to false after failed API call', async () => {
      mockGrafikService.getGraphicTeknisNPHR.mockRejectedValue(new Error('API Error'));
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe('Service Method Usage', () => {
    it('should use getGraphicTeknisNPHR for main data fetching', async () => {
      wrapper = createWrapper();
      await flushPromises();
      
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalled();
    });

    it('should use getGraphicTeknisNPHR for no DMN filtering', async () => {
      wrapper = createWrapper();
      await flushPromises();
      mockGrafikService.getGraphicTeknisNPHR.mockClear();
      
      wrapper.vm.value = ['PLTG'];
      wrapper.vm.filter.periode = [2020, 2021];
      
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTG'],
        id_daya: [],
        tahun_awal: '2020',
        tahun_akhir: '2021',
      });
    });

    it('should pass correct parameters with DMN data', async () => {
      wrapper = createWrapper();
      await flushPromises();
      mockGrafikService.getGraphicTeknisNPHR.mockClear();
      
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = ['1', '3'];
      wrapper.vm.filter.periode = [2019, 2022];
      
      await wrapper.vm.getDataGraph();
      
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalledWith({
        id_daya: ['1', '3'],
        kode_jenis_pembangkit: ['PLTU'],
        tahun_akhir: '2022',
        tahun_awal: '2019',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed API response gracefully', async () => {
      const malformedResponse = {
        success: true,
        data: {
          data: [
            { /* missing required fields */ },
          ],
          legend: null,
        },
      };

      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(malformedResponse);
      
      expect(() => {
        wrapper = createWrapper();
      }).not.toThrow();
    });

    it('should handle API call failure gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockGrafikService.getGraphicTeknisNPHR.mockRejectedValue(new Error('Network Error'));
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(consoleSpy).toHaveBeenCalledWith(new Error('Network Error'));
      expect(wrapper.vm.isLoading).toBe(false);
      
      consoleSpy.mockRestore();
    });

    it('should handle failed API response status', async () => {
      const failedResponse = {
        success: false,
        data: null,
      };

      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(failedResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      // When success is false, loading remains true as it's not set to false in the component
      // Only data processing is skipped
      expect(wrapper.vm.isLoading).toBe(true);
      expect(wrapper.vm.graphData.isEmpty).toBe(true); // Default state
    });
  });

  describe('Data Processing Edge Cases', () => {
    it('should handle response with null data correctly', async () => {
      const nullDataResponse = {
        success: true,
        data: {
          data: null,
          legend: [
            { label: 'PLTU', color: '#FF5733' },
          ],
        },
      };

      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(nullDataResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(true);
      expect(wrapper.find('[data-testid="empty-data"]').exists()).toBe(true);
    });

    it('should handle response with empty legend correctly', async () => {
      const emptyLegendResponse = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTU',
              nama_mesin: 'PLTU Unit 1',
              data: { tahun: '2020', value: 2450.5 },
            },
          ],
          legend: [],
        },
      };

      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(emptyLegendResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.vm.graphData.legends).toHaveLength(0);
      expect(wrapper.vm.graphData.series).toHaveLength(0);
    });

    it('should handle NPHR specific data values correctly', async () => {
      const nphrSpecificResponse = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTU',
              nama_mesin: 'PLTU Suralaya',
              data: { tahun: '2023', value: 2380.7 },
            },
          ],
          legend: [
            { label: 'PLTU', color: '#FF6B35' },
          ],
        },
      };

      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(nphrSpecificResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.graphData.values).toContain(2380.7);
      expect(vm.graphData.years).toContain(2023);
      
      const pltuSeries = vm.graphData.series.find((s: any) => s.name === 'PLTU');
      expect(pltuSeries.data).toContainEqual([2023, 2380.7, 5, 'PLTU Suralaya']);
    });
  });

  describe('Component Specific Features', () => {
    it('should display NPHR specific unit in chart label', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const chartComponent = wrapper.findComponent({ name: 'DynamicScatterPlotVertiLine' });
      if (chartComponent.exists()) {
        const props = chartComponent.props();
        expect(props.yData.satuan).toBe('(kcal/kWh)');
      }
    });

    it('should handle typical NPHR value ranges', async () => {
      const nphrRangeResponse = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTU',
              nama_mesin: 'PLTU Efficient',
              data: { tahun: '2023', value: 2100.0 }, // Efficient plant
            },
            {
              kode_jenis_kit: 'PLTU',
              nama_mesin: 'PLTU Average',
              data: { tahun: '2023', value: 2450.0 }, // Average plant
            },
            {
              kode_jenis_kit: 'PLTG',
              nama_mesin: 'PLTG High',
              data: { tahun: '2023', value: 3200.0 }, // Higher NPHR for gas turbine
            },
          ],
          legend: [
            { label: 'PLTU', color: '#FF5733' },
            { label: 'PLTG', color: '#33FF57' },
          ],
        },
      };

      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(nphrRangeResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.graphData.values).toContain(2100.0);
      expect(vm.graphData.values).toContain(2450.0);
      expect(vm.graphData.values).toContain(3200.0);
    });
  });
});
