import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicComponentC from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentC.vue';
import GrafikService from '@/services/grafik-service';
import { notifyError } from '@/services/helper/toast-notification';

// Mock dependencies
jest.mock('@/services/grafik-service');
jest.mock('@/services/helper/toast-notification');
jest.mock('@/components/icons/IconEmptyData.vue', () => ({
  name: 'IconEmptyData',
  template: '<div data-testid="empty-icon">Empty Data Icon</div>'
}));
jest.mock('@/components/ui/ShimmerLoading.vue', () => ({
  name: 'ShimmerLoading',
  template: '<div data-testid="shimmer-loading">Loading...</div>'
}));
jest.mock('@/components/ui/ModalWrapper.vue', () => ({
  name: 'ModalWrapper',
  props: ['showModal', 'width', 'height'],
  template: '<div v-if="showModal" data-testid="modal-wrapper"><slot /></div>'
}));
jest.mock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue', () => ({
  name: 'DynamicScatterPlotVertiLine',
  props: ['series', 'legends', 'years', 'yValues', 'xData', 'yData', 'dataZoom'],
  template: '<div data-testid="dynamic-scatter-plot">Scatter Plot</div>'
}));

describe('GraphicComponentC.vue', () => {
  let wrapper: VueWrapper<any>;
  let mockGrafikServiceInstance: jest.Mocked<GrafikService>;

  const defaultProps = {
    itemsPembangkit: [
      { id: 'PLTU', name: 'PLTU', power: '100MW' },
      { id: 'PLTG', name: 'PLTG', power: '50MW' }
    ],
    itemsDayaMampu: [
      { id: '1', name: 'PLTU < 100' },
      { id: '2', name: 'PLTU 100 - 400' },
      { id: '3', name: 'PLTU > 400' }
    ],
    itemsDaya: [
      { id: '1', daya: '100', satuan: 'MW' },
      { id: '2', daya: '200', satuan: 'MW' }
    ],
    title: 'Biaya C vs Capex',
    yearRange: [2019, 2024]
  };

  const mockInitialPembangkitData = [
    { kode_jenis_pembangkit: 'PLTU' },
    { kode_jenis_pembangkit: 'PLTG' }
  ];

  const mockInitialPembangkitResponse = {
    data: mockInitialPembangkitData
  };

  const mockApiResponse = {
    success: true,
    data: {
      data: [
        {
          data: { tahun: '2023', value: 1500 },
          kode_jenis_kit: 'PLTU',
          nama_mesin: 'PLTU Suralaya'
        },
        {
          data: { tahun: '2024', value: 1800 },
          kode_jenis_kit: 'PLTG',
          nama_mesin: 'PLTG Muara Karang'
        }
      ],
      legend: [
        { label: 'PLTU', color: '#FF5733' },
        { label: 'PLTG', color: '#33FF57' }
      ]
    }
  };

  const mockEmptyApiResponse = {
    success: true,
    data: {
      data: [],
      legend: []
    }
  };

  const stubsConfig = {
    'el-checkbox': true,
    'el-checkbox-group': true,
    'el-select': true,
    'el-option': true,
    'VueDatePicker': true
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock instance
    mockGrafikServiceInstance = new GrafikService() as jest.Mocked<GrafikService>;
    
    // Setup default mock implementations
    mockGrafikServiceInstance.getInitialPembangkit = jest.fn().mockResolvedValue(mockInitialPembangkitResponse);
    mockGrafikServiceInstance.getGraphicBiaya = jest.fn().mockResolvedValue(mockApiResponse);
    
    // Mock the constructor to return our mock instance
    (GrafikService as jest.MockedClass<typeof GrafikService>).mockImplementation(() => mockGrafikServiceInstance);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = defaultProps) => {
    return mount(GraphicComponentC, {
      props,
      global: {
        stubs: stubsConfig
      }
    });
  };

  describe('Component Rendering', () => {
    it('should render component with correct title', () => {
      wrapper = createWrapper();
      expect(wrapper.find('h2').text()).toBe(defaultProps.title);
    });

    it('should render filter button', () => {
      wrapper = createWrapper();
      const filterButton = wrapper.find('button');
      expect(filterButton.exists()).toBe(true);
      expect(filterButton.text()).toContain('Filter');
    });

    it('should show loading state initially', async () => {
      jest.useFakeTimers();
      
      // Create controlled promises
      let resolveGetDataGraph: any;
      const pendingPromise = new Promise(resolve => {
        resolveGetDataGraph = resolve;
      });
      
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockReturnValue(pendingPromise);
      
      wrapper = createWrapper();
      
      // Allow fetchInitialPembangkit to complete first
      await flushPromises();
      
      // After fetchInitialPembangkit, getDataGraph should be called and set loading to true
      expect(wrapper.vm.isLoading).toBe(true);
      
      // Resolve the getDataGraph promise
      resolveGetDataGraph(mockApiResponse);
      await flushPromises();
      
      expect(wrapper.vm.isLoading).toBe(false);
      
      jest.useRealTimers();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch initial pembangkit data on mount', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(mockGrafikServiceInstance.getInitialPembangkit).toHaveBeenCalled();
    });

    it('should handle fetch initial pembangkit error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGrafikServiceInstance.getInitialPembangkit.mockRejectedValue(new Error('API Error'));
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Initial Pembangkit Error : ', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });

    it('should fetch graph data successfully', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith({
        komponen: 'C',
        kode_jenis_pembangkit: ['PLTU', 'PLTG'],
        id_daya: [1, 2, 3],
        tahun_awal: expect.any(String),
        tahun_akhir: expect.any(String)
      });
    });

    it('should handle graph data fetch error', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockRejectedValue(new Error('API Error'));
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleLogSpy.mockRestore();
    });
  });

  describe('Modal Interactions', () => {
    it('should open modal when filter button is clicked', async () => {
      wrapper = createWrapper();
      
      wrapper.vm.showModal = true;
      
      expect(wrapper.vm.showModal).toBe(true);
    });

    it('should close modal when closeModal is called with valid selection', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.showModal = true;
      
      wrapper.vm.closeModal();
      
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when closeModal is called without selection', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2023, 2024];
      
      wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should show error when closeModal is called without period', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });

    it('should close modal when valid selection is provided', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = [2023, 2024];
      wrapper.vm.showModal = true;
      
      wrapper.vm.closeModal();
      
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when closeModal is called without both selection and period', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      
      wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });
  });

  describe('Filter Functions', () => {
    it('should apply filter successfully', async () => {
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = [2023, 2024];
      wrapper.vm.showModal = true;
      
      await wrapper.vm.applyFilter();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith(expect.objectContaining({
        komponen: 'C'
      }));
    });

    it('should show error when applyFilter is called without selection', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2023, 2024];
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should apply filter no DMN successfully', async () => {
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTG'];
      wrapper.vm.filter.periode = [2023, 2024];
      wrapper.vm.showModal = true;
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith(expect.objectContaining({
        komponen: 'C',
        id_daya: []
      }));
    });
  });

  describe('Checkbox Handlers', () => {
    it('should handle check all pembangkit', async () => {
      wrapper = createWrapper();
      
      wrapper.vm.handleCheckAll(true);
      
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG']);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should handle uncheck all pembangkit', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU', 'PLTG'];
      
      wrapper.vm.handleCheckAll(false);
      
      expect(wrapper.vm.value).toEqual([]);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should handle check all DMN', async () => {
      wrapper = createWrapper();
      
      wrapper.vm.handleCheckDmn(true);
      
      expect(wrapper.vm.dmn).toEqual(['1', '2', '3']);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should handle uncheck all DMN', async () => {
      wrapper = createWrapper();
      wrapper.vm.dmn = ['1', '2', '3'];
      
      wrapper.vm.handleCheckDmn(false);
      
      expect(wrapper.vm.dmn).toEqual([]);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Watchers', () => {
    it('should update checkAll state when value changes to empty', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = [];
      
      await nextTick();
      
      expect(wrapper.vm.checkAll).toBe(false);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update checkAll state when value changes to full', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU', 'PLTG'];
      
      await nextTick();
      
      expect(wrapper.vm.checkAll).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update indeterminate state when value changes partially', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      
      await nextTick();
      
      expect(wrapper.vm.indeterminate).toBe(true);
    });

    it('should update checkDmn state when dmn changes to empty', async () => {
      wrapper = createWrapper();
      wrapper.vm.dmn = [];
      
      await nextTick();
      
      expect(wrapper.vm.checkDmn).toBe(false);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should update checkDmn state when dmn changes to full', async () => {
      wrapper = createWrapper();
      wrapper.vm.dmn = ['1', '2', '3'];
      
      await nextTick();
      
      expect(wrapper.vm.checkDmn).toBe(true);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should update indeterminateDmn state when dmn changes partially', async () => {
      wrapper = createWrapper();
      wrapper.vm.dmn = ['1', '2'];
      
      await nextTick();
      
      expect(wrapper.vm.indeterminateDmn).toBe(true);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no data available', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockEmptyApiResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(true);
    });

    it('should show scatter plot when data is available', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(false);
      expect(wrapper.vm.graphData.series).toBeDefined();
      expect(wrapper.vm.graphData.legends).toBeDefined();
    });
  });

  describe('Graph Data Processing', () => {
    it('should process graph data correctly', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(wrapper.vm.graphData.series).toHaveLength(2);
      expect(wrapper.vm.graphData.legends).toHaveLength(2);
      expect(wrapper.vm.graphData.years).toContain(2023);
      expect(wrapper.vm.graphData.years).toContain(2024);
      expect(wrapper.vm.graphData.values).toContain(1500);
      expect(wrapper.vm.graphData.values).toContain(1800);
    });

    it('should process graph data correctly for NoDMN', async () => {
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith(expect.objectContaining({
        komponen: 'C',
        id_daya: []
      }));
    });

    it('should set isEmpty to true when data is empty', async () => {
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockEmptyApiResponse);
      wrapper = createWrapper();
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(true);
    });
  });

  describe('Filter Badge Display', () => {
    it('should display selected pembangkit categories in badge', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU', 'PLTG'];
      
      await nextTick();
      
      const badge = wrapper.find('.badge');
      expect(badge.exists()).toBe(true);
    });

    it('should display selected DMN values when PLTU is selected', async () => {
      wrapper = createWrapper();
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = ['1', '2'];
      
      await nextTick();
      
      expect(wrapper.vm.value.includes('PLTU')).toBe(true);
    });

    it('should display selected period in badge', async () => {
      wrapper = createWrapper();
      wrapper.vm.filter.periode = [2023, 2024];
      
      await nextTick();
      
      expect(wrapper.vm.filter.periode).toEqual([2023, 2024]);
    });
  });

  describe('Props Validation', () => {
    it('should accept valid props', () => {
      wrapper = createWrapper();
      
      expect(wrapper.props('title')).toBe(defaultProps.title);
      expect(wrapper.props('itemsPembangkit')).toEqual(defaultProps.itemsPembangkit);
      expect(wrapper.props('itemsDayaMampu')).toEqual(defaultProps.itemsDayaMampu);
      expect(wrapper.props('itemsDaya')).toEqual(defaultProps.itemsDaya);
      expect(wrapper.props('yearRange')).toEqual(defaultProps.yearRange);
    });

    it('should handle empty itemsPembangkit', () => {
      const propsWithEmptyPembangkit = {
        ...defaultProps,
        itemsPembangkit: []
      };
      
      wrapper = createWrapper(propsWithEmptyPembangkit);
      
      expect(wrapper.props('itemsPembangkit')).toEqual([]);
    });

    it('should handle empty itemsDayaMampu', () => {
      const propsWithEmptyDayaMampu = {
        ...defaultProps,
        itemsDayaMampu: []
      };
      
      wrapper = createWrapper(propsWithEmptyDayaMampu);
      
      expect(wrapper.props('itemsDayaMampu')).toEqual([]);
    });

    it('should handle additional itemsDaya prop', () => {
      const propsWithAdditionalDaya = {
        ...defaultProps,
        itemsDaya: [
          ...defaultProps.itemsDaya,
          { id: '3', daya: '300', satuan: 'MW' }
        ]
      };
      
      wrapper = createWrapper(propsWithAdditionalDaya);
      
      expect(wrapper.props('itemsDaya')).toHaveLength(3);
    });
  });

  describe('API Call Validation', () => {
    it('should call getGraphicBiaya with correct parameters', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith({
        komponen: 'C',
        kode_jenis_pembangkit: ['PLTU', 'PLTG'],
        id_daya: [1, 2, 3],
        tahun_awal: expect.any(String),
        tahun_akhir: expect.any(String)
      });
    });

    it('should call getGraphicBiaya with empty id_daya for NoDMN', async () => {
      wrapper = createWrapper();
      
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith(expect.objectContaining({
        komponen: 'C',
        id_daya: []
      }));
    });
  });

  describe('Loading States', () => {
    it('should set isLoading to true when fetching data', async () => {
      let resolvePromise: any;
      const pendingPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      
      mockGrafikServiceInstance.getGraphicBiaya.mockReturnValue(pendingPromise);
      wrapper = createWrapper();
      
      wrapper.vm.getDataGraph();
      await nextTick();
      
      expect(wrapper.vm.isLoading).toBe(true);
      
      resolvePromise(mockApiResponse);
      await flushPromises();
    });

    it('should set isLoading to false after data fetch completes', async () => {
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      
      await wrapper.vm.getDataGraph();
      await flushPromises();
      
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it('should set isLoading to false when error occurs', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      mockGrafikServiceInstance.getGraphicBiaya.mockRejectedValue(new Error('API Error'));
      wrapper = createWrapper();
      
      await wrapper.vm.getDataGraph();
      await flushPromises();
      
      expect(wrapper.vm.isLoading).toBe(false);
      consoleLogSpy.mockRestore();
    });
  });

  describe('Period Range Functionality', () => {
    it('should initialize with default period range', () => {
      wrapper = createWrapper();
      
      const currentYear = new Date().getFullYear();
      const expectedStartYear = currentYear - 5;
      
      expect(wrapper.vm.filter.periode).toEqual([expectedStartYear, currentYear]);
    });

    it('should handle period range in API calls', async () => {
      wrapper = createWrapper();
      wrapper.vm.filter.periode = [2020, 2023];
      
      await wrapper.vm.getDataGraph();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith(expect.objectContaining({
        tahun_awal: '2020',
        tahun_akhir: '2023'
      }));
    });
  });

  describe('Component C Specific Features', () => {
    it('should always use component C in API calls', async () => {
      wrapper = createWrapper();
      
      await wrapper.vm.getDataGraph();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith(expect.objectContaining({
        komponen: 'C'
      }));
    });

    it('should use DynamicScatterPlotVertiLine component for visualization', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(false);
    });

    it('should process year and value data correctly', async () => {
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.graphData.years).toEqual(expect.arrayContaining([2023, 2024]));
      expect(wrapper.vm.graphData.values).toEqual(expect.arrayContaining([1500, 1800]));
    });
  });
});
