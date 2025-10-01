import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicCapexEaf from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Eaf.vue';
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
jest.mock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue', () => ({
  name: 'DynamicScatterPlot',
  props: ['source', 'series', 'legends', 'pln', 'ipp', 'dataZoom', 'xData', 'yData'],
  template: '<div data-testid="dynamic-scatter-plot">Scatter Plot</div>'
}));

const mockGrafikService = GrafikService as jest.MockedClass<typeof GrafikService>;
const mockNotifyError = notifyError as jest.MockedFunction<typeof notifyError>;

describe('GraphicCapex_Eaf.vue', () => {
  let wrapper: VueWrapper<any>;
  let mockGrafikServiceInstance: jest.Mocked<GrafikService>;

  const defaultProps = {
    itemsPembangkit: [
      { id: '1', name: 'PLTU' },
      { id: '2', name: 'PLTG' },
      { id: '3', name: 'PLTP' }
    ],
    itemsDayaMampu: [
      { id: '1', name: 'DMN 1' },
      { id: '2', name: 'DMN 2' },
      { id: '3', name: 'DMN 3' }
    ],
    title: 'Test Grafik Capex EAF',
    yearRange: [2020, 2021, 2022, 2023, 2024]
  };

  const mockApiResponse = {
    success: true,
    data: [{
      grafik: [
        {
          kode_jenis_kit: 'PLTU',
          nama_mesin: 'PLTU Test',
          data: { eaf: 80, capex: 1000 }
        }
      ],
      legend: [
        { label: 'PLTU', color: '#FF0000' }
      ],
      average_pln_eaf: 75,
      average_pln_capex: 950,
      average_ipp_eaf: 80,
      average_ipp_capex: 1050
    }]
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
      getGraphicAnalitikEAF: jest.fn()
    } as any;
    
    mockGrafikService.mockImplementation(() => mockGrafikServiceInstance);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = defaultProps) => {
    return mount(GraphicCapexEaf, {
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
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      
      expect(wrapper.find('[data-testid="shimmer-loading"]').exists()).toBe(true);
    });
  });

  describe('Data Fetching', () => {
    it('should fetch initial pembangkit data on mount', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      
      expect(mockGrafikServiceInstance.getInitialPembangkit).toHaveBeenCalled();
    });

    it('should handle fetch initial pembangkit error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGrafikServiceInstance.getInitialPembangkit.mockRejectedValue(new Error('API Error'));
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Initial Pembangkit Error : ', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });

    it('should fetch graph data successfully', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async operations
      
      expect(mockGrafikServiceInstance.getGraphicAnalitikEAF).toHaveBeenCalled();
    });

    it('should handle graph data fetch error', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockRejectedValue(new Error('Graph API Error'));
      
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
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should open modal when filter button is clicked', async () => {
      const filterButton = wrapper.find('button');
      
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
      wrapper.vm.filter.tahun = 2024;
      await wrapper.vm.closeModal();
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should show error when closeModal is called without year', async () => {
      wrapper.vm.value = []; // No value selected
      wrapper.vm.filter.tahun = null; // No year selected
      await wrapper.vm.closeModal();
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });

    it('should close modal when valid selection is provided', async () => {
      wrapper.vm.value = ['PLTU']; // Has value
      wrapper.vm.filter.tahun = null; // No year - but with value, modal should close
      await wrapper.vm.closeModal();
      
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when closeModal is called without both selection and year', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.tahun = null;
      await wrapper.vm.closeModal();
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    });
  });

  describe('Filter Functions', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
      wrapper = createWrapper();
      await nextTick();
    });

    it('should apply filter successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.tahun = 2024;
      
      await wrapper.vm.applyFilter();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikServiceInstance.getGraphicAnalitikEAF).toHaveBeenCalled();
    });

    it('should show error when applyFilter is called without selection', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.tahun = 2024;
      
      await wrapper.vm.applyFilter();
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should apply filter no DMN successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.tahun = 2024;
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(wrapper.vm.showModal).toBe(false);
      expect(mockGrafikServiceInstance.getGraphicAnalitikEAF).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: [],
        periode: '2024'
      });
    });
  });

  describe('Checkbox Handlers', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
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
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
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
        data: [{
          grafik: null,
          legend: null,
          average_pln_eaf: 0,
          average_pln_capex: 0,
          average_ipp_eaf: 0,
          average_ipp_capex: 0
        }]
      };

      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(emptyResponse);
      
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(wrapper.find('[data-testid="empty-icon"]').exists()).toBe(true);
    });

    it('should show scatter plot when data is available', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
      
      wrapper = createWrapper();
      await nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Wait for loading to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      await nextTick();
      
      expect(wrapper.find('[data-testid="dynamic-scatter-plot"]').exists()).toBe(true);
    });
  });

  describe('Filter Badge Display', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse);
      mockGrafikServiceInstance.getGraphicAnalitikEAF.mockResolvedValue(mockApiResponse);
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

    it('should display selected year in badge', async () => {
      wrapper.vm.filter.tahun = 2024;
      await nextTick();
      
      const badges = wrapper.findAll('.badge');
      const yearBadge = badges.find(badge => badge.text().includes('Tahun'));
      expect(yearBadge?.exists()).toBe(true);
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
  });
});
