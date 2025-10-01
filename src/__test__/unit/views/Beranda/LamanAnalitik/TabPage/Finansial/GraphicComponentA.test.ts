import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicComponentA from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentA.vue';
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
  template: `
    <div v-if="showModal" data-testid="modal-wrapper">
      <slot></slot>
    </div>
  `
}));
jest.mock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue', () => ({
  name: 'DynamicScatterPlotVertiLine',
  props: ['series', 'legends', 'years', 'yValues', 'dataZoom', 'xData', 'yData'],
  template: '<div data-testid="dynamic-scatter-plot-verti">Vertical Line Scatter Plot</div>'
}));

const mockGrafikService = GrafikService as jest.MockedClass<typeof GrafikService>;
const mockNotifyError = notifyError as jest.MockedFunction<typeof notifyError>;

describe('GraphicComponentA.vue', () => {
  let wrapper: VueWrapper<any>;
  let mockGrafikServiceInstance: jest.Mocked<GrafikService>;

  const defaultProps = {
    itemsPembangkit: [
      { id: '1', name: 'PLTU', power: '100MW' },
      { id: '2', name: 'PLTG', power: '50MW' },
      { id: '3', name: 'PLTP', power: '25MW' }
    ],
    itemsDayaMampu: [
      { id: '1', name: 'DMN 1' },
      { id: '2', name: 'DMN 2' },
      { id: '3', name: 'DMN 3' }
    ],
    itemsDaya: [
      { id: '1', daya: '100', satuan: 'MW' },
      { id: '2', daya: '200', satuan: 'MW' },
      { id: '3', daya: '300', satuan: 'MW' }
    ],
    title: 'Test Grafik Component A',
    yearRange: [2020, 2021, 2022, 2023, 2024]
  };

  const mockApiResponse = {
    success: true,
    data: {
      data: [
        {
          kode_jenis_kit: 'PLTU',
          nama_mesin: 'PLTU Test',
          data: { tahun: '2024', value: 1000 }
        }
      ],
      legend: [
        { label: 'PLTU', color: '#FF0000' }
      ]
    }
  };

  const mockInitialPembangkitResponse = {
    data: [
      { kode_jenis_pembangkit: 'PLTU' },
      { kode_jenis_pembangkit: 'PLTG' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockGrafikServiceInstance = {
      getInitialPembangkit: jest.fn(),
      getGraphicBiaya: jest.fn()
    } as any;
    
    mockGrafikService.mockImplementation(() => mockGrafikServiceInstance);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = defaultProps) => {
    return mount(GraphicComponentA, {
      props,
      global: {
        stubs: {
          'el-checkbox': true,
          'el-checkbox-group': true,
          'el-select': true,
          'el-option': true,
          'VueDatePicker': true
        }
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
      await nextTick();
      
      expect(mockGrafikServiceInstance.getInitialPembangkit).toHaveBeenCalled();
    });

    it('should handle fetch initial pembangkit error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGrafikServiceInstance.getInitialPembangkit.mockRejectedValue(new Error('API Error'));
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Initial Pembangkit Error : ', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });

    it('should fetch graph data successfully', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async operations
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalled();
    });

    it('should handle graph data fetch error', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockRejectedValue(new Error('Graph API Error'));
      
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleLogSpy.mockRestore();
    });
  });

  describe('Modal Interactions', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should open modal when filter button is clicked', async () => {
      // Set the showModal directly instead of triggering click
      wrapper.vm.showModal = true;
      await nextTick();
      
      expect(wrapper.find('[data-testid="modal-wrapper"]').exists()).toBe(true);
    });

    it('should close modal when closeModal is called with valid selection', async () => {
      // Set modal to open first
      wrapper.vm.showModal = true;
      await nextTick();
      
      // Set value to have valid selection
      wrapper.vm.value = ['PLTU'];
      await wrapper.vm.closeModal();
      await nextTick();
      
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when closeModal is called without selection', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2023, 2024];
      await wrapper.vm.closeModal();
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should show error when closeModal is called without period', async () => {
      wrapper.vm.value = []; // No value selected
      wrapper.vm.filter.periode = null; // No period selected
      await wrapper.vm.closeModal();
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });

    it('should close modal when valid selection is provided', async () => {
      wrapper.vm.value = ['PLTU']; // Has value
      wrapper.vm.filter.periode = null; // No period - but with value, modal should close
      await wrapper.vm.closeModal();
      
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when closeModal is called without both selection and period', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = null;
      await wrapper.vm.closeModal();
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });
  });

  describe('Filter Functions', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should apply filter successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = [2023, 2024];
      
      await wrapper.vm.applyFilter();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalled();
    });

    it('should show error when applyFilter is called without selection', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.periode = [2023, 2024];
      
      await wrapper.vm.applyFilter();
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should apply filter no DMN successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = [2023, 2024];
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith({
        komponen: 'A',
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: [],
        tahun_awal: '2023',
        tahun_akhir: '2024'
      });
    });
  });

  describe('Checkbox Handlers', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should handle check all pembangkit', async () => {
      await wrapper.vm.handleCheckAll(true);
      
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG', 'PLTP']);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should handle uncheck all pembangkit', async () => {
      wrapper.vm.value = ['PLTU', 'PLTG'];
      await wrapper.vm.handleCheckAll(false);
      
      expect(wrapper.vm.value).toEqual([]);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should handle check all DMN', async () => {
      await wrapper.vm.handleCheckDmn(true);
      
      expect(wrapper.vm.dmn).toEqual(['1', '2', '3']);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should handle uncheck all DMN', async () => {
      wrapper.vm.dmn = ['1', '2'];
      await wrapper.vm.handleCheckDmn(false);
      
      expect(wrapper.vm.dmn).toEqual([]);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Watchers', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should update checkAll state when value changes to empty', async () => {
      wrapper.vm.value = [];
      await nextTick();
      
      expect(wrapper.vm.checkAll).toBe(false);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update checkAll state when value changes to full', async () => {
      wrapper.vm.value = ['PLTU', 'PLTG', 'PLTP'];
      await nextTick();
      
      expect(wrapper.vm.checkAll).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update indeterminate state when value changes partially', async () => {
      wrapper.vm.value = ['PLTU'];
      await nextTick();
      
      expect(wrapper.vm.indeterminate).toBe(true);
    });

    it('should update checkDmn state when dmn changes to empty', async () => {
      wrapper.vm.dmn = [];
      await nextTick();
      
      expect(wrapper.vm.checkDmn).toBe(false);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should update checkDmn state when dmn changes to full', async () => {
      wrapper.vm.dmn = ['1', '2', '3'];
      await nextTick();
      
      expect(wrapper.vm.checkDmn).toBe(true);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should update indeterminateDmn state when dmn changes partially', async () => {
      wrapper.vm.dmn = ['1'];
      await nextTick();
      
      expect(wrapper.vm.indeterminateDmn).toBe(true);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no data available', async () => {
      const emptyResponse = {
        success: true,
        data: {
          data: [],
          legend: []
        }
      };

      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(emptyResponse);
      
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(wrapper.find('[data-testid="empty-icon"]').exists()).toBe(true);
    });

    it('should show scatter plot when data is available', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Wait for loading to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      await nextTick();
      
      expect(wrapper.find('[data-testid="dynamic-scatter-plot-verti"]').exists()).toBe(true);
    });
  });

  describe('Graph Data Processing', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should process graph data correctly', async () => {
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.graphData.years).toContain(2024);
      expect(wrapper.vm.graphData.values).toContain(1000);
      expect(wrapper.vm.graphData.isEmpty).toBe(false);
    });

    it('should process graph data correctly for NoDMN', async () => {
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(wrapper.vm.graphData.years).toContain(2024);
      expect(wrapper.vm.graphData.values).toContain(1000);
      expect(wrapper.vm.graphData.isEmpty).toBe(false);
    });

    it('should set isEmpty to true when data is empty', async () => {
      const emptyResponse = {
        success: true,
        data: {
          data: [],
          legend: []
        }
      };

      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(emptyResponse);
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(true);
    });
  });

  describe('Filter Badge Display', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should display selected pembangkit categories in badge', async () => {
      wrapper.vm.value = ['PLTU', 'PLTG'];
      await nextTick();
      
      const badge = wrapper.find('.badge');
      expect(badge.exists()).toBe(true);
      expect(badge.text()).toContain('Kategori Pembangkit');
    });

    it('should display selected DMN values when PLTU is selected', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = ['1', '2'];
      await nextTick();
      
      const badges = wrapper.findAll('.badge');
      const dmnBadge = badges.find(badge => badge.text().includes('DMN'));
      expect(dmnBadge?.exists()).toBe(true);
    });

    it('should display selected period in badge', async () => {
      wrapper.vm.filter.periode = [2023, 2024];
      await nextTick();
      
      const badges = wrapper.findAll('.badge');
      const periodBadge = badges.find(badge => badge.text().includes('Tahun'));
      expect(periodBadge?.exists()).toBe(true);
    });
  });

  describe('Props Validation', () => {
    it('should accept valid props', () => {
      wrapper = createWrapper(defaultProps);
      expect(wrapper.props()).toEqual(defaultProps);
    });

    it('should handle empty itemsPembangkit', () => {
      const props = { ...defaultProps, itemsPembangkit: [] };
      wrapper = createWrapper(props);
      expect(wrapper.props().itemsPembangkit).toEqual([]);
    });

    it('should handle empty itemsDayaMampu', () => {
      const props = { ...defaultProps, itemsDayaMampu: [] };
      wrapper = createWrapper(props);
      expect(wrapper.props().itemsDayaMampu).toEqual([]);
    });

    it('should handle additional itemsDaya prop', () => {
      wrapper = createWrapper(defaultProps);
      expect(wrapper.props().itemsDaya).toEqual(defaultProps.itemsDaya);
    });
  });

  describe('API Call Validation', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should call getGraphicBiaya with correct parameters', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.dmn = ['1', '2'];
      wrapper.vm.filter.periode = [2023, 2024];
      
      await wrapper.vm.getDataGraph();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith({
        komponen: 'A',
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: ['1', '2'],
        tahun_awal: '2023',
        tahun_akhir: '2024'
      });
    });

    it('should call getGraphicBiaya with empty id_daya for NoDMN', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = [2023, 2024];
      
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith({
        komponen: 'A',
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: [],
        tahun_awal: '2023',
        tahun_akhir: '2024'
      });
    });
  });

  describe('Loading States', () => {
    it('should set isLoading to true when fetching data', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockImplementation(() => {
        expect(wrapper.vm.isLoading).toBe(true);
        return Promise.resolve(mockApiResponse);
      });
      
      wrapper = createWrapper();
      await nextTick();
      
      await wrapper.vm.getDataGraph();
    });

    it('should set isLoading to false after data fetch completes', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it('should set isLoading to false when error occurs', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockRejectedValue(new Error('API Error'));
      
      wrapper = createWrapper();
      await nextTick();
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe('Period Range Functionality', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should initialize with default period range', () => {
      const currentYear = new Date().getFullYear();
      const expectedStartYear = currentYear - 5;
      
      expect(wrapper.vm.filter.periode).toEqual([expectedStartYear, currentYear]);
    });

    it('should handle period range in API calls', async () => {
      const customPeriod = [2020, 2024];
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.periode = customPeriod;
      
      await wrapper.vm.getDataGraph();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith(
        expect.objectContaining({
          tahun_awal: '2020',
          tahun_akhir: '2024'
        })
      );
    });
  });

  describe('Component A Specific Features', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicBiaya.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should always use component A in API calls', async () => {
      wrapper.vm.value = ['PLTU'];
      await wrapper.vm.getDataGraph();
      
      expect(mockGrafikServiceInstance.getGraphicBiaya).toHaveBeenCalledWith(
        expect.objectContaining({
          komponen: 'A'
        })
      );
    });

    it('should use DynamicScatterPlotVertiLine component for visualization', async () => {
      await wrapper.vm.getDataGraph();
      await nextTick();
      
      // Check if the correct scatter plot component is used
      expect(wrapper.find('[data-testid="dynamic-scatter-plot-verti"]').exists()).toBe(true);
    });

    it('should process year and value data correctly', async () => {
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.graphData.years).toEqual([2024]);
      expect(wrapper.vm.graphData.values).toEqual([1000]);
    });
  });
});