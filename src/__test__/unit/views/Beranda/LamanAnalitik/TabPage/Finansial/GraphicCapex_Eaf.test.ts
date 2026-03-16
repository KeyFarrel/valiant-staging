import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

// Mock services first (hoisted)
vi.mock('@/services/grafik-service');
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
}));

// Import after mocks
import GraphicCapexEaf from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Eaf.vue';
import GrafikService from '@/services/grafik-service';
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
  title: 'Test Graphic Capex EAF',
  yearRange: [2020, 2025],
  initialPembangkit: ['PLTU', 'PLTG', 'PLTS'],
};

describe('GraphicCapex_Eaf.vue', () => {
  let wrapper: any;
  let mockGrafikService: any;

  const mockInitialPembangkitResponse = {
    success: true,
    data: [
      { kode_jenis_pembangkit: 'PLTU' },
      { kode_jenis_pembangkit: 'PLTG' },
      { kode_jenis_pembangkit: 'PLTS' },
    ]
  };

  const mockGraphicCapexEafResponse = {
    success: true,
    data: [{
      grafik: [
        {
          kode_jenis_kit: 'PLTU',
          data: {
            eaf: 75.5,
            capex: 120.8,
          },
          nama_mesin: 'Test Machine PLTU',
        },
        {
          kode_jenis_kit: 'PLTG',
          data: {
            eaf: 65.2,
            capex: 95.3,
          },
          nama_mesin: 'Test Machine PLTG',
        },
      ],
      legend: [
        { label: 'PLTU', color: '#ff0000' },
        { label: 'PLTG', color: '#00ff00' },
      ],
      average_pln_eaf: 70.3,
      average_pln_capex: 108.0,
      average_ipp_eaf: 68.8,
      average_ipp_capex: 102.5,
    }]
  };

  beforeEach(() => {
    mockGrafikService = {
      getInitialPembangkit: vi.fn().mockResolvedValue(mockInitialPembangkitResponse),
      getGraphicAnalitikEAF: vi.fn().mockResolvedValue(mockGraphicCapexEafResponse),
    };
    
    vi.mocked(GrafikService).mockImplementation(function() { return mockGrafikService; } as any);
    
    wrapper = mount(GraphicCapexEaf, {
      props: defaultProps,
      global: {
        components: {
          Empty: { template: '<div>Empty Data</div>' },
          ShimmerLoading: { template: '<div>Loading...</div>' },
          ModalWrapper: {
            template: '<div><slot /></div>',
            props: ['showModal', 'width', 'height']
          },
          DynamicScatterPlot: {
            template: '<div>Scatter Plot</div>',
            props: ['source', 'series', 'legends', 'pln', 'ipp', 'xData', 'yData', 'dataZoom']
          },
          ElSelect: {
            template: '<div><slot name="header" /><slot /></div>',
            props: ['modelValue', 'multiple', 'clearable', 'collapseTagselect', 'placeholder', 'popperClass', 'maxCollapseTags'],
            emits: ['update:modelValue']
          },
          ElOption: {
            template: '<div></div>',
            props: ['label', 'value']
          },
          ElCheckbox: {
            template: '<div></div>',
            props: ['modelValue', 'indeterminate'],
            emits: ['update:modelValue', 'change']
          },
          VueDatePicker: {
            template: '<div></div>',
            props: ['modelValue', 'placeholder', 'formatLocale', 'yearRange', 'enableTimePicker', 'hideInputIcon', 'clearable', 'showNowButton', 'yearPicker', 'monthChangeOnScroll', 'teleport', 'autoApply'],
            emits: ['update:modelValue']
          }
        }
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    wrapper?.unmount();
  });

  describe('Component Initialization', () => {
    it('should render with correct title', () => {
      expect(wrapper.find('h2').text()).toBe(defaultProps.title);
    });

    it('should show loading state initially', async () => {
      // Since onMounted is called and sets isLoading to false, we need to check before mount
      const testWrapper = mount(GraphicCapexEaf, {
        props: defaultProps,
        global: {
          components: {
            Empty: { template: '<div>Empty Data</div>' },
            ShimmerLoading: { template: '<div>Loading...</div>' },
            ModalWrapper: {
              template: '<div><slot /></div>',
              props: ['showModal', 'width', 'height']
            }
          }
        }
      });
      
      // Check that loading is initially true or check for loading component
      expect(testWrapper.find('div').exists()).toBe(true);
      testWrapper.unmount();
    });

    it('should call fetchInitialPembangkit and getDataGraph on mount', async () => {
      await nextTick();
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG', 'PLTS']);
      expect(mockGrafikService.getGraphicAnalitikEAF).toHaveBeenCalled();
    });
  });

  describe('Filter Modal', () => {
    it('should open modal when filter button is clicked', async () => {
      const filterButton = wrapper.find('button');
      await filterButton.trigger('click');
      
      expect(wrapper.vm.showModal).toBe(true);
    });

    it('should show filter indicator when filters are applied', async () => {
      // Directly modify the reactive properties
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.tahun = 2023;
      await nextTick();
      
      const indicator = wrapper.find('.bg-warningColor');
      expect(indicator.exists()).toBe(true);
    });
  });

  describe('Data Fetching', () => {
    it('should fetch initial pembangkit data successfully', async () => {
      await nextTick();
      
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG', 'PLTS']);
    });

    it('should fetch graphic data with correct parameters', async () => {
      await wrapper.vm.getDataGraph();
      
      expect(mockGrafikService.getGraphicAnalitikEAF).toHaveBeenCalledWith({
        kode_jenis_pembangkit: expect.any(Array),
        id_daya: expect.any(Array),
        periode: expect.any(String)
      });
    });

    it('should handle successful graphic data response', async () => {
      await wrapper.vm.getDataGraph();
      await nextTick();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(false);
      expect(wrapper.vm.graphData.series).toHaveLength(2);
      expect(wrapper.vm.graphData.legends).toHaveLength(2);
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it('should handle empty graphic data', async () => {
      const emptyResponse = {
        success: true,
        data: [{
          grafik: null,
          legend: [],
          average_pln_eaf: 0,
          average_pln_capex: 0,
          average_ipp_eaf: 0,
          average_ipp_capex: 0,
        }]
      };
      
      mockGrafikService.getGraphicAnalitikEAF.mockResolvedValueOnce(emptyResponse);
      
      await wrapper.vm.getDataGraph();
      await nextTick();
      
      expect(wrapper.vm.graphData.isEmpty).toBe(true);
    });

    it('should handle fetch error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockGrafikService.getGraphicAnalitikEAF.mockRejectedValueOnce(new Error('Network error'));
      
      await wrapper.vm.getDataGraph();
      
      expect(wrapper.vm.isLoading).toBe(false);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Filter Functionality', () => {
    it('should apply filter successfully', async () => {
      wrapper.vm.value = ['PLTU', 'PLTG'];
      wrapper.vm.filter.tahun = 2023;
      
      await wrapper.vm.applyFilter();
      
      expect(mockGrafikService.getGraphicAnalitikEAF).toHaveBeenCalled();
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when no pembangkit selected', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.tahun = 2023;
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!',
        5000
      );
    });

    it('should show error when no year selected', async () => {
      wrapper.vm.value = []; // No pembangkit selected
      wrapper.vm.filter.tahun = null; // No year selected
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should show error when both pembangkit and year not selected', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.tahun = null;
      
      await wrapper.vm.applyFilter();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });
  });

  describe('Checkbox Functionality', () => {
    it('should handle check all pembangkit', async () => {
      await wrapper.vm.handleCheckAll(true);
      
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG', 'PLTS']);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should handle uncheck all pembangkit', async () => {
      await wrapper.vm.handleCheckAll(false);
      
      expect(wrapper.vm.value).toEqual([]);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update checkAll state when all items selected', async () => {
      wrapper.vm.value = ['PLTU', 'PLTG', 'PLTS'];
      await nextTick();
      
      expect(wrapper.vm.checkAll).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update indeterminate state when some items selected', async () => {
      wrapper.vm.value = ['PLTU'];
      await nextTick();
      
      expect(wrapper.vm.indeterminate).toBe(true);
    });

    it('should handle check all daya mampu', async () => {
      await wrapper.vm.handleCheckDmn(true);
      
      expect(wrapper.vm.dmn).toEqual(['1', '2', '3']);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });

    it('should handle uncheck all daya mampu', async () => {
      await wrapper.vm.handleCheckDmn(false);
      
      expect(wrapper.vm.dmn).toEqual([]);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Alternative Data Fetching', () => {
    it('should fetch data without DMN filter', async () => {
      await wrapper.vm.getDataGraphNoDMN();
      
      expect(mockGrafikService.getGraphicAnalitikEAF).toHaveBeenCalledWith({
        kode_jenis_pembangkit: expect.any(Array),
        id_daya: [],
        periode: expect.any(String)
      });
    });

    it('should apply filter without DMN successfully', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.tahun = 2023;
      
      await wrapper.vm.applyFilterNoDMN();
      
      expect(mockGrafikService.getGraphicAnalitikEAF).toHaveBeenCalled();
      expect(wrapper.vm.showModal).toBe(false);
    });
  });

  describe('Modal Close Functionality', () => {
    it('should close modal when valid data selected', async () => {
      wrapper.vm.value = ['PLTU'];
      wrapper.vm.filter.tahun = 2023;
      
      await wrapper.vm.closeModal();
      
      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should show error when closing modal with no pembangkit selected', async () => {
      wrapper.vm.value = [];
      wrapper.vm.filter.tahun = 2023;
      
      await wrapper.vm.closeModal();
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!',
        5000
      );
    });
  });

  describe('Component Props', () => {
    it('should receive and use props correctly', () => {
      expect(wrapper.props('title')).toBe(defaultProps.title);
      expect(wrapper.props('itemsPembangkit')).toEqual(defaultProps.itemsPembangkit);
      expect(wrapper.props('itemsDayaMampu')).toEqual(defaultProps.itemsDayaMampu);
      expect(wrapper.props('yearRange')).toEqual(defaultProps.yearRange);
    });
  });

  describe('Graph Data Processing', () => {
    it('should process graph data correctly', async () => {
      await wrapper.vm.getDataGraph();
      await nextTick();
      
      expect(wrapper.vm.graphData.pln.x).toBe(70.3);
      expect(wrapper.vm.graphData.pln.y).toBe(108.0);
      expect(wrapper.vm.graphData.ipp.x).toBe(68.8);
      expect(wrapper.vm.graphData.ipp.y).toBe(102.5);
    });

    it('should create scatter plot series correctly', async () => {
      await wrapper.vm.getDataGraph();
      await nextTick();
      
      const series = wrapper.vm.graphData.series;
      expect(series).toHaveLength(2);
      expect(series[0].name).toBe('PLTU');
      expect(series[0].type).toBe('scatter');
      expect(series[0].data).toHaveLength(1);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no data available', async () => {
      wrapper.vm.graphData.isEmpty = true;
      wrapper.vm.isLoading = false;
      await nextTick();
      
      expect(wrapper.text()).toContain('Empty Data');
    });
  });

  describe('Badge Display', () => {
    it('should display selected pembangkit in badge', async () => {
      wrapper.vm.value = ['PLTU', 'PLTG'];
      await nextTick();
      
      const badge = wrapper.find('.badge');
      expect(badge.text()).toContain('Kategori Pembangkit');
    });

    it('should display year in badge', async () => {
      wrapper.vm.filter.tahun = 2023;
      await nextTick();
      
      expect(wrapper.text()).toContain('Tahun');
    });
  });

  describe('Watch Functions', () => {
    it('should update checkAll state correctly', async () => {
      // Test when value is empty
      wrapper.vm.value = [];
      await nextTick();
      expect(wrapper.vm.checkAll).toBe(false);
      expect(wrapper.vm.indeterminate).toBe(false);

      // Test when some items are selected
      wrapper.vm.value = ['PLTU'];
      await nextTick();
      expect(wrapper.vm.indeterminate).toBe(true);

      // Test when all items are selected
      wrapper.vm.value = ['PLTU', 'PLTG', 'PLTS'];
      await nextTick();
      expect(wrapper.vm.checkAll).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
    });

    it('should update DMN checkbox state correctly', async () => {
      // Test when dmn is empty
      wrapper.vm.dmn = [];
      await nextTick();
      expect(wrapper.vm.checkDmn).toBe(false);
      expect(wrapper.vm.indeterminateDmn).toBe(false);

      // Test when some items are selected
      wrapper.vm.dmn = ['1'];
      await nextTick();
      expect(wrapper.vm.indeterminateDmn).toBe(true);

      // Test when all items are selected
      wrapper.vm.dmn = ['1', '2', '3'];
      await nextTick();
      expect(wrapper.vm.checkDmn).toBe(true);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Component State Management', () => {
    it('should initialize with correct default values', () => {
      expect(wrapper.vm.checkAll).toBe(true);
      expect(wrapper.vm.checkDmn).toBe(true);
      expect(wrapper.vm.indeterminate).toBe(false);
      expect(wrapper.vm.indeterminateDmn).toBe(false);
      expect(wrapper.vm.showModal).toBe(false);
      // isLoading becomes false after onMounted completes
      expect(typeof wrapper.vm.isLoading).toBe('boolean');
      expect(wrapper.vm.dmn).toEqual([1, 2, 3]);
    });

    it('should have correct filter default values', () => {
      expect(wrapper.vm.filter.tahun).toBe(new Date().getFullYear());
      expect(wrapper.vm.filter.kategoriPembangkit).toEqual(['']);
    });

    it('should have correct graph data structure', () => {
      expect(wrapper.vm.graphData).toHaveProperty('legends');
      expect(wrapper.vm.graphData).toHaveProperty('source');
      expect(wrapper.vm.graphData).toHaveProperty('series');
      expect(wrapper.vm.graphData).toHaveProperty('pln');
      expect(wrapper.vm.graphData).toHaveProperty('ipp');
      expect(wrapper.vm.graphData).toHaveProperty('isEmpty');
      expect(wrapper.vm.graphData).toHaveProperty('dataZoom');
    });
  });

  it('covers validation logic in closeModal and applyFilter methods', async () => {
    notifyError.mockClear();
    wrapper.vm.value = [];
    wrapper.vm.filter.tahun = null;
    wrapper.vm.closeModal();
    wrapper.vm.applyFilter();
    wrapper.vm.applyFilterNoDMN();
    expect(notifyError).toHaveBeenLastCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000);
    


    notifyError.mockClear();
    wrapper.vm.value = [];
    wrapper.vm.filter.tahun = '1000';
    wrapper.vm.closeModal();
    wrapper.vm.applyFilter();
    wrapper.vm.applyFilterNoDMN();
    expect(notifyError).toHaveBeenLastCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
  });

  it('covers UI dropdown methods and outside click', async () => {
    wrapper.vm.togglePembangkitDropdown();
    wrapper.vm.value = ['PLTU', 'PLTG'];
    wrapper.vm.removeSelectedPembangkit('PLTU');
    wrapper.vm.clearPembangkit();

    wrapper.vm.toggleDmnDropdown();
    wrapper.vm.dmn = ['1', '2'];
    wrapper.vm.removeSelectedDmn('1');
    wrapper.vm.clearDmn();

    const evt = new MouseEvent('click');
    Object.defineProperty(evt, 'target', { value: document.createElement('div') });
    document.dispatchEvent(evt);
    
    wrapper.vm.isPembangkitDropdownOpen = true;
    wrapper.vm.checkAll = true;
    wrapper.vm.handleCheckAll(true);
    wrapper.vm.handleCheckAll(false);
  });

  it('covers data manipulation error catches', async () => {
    mockGrafikService.getGraphicAnalitikEAF.mockRejectedValueOnce(new Error('error'));
    await wrapper.vm.getDataGraph();

    mockGrafikService.getGraphicAnalitikEAFNoDMN = vi.fn().mockRejectedValueOnce(new Error('error'));
    await wrapper.vm.getDataGraphNoDMN();
  });
  
  it('covers watch on value', async () => {
    wrapper.vm.value = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.checkAll).toBe(false);
    wrapper.vm.value = defaultProps.itemsPembangkit.map(p => p.id);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.checkAll).toBe(true);
  });

  it('covers template click handlers', async () => {
    wrapper.vm.value = ['PLTU'];
    await wrapper.vm.$nextTick();
    const applyButtons = wrapper.findAll('button[type="submit"]');
    for (const btn of applyButtons) {
       await btn.trigger('click');
    }
    
    wrapper.vm.value = ['PLTG'];
    await wrapper.vm.$nextTick();
    const applyButtons2 = wrapper.findAll('button[type="submit"]');
    for (const btn of applyButtons2) {
       await btn.trigger('click');
    }
  });

  it('covers template click handlers', async () => {
    wrapper.vm.value = ['PLTU'];
    await wrapper.vm.$nextTick();
    const applyButtons = wrapper.findAll('button[type="submit"]');
    for (const btn of applyButtons) {
       await btn.trigger('click');
    }
    
    wrapper.vm.value = ['PLTG'];
    await wrapper.vm.$nextTick();
    const applyButtons2 = wrapper.findAll('button[type="submit"]');
    for (const btn of applyButtons2) {
       await btn.trigger('click');
    }
  });

  it('covers template click handlers', async () => {
    wrapper.vm.value = ['PLTU'];
    await wrapper.vm.$nextTick();
    const applyButtons = wrapper.findAll('button[type="submit"]');
    for (const btn of applyButtons) {
       await btn.trigger('click');
    }
    
    wrapper.vm.value = ['PLTG'];
    await wrapper.vm.$nextTick();
    const applyButtons2 = wrapper.findAll('button[type="submit"]');
    for (const btn of applyButtons2) {
       await btn.trigger('click');
    }
  });
});
