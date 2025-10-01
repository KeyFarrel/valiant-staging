import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import FinansialTab from '@/views/Beranda/LamanAnalitik/TabPage/FinansialTab.vue';
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

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicRnfa_Ebitda.vue', () => ({
  name: 'GraphicRnfa_Ebitda',
  props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-rnfa-ebitda">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Eaf.vue', () => ({
  name: 'GraphicCapex_Eaf',
  props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-capex-eaf">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Ncf.vue', () => ({
  name: 'GraphicCapex_Ncf',
  props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-capex-ncf">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Efor.vue', () => ({
  name: 'GraphicCapex_Efor',
  props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-capex-efor">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexBd.vue', () => ({
  name: 'GraphicOpexBd',
  props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-opex-bd">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexc_Nphr.vue', () => ({
  name: 'GraphicOpexc_Nphr',
  props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-opexc-nphr">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentA.vue', () => ({
  name: 'GraphicComponentA',
  props: ['title', 'itemsPembangkit', 'itemsDaya', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-component-a">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentBD.vue', () => ({
  name: 'GraphicComponentBD',
  props: ['title', 'itemsPembangkit', 'itemsDaya', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-component-bd">{{title}}</div>',
}));

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentC.vue', () => ({
  name: 'GraphicComponentC',
  props: ['title', 'itemsPembangkit', 'itemsDaya', 'yearRange', 'itemsDayaMampu'],
  template: '<div data-testid="graphic-component-c">{{title}}</div>',
}));

describe('FinansialTab', () => {
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

    // Create mocked service instances
    mockGrafikService = {
      getComboKategoriPembangkit: jest.fn(),
      getFilterDaya: jest.fn(),
    } as any;

    mockLamanService = {
      getListTahunAnalitik: jest.fn(),
    } as any;

    // Mock service constructors
    (GrafikService as jest.MockedClass<typeof GrafikService>).mockImplementation(() => mockGrafikService);
    (LamanService as jest.MockedClass<typeof LamanService>).mockImplementation(() => mockLamanService);

    // Setup default mock responses
    mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(mockCategoryResponse);
    mockGrafikService.getFilterDaya.mockResolvedValue({ success: true });
    mockLamanService.getListTahunAnalitik.mockResolvedValue(mockYearResponse);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = () => {
    return mount(FinansialTab, {
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

    it('should show loading spinner initially', async () => {
      wrapper = createWrapper();
      
      // Wait for onMounted to be called but not for API responses
      await nextTick();
      
      expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true);
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

    it('should call getFilterDaya on mount', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      
      expect(mockGrafikService.getFilterDaya).toHaveBeenCalledTimes(1);
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
      const vm = wrapper.vm;
      expect(vm.isLoading).toBe(false);
      
      consoleSpy.mockRestore();
    });

    it('should handle API error for year range', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLamanService.getListTahunAnalitik.mockRejectedValue(new Error('Year API Error'));
      
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Year Range Error', new Error('Year API Error'));
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Graphic Components Rendering', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
    });

    it('should render GraphicRnfa_Ebitda component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-rnfa-ebitda"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik RNFA - EBITDA MARGIN');
    });

    it('should render GraphicCapex_Eaf component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-capex-eaf"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik CAPEX - EAF');
    });

    it('should render GraphicCapex_Ncf component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-capex-ncf"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik CAPEX - NCF');
    });

    it('should render GraphicCapex_Efor component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-capex-efor"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik CAPEX - EFOR');
    });

    it('should render GraphicOpexBd component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-opex-bd"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik OPEX B+D - Daya Terpasang');
    });

    it('should render GraphicOpexc_Nphr component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-opexc-nphr"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik OPEX C - NPHR');
    });

    it('should render GraphicComponentA component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-component-a"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik Biaya Komponen A');
    });

    it('should render GraphicComponentBD component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-component-bd"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik Biaya Komponen B + D');
    });

    it('should render GraphicComponentC component when data is loaded', () => {
      const component = wrapper.find('[data-testid="graphic-component-c"]');
      expect(component.exists()).toBe(true);
      expect(component.text()).toBe('Grafik Biaya Komponen C');
    });

    it('should render all 9 graphic components', () => {
      const components = [
        '[data-testid="graphic-rnfa-ebitda"]',
        '[data-testid="graphic-capex-eaf"]',
        '[data-testid="graphic-capex-ncf"]',
        '[data-testid="graphic-capex-efor"]',
        '[data-testid="graphic-opex-bd"]',
        '[data-testid="graphic-opexc-nphr"]',
        '[data-testid="graphic-component-a"]',
        '[data-testid="graphic-component-bd"]',
        '[data-testid="graphic-component-c"]',
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

    it('should pass correct props to GraphicRnfa_Ebitda', () => {
      const component = wrapper.findComponent({ name: 'GraphicRnfa_Ebitda' });
      expect(component.props()).toEqual({
        title: 'Grafik RNFA - EBITDA MARGIN',
        itemsPembangkit: wrapper.vm.itemsCategory,
        yearRange: wrapper.vm.yearRange,
        itemsDayaMampu: wrapper.vm.childDmn,
      });
    });

    it('should pass correct props to GraphicCapex_Eaf', () => {
      const component = wrapper.findComponent({ name: 'GraphicCapex_Eaf' });
      expect(component.props()).toEqual({
        title: 'Grafik CAPEX - EAF',
        itemsPembangkit: wrapper.vm.itemsCategory,
        yearRange: wrapper.vm.yearRange,
        itemsDayaMampu: wrapper.vm.childDmn,
      });
    });

    it('should pass correct props to component group (CAPEX)', () => {
      const capexComponents = [
        { name: 'GraphicCapex_Eaf', title: 'Grafik CAPEX - EAF' },
        { name: 'GraphicCapex_Ncf', title: 'Grafik CAPEX - NCF' },
        { name: 'GraphicCapex_Efor', title: 'Grafik CAPEX - EFOR' },
      ];

      capexComponents.forEach(({ name, title }) => {
        const component = wrapper.findComponent({ name });
        expect(component.props()).toEqual({
          title,
          itemsPembangkit: wrapper.vm.itemsCategory,
          yearRange: wrapper.vm.yearRange,
          itemsDayaMampu: wrapper.vm.childDmn,
        });
      });
    });

    it('should pass correct props to component group (Component A, B+D, C)', () => {
      const componentGroups = [
        { name: 'GraphicComponentA', title: 'Grafik Biaya Komponen A' },
        { name: 'GraphicComponentBD', title: 'Grafik Biaya Komponen B + D' },
        { name: 'GraphicComponentC', title: 'Grafik Biaya Komponen C' },
      ];

      componentGroups.forEach(({ name, title }) => {
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
  });

  describe('Conditional Rendering', () => {
    it('should not render graphics when itemsCategory is empty', async () => {
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: [],
      });
      
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.find('[data-testid="graphic-rnfa-ebitda"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="graphic-capex-eaf"]').exists()).toBe(false);
      expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(false);
    });

    it('should render graphics when itemsCategory has data', async () => {
      wrapper = createWrapper();
      await flushPromises();
      await nextTick();
      
      expect(wrapper.find('[data-testid="graphic-rnfa-ebitda"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="graphic-capex-eaf"]').exists()).toBe(true);
    });
  });

  describe('Service Integration', () => {
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

    it('should set loading to false after successful API calls', async () => {
      wrapper = createWrapper();
      
      // Initially loading should be true
      expect(wrapper.vm.isLoading).toBe(true);
      
      await flushPromises();
      await nextTick();
      
      // After API calls complete, loading should be false
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it('should set loading to false even after API error', async () => {
      mockGrafikService.getComboKategoriPembangkit.mockRejectedValue(new Error('API Error'));
      jest.spyOn(console, 'log').mockImplementation();
      
      wrapper = createWrapper();
      
      await flushPromises();
      await nextTick();
      
      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call both fetchYearRange and getCategory on mounted', async () => {
      wrapper = createWrapper();
      
      await flushPromises();
      
      expect(mockLamanService.getListTahunAnalitik).toHaveBeenCalledTimes(1);
      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalledTimes(1);
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
});
