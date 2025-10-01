import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import TeknisTab from '@/views/Beranda/LamanAnalitik/TabPage/TeknisTab.vue';
import GrafikService from '@/services/grafik-service';
import LamanService from '@/services/laman-service';

// Mock services
jest.mock('@/services/grafik-service');
jest.mock('@/services/laman-service');

// Mock child components
jest.mock('@/components/ui/LoadingSpinner.vue', () => ({
  name: 'Loading',
  template: '<div data-testid="loading-spinner">Loading...</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNCF.vue', () => ({
  name: 'GraphicNCF',
  props: ['title', 'itemsPembangkit', 'itemsDaya', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-ncf">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicEAF.vue', () => ({
  name: 'GraphicEAF',
  props: ['title', 'itemsPembangkit', 'itemsDaya', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-eaf">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNPHR.vue', () => ({
  name: 'GraphicNPHR',
  props: ['title', 'itemsPembangkit', 'itemsDaya', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-nphr">{{title}}</div>',
}));

describe('TeknisTab', () => {
  let wrapper: any;
  let mockGrafikService: jest.Mocked<GrafikService>;
  let mockLamanService: jest.Mocked<LamanService>;

  const mockCategoryResponse = {
    success: true,
    data: [
      {
        jenis_kit: 'PLTU',
        dmn: [
          { id_daya: '1', daya_mampu: '600 MW' },
          { id_daya: '2', daya_mampu: '400 MW' },
        ],
      },
      {
        jenis_kit: 'PLTG',
        dmn: [
          { id_daya: '3', daya_mampu: '300 MW' },
        ],
      },
      {
        jenis_kit: 'PLTA',
        dmn: [],
      },
    ],
  };

  const mockYearResponse = {
    data: [
      { tahun: 2018 },
      { tahun: 2019 },
      { tahun: 2020 },
      { tahun: 2021 },
      { tahun: 2022 },
    ],
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock console.log to avoid console output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});

    // Create mocked service instances
    mockGrafikService = {
      getComboKategoriPembangkit: jest.fn(),
    } as any;

    mockLamanService = {
      getListTahunAnalitik: jest.fn(),
    } as any;

    // Mock service constructors
    (GrafikService as jest.MockedClass<typeof GrafikService>).mockImplementation(() => mockGrafikService);
    (LamanService as jest.MockedClass<typeof LamanService>).mockImplementation(() => mockLamanService);

    // Setup default mock responses
    mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(mockCategoryResponse);
    mockLamanService.getListTahunAnalitik.mockResolvedValue(mockYearResponse);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    // Restore console.log
    jest.restoreAllMocks();
  });

  const createWrapper = () => {
    return mount(TeknisTab, {
      global: {
        stubs: {
          Loading: { template: '<div data-testid="loading-spinner">Loading...</div>' },
        },
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render component successfully', () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('should not show loading spinner (isLoading not managed in TeknisTab)', async () => {
      wrapper = createWrapper();
      
      // Wait for onMounted to be called but not for API responses
      await nextTick();
      
      // TeknisTab doesn't manage loading state like FinansialTab
      expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(false);
    });

    it('should hide loading after data is loaded', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(false);
    });
  });

  describe('Data Fetching', () => {
    it('should call getComboKategoriPembangkit on mount', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      
      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalledTimes(1);
    });

    it('should call getListTahunAnalitik on mount', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      
      expect(mockLamanService.getListTahunAnalitik).toHaveBeenCalledTimes(1);
    });

    it('should process category data correctly', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.itemsCategory).toHaveLength(3);
      expect(vm.itemsCategory[0]).toEqual({ id: 'PLTA', name: 'PLTA' });
      expect(vm.itemsCategory[1]).toEqual({ id: 'PLTG', name: 'PLTG' });
      expect(vm.itemsCategory[2]).toEqual({ id: 'PLTU', name: 'PLTU' });
    });

    it('should process childDmn data correctly', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.childDmn).toHaveLength(3);
      expect(vm.childDmn).toContainEqual({ id: '1', name: 'PLTU 600 MW' });
      expect(vm.childDmn).toContainEqual({ id: '2', name: 'PLTU 400 MW' });
      expect(vm.childDmn).toContainEqual({ id: '3', name: 'PLTU 300 MW' });
    });

    it('should process year range correctly', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.yearRange).toEqual([2019, 2022]);
    });

    it('should handle empty category response', async () => {
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: [],
      });
      
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.itemsCategory).toHaveLength(0);
      expect(vm.childDmn).toHaveLength(0);
    });

    it('should handle API error for category', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockGrafikService.getComboKategoriPembangkit.mockRejectedValue(new Error('API Error'));
      
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      expect(consoleSpy).toHaveBeenCalledWith('Fetch items filter Kategori Error : Error: API Error');
      
      consoleSpy.mockRestore();
    });

    it('should handle API error for year range', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockLamanService.getListTahunAnalitik.mockRejectedValue(new Error('Year API Error'));
      
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      expect(consoleSpy).toHaveBeenCalledWith('Fetch year range Error : Error: Year API Error');
      
      consoleSpy.mockRestore();
    });

    it('should log year range to console', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      expect(consoleSpy).toHaveBeenCalledWith([2019, 2022]);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Graphic Components Rendering', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
    });

    it('should render GraphicNCF component', () => {
      const component = wrapper.find('[data-testid="graphic-ncf"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik Net Capacity Factor (NCF)');
    });

    it('should render GraphicEAF component', () => {
      const component = wrapper.find('[data-testid="graphic-eaf"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik Equivalent Availability Factor (EAF)');
    });

    it('should render GraphicNPHR component', () => {
      const component = wrapper.find('[data-testid="graphic-nphr"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik Net Plant Heat Rate (NPHR)');
    });

    it('should render all 3 technical graphic components', () => {
      const components = [
        '[data-testid="graphic-ncf"]',
        '[data-testid="graphic-eaf"]',
        '[data-testid="graphic-nphr"]',
      ];

      components.forEach(selector => {
        expect(wrapper.find(selector).exists()).toBe(true);
      });
    });
  });

  describe('Props Passing to Child Components', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
    });

    it('should pass correct props to GraphicNCF', () => {
      const component = wrapper.findComponent({ name: 'GraphicNCF' });
      expect(component.props()).toEqual({
        title: 'Grafik Net Capacity Factor (NCF)',
        itemsPembangkit: wrapper.vm.itemsCategory,
        itemsDaya: wrapper.vm.itemsDaya,
        yearRange: wrapper.vm.yearRange,
        itemsDayaMampu: wrapper.vm.childDmn,
      });
    });

    it('should pass correct props to GraphicEAF', () => {
      const component = wrapper.findComponent({ name: 'GraphicEAF' });
      expect(component.props()).toEqual({
        title: 'Grafik Equivalent Availability Factor (EAF)',
        itemsPembangkit: wrapper.vm.itemsCategory,
        itemsDaya: wrapper.vm.itemsDaya,
        yearRange: wrapper.vm.yearRange,
        itemsDayaMampu: wrapper.vm.childDmn,
      });
    });

    it('should pass correct props to GraphicNPHR', () => {
      const component = wrapper.findComponent({ name: 'GraphicNPHR' });
      expect(component.props()).toEqual({
        title: 'Grafik Net Plant Heat Rate (NPHR)',
        itemsPembangkit: wrapper.vm.itemsCategory,
        itemsDaya: wrapper.vm.itemsDaya,
        yearRange: wrapper.vm.yearRange,
        itemsDayaMampu: wrapper.vm.childDmn,
      });
    });

    it('should pass correct props to all technical components', () => {
      const technicalComponents = [
        { name: 'GraphicNCF', title: 'Grafik Net Capacity Factor (NCF)' },
        { name: 'GraphicEAF', title: 'Grafik Equivalent Availability Factor (EAF)' },
        { name: 'GraphicNPHR', title: 'Grafik Net Plant Heat Rate (NPHR)' },
      ];

      technicalComponents.forEach(({ name, title }) => {
        const component = wrapper.findComponent({ name });
        expect(component.props()).toEqual({
          title,
          itemsPembangkit: wrapper.vm.itemsCategory,
          itemsDaya: wrapper.vm.itemsDaya,
          yearRange: wrapper.vm.yearRange,
          itemsDayaMampu: wrapper.vm.childDmn,
        });
      });
    });
  });

  describe('Data Processing Logic', () => {
    it('should filter out empty daya_mampu values', async () => {
      const categoryWithEmptyDaya = {
        success: true,
        data: [
          {
            jenis_kit: 'PLTU',
            dmn: [
              { id_daya: '1', daya_mampu: '600 MW' },
              { id_daya: '2', daya_mampu: '' }, // Empty value should be filtered
              { id_daya: '3', daya_mampu: '400 MW' },
            ],
          },
        ],
      };

      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(categoryWithEmptyDaya);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.childDmn).toHaveLength(2);
      expect(vm.childDmn).toContainEqual({ id: '1', name: 'PLTU 600 MW' });
      expect(vm.childDmn).toContainEqual({ id: '3', name: 'PLTU 400 MW' });
    });

    it('should reverse itemsCategory array', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      // Original order in mock: PLTU, PLTG, PLTA
      // After reverse: PLTA, PLTG, PLTU
      expect(vm.itemsCategory[0].id).toBe('PLTA');
      expect(vm.itemsCategory[1].id).toBe('PLTG');
      expect(vm.itemsCategory[2].id).toBe('PLTU');
    });

    it('should handle categories without dmn property', async () => {
      const categoryWithoutDmn = {
        success: true,
        data: [
          {
            jenis_kit: 'PLTU',
            // No dmn property
          },
        ],
      };

      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(categoryWithoutDmn);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.itemsCategory).toHaveLength(1);
      expect(vm.childDmn).toHaveLength(0);
    });

    it('should handle unsuccessful API response', async () => {
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: false,
        data: [],
      });
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.itemsCategory).toHaveLength(0);
    });
  });

  describe('Conditional Rendering', () => {
    it('should always render graphics components when mounted', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.find('[data-testid="graphic-ncf"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="graphic-eaf"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="graphic-nphr"]').exists()).toBe(true);
    });

    it('should render graphics even when itemsCategory is empty', async () => {
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: [],
      });
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      // Unlike FinansialTab, TeknisTab always renders components
      expect(wrapper.find('[data-testid="graphic-ncf"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="graphic-eaf"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="graphic-nphr"]').exists()).toBe(true);
    });
  });

  describe('Service Integration', () => {
    it('should handle successful API responses', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.itemsCategory.length).toBeGreaterThan(0);
      expect(vm.childDmn.length).toBeGreaterThan(0);
      expect(vm.yearRange.length).toBe(2);
    });

    it('should handle API errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockGrafikService.getComboKategoriPembangkit.mockRejectedValue(new Error('Network Error'));
      mockLamanService.getListTahunAnalitik.mockRejectedValue(new Error('Year Error'));
      
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      expect(consoleSpy).toHaveBeenCalledWith('Fetch items filter Kategori Error : Error: Network Error');
      expect(consoleSpy).toHaveBeenCalledWith('Fetch year range Error : Error: Year Error');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call both fetchYearRange and getCategory on mounted', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      
      expect(mockLamanService.getListTahunAnalitik).toHaveBeenCalledTimes(1);
      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalledTimes(1);
    });

    it('should execute async onMounted correctly', async () => {
      const yearSpy = jest.spyOn(mockLamanService, 'getListTahunAnalitik');
      const categorySpy = jest.spyOn(mockGrafikService, 'getComboKategoriPembangkit');
      
      wrapper = createWrapper();
      
      await flushPromises();
      
      expect(yearSpy).toHaveBeenCalled();
      expect(categorySpy).toHaveBeenCalled();
    });
  });

  describe('Reactive Data', () => {
    it('should initialize with correct default values', () => {
      wrapper = createWrapper();
      
      const vm = wrapper.vm;
      expect(vm.itemsCategory).toEqual([]);
      expect(vm.itemsDaya).toEqual([]);
      expect(vm.itemsDmn).toEqual([]);
      expect(vm.childDmn).toEqual([]);
      expect(vm.yearRange).toEqual([]);
      expect(vm.isLoading).toBeUndefined(); // isLoading starts as undefined
    });

    it('should update reactive data after API calls', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.itemsCategory.length).toBeGreaterThan(0);
      expect(vm.childDmn.length).toBeGreaterThan(0);
      expect(vm.yearRange.length).toBe(2);
    });
  });

  describe('Year Range Processing', () => {
    it('should calculate year range from second to last element', async () => {
      const customYearResponse = {
        data: [
          { tahun: 2017 }, // Index 0 - not used
          { tahun: 2018 }, // Index 1 - start year
          { tahun: 2019 },
          { tahun: 2020 },
          { tahun: 2021 }, // Last index - end year
        ],
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue(customYearResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.yearRange).toEqual([2018, 2021]);
    });

    it('should handle year range with minimum data', async () => {
      const minYearResponse = {
        data: [
          { tahun: 2020 },
          { tahun: 2021 },
        ],
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue(minYearResponse);
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      const vm = wrapper.vm;
      expect(vm.yearRange).toEqual([2021, 2021]);
    });
  });

  describe('Component Structure', () => {
    it('should have correct component structure for technical analysis', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      // Should contain exactly 3 technical components
      const ncfComponent = wrapper.findComponent({ name: 'GraphicNCF' });
      const eafComponent = wrapper.findComponent({ name: 'GraphicEAF' });
      const nphrComponent = wrapper.findComponent({ name: 'GraphicNPHR' });
      
      expect(ncfComponent.exists()).toBe(true);
      expect(eafComponent.exists()).toBe(true);
      expect(nphrComponent.exists()).toBe(true);
    });

    it('should maintain component order: NCF, EAF, NPHR', () => {
      wrapper = createWrapper();
      
      const componentOrder = wrapper.findAll('[data-testid^="graphic-"]');
      expect(componentOrder[0].attributes('data-testid')).toBe('graphic-ncf');
      expect(componentOrder[1].attributes('data-testid')).toBe('graphic-eaf');
      expect(componentOrder[2].attributes('data-testid')).toBe('graphic-nphr');
    });
  });

  describe('Error Resilience', () => {
    it('should handle partial data corruption gracefully', async () => {
      const corruptedResponse = {
        success: true,
        data: [
          {
            jenis_kit: 'PLTU',
            dmn: [
              { id_daya: '1', daya_mampu: '600 MW' },
              { id_daya: null, daya_mampu: '400 MW' }, // null id_daya
              { daya_mampu: '300 MW' }, // missing id_daya
            ],
          },
          {
            jenis_kit: null, // null jenis_kit
            dmn: [
              { id_daya: '4', daya_mampu: '200 MW' },
            ],
          },
        ],
      };

      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(corruptedResponse);
      
      expect(() => {
        wrapper = createWrapper();
      }).not.toThrow();
      
      await flushPromises();
      await nextTick();
      
      // Should still process valid data
      const vm = wrapper.vm;
      expect(vm.itemsCategory.length).toBeGreaterThan(0);
    });
  });
});
