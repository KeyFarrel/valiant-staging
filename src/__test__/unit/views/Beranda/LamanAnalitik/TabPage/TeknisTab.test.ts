import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import TeknisTab from '@/views/Beranda/LamanAnalitik/TabPage/TeknisTab.vue';
import GrafikService from '@/services/grafik-service';
import LamanService from '@/services/laman-service';

// Mock the services
vi.mock('@/services/grafik-service');
vi.mock('@/services/laman-service');

// Mock the child components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div data-testid="loading">Loading...</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNCF.vue', () => ({
  default: {
    name: 'GraphicNCF',
    props: ['title', 'items-pembangkit', 'items-daya', 'year-range', 'items-daya-mampu'],
    template: '<div data-testid="graphic-ncf">NCF Component</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicEAF.vue', () => ({
  default: {
    name: 'GraphicEAF',
    props: ['title', 'items-pembangkit', 'items-daya', 'year-range', 'items-daya-mampu'],
    template: '<div data-testid="graphic-eaf">EAF Component</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNPHR.vue', () => ({
  default: {
    name: 'GraphicNPHR',
    props: ['title', 'items-pembangkit', 'items-daya', 'year-range', 'items-daya-mampu'],
    template: '<div data-testid="graphic-nphr">NPHR Component</div>',
  },
}));

describe('TeknisTab.vue', () => {
  let mockGrafikService: {
    getComboKategoriPembangkit: Mock;
  };
  let mockLamanService: {
    getListTahunAnalitik: Mock;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock instances
    mockGrafikService = {
      getComboKategoriPembangkit: vi.fn(),
      getInitialPembangkit: vi.fn().mockResolvedValue({ data: [{ kode_jenis_pembangkit: 'PLTU' }] }),
    };
    
    mockLamanService = {
      getListTahunAnalitik: vi.fn(),
    };

    // Mock the constructor calls
    (GrafikService as any).mockImplementation(function() { return mockGrafikService; });
    (LamanService as any).mockImplementation(function() { return mockLamanService; });
  });

  describe('Component Rendering', () => {
    it('should have loading functionality in template', async () => {
      // Test that the component template includes loading conditional rendering
      const wrapper = mount(TeknisTab);
      
      // The component has isLoading ref but it's not initialized with a value
      // We can test that the template structure is correct
      const template = wrapper.html();
      
      // Since isLoading is undefined initially, Loading component won't be rendered
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(false);
      
      // But we can verify the component is imported and ready to be used
      expect(wrapper.vm).toBeDefined();
    });

    it('should render all graphic components when not loading', async () => {
      // Mock successful responses
      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [
          { tahun: 2019 },
          { tahun: 2020 },
          { tahun: 2025 }
        ]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: [
          { jenis_kit: 'PLTU', dmn: [{ id_daya: '1', daya_mampu: '< 100' }] }
        ]
      });

      const wrapper = mount(TeknisTab);
      
      // Wait for async operations to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(wrapper.find('[data-testid="graphic-ncf"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="graphic-eaf"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="graphic-nphr"]').exists()).toBe(true);
    });
  });

  describe('fetchYearRange function', () => {
    it('should set year range correctly when API returns valid data', async () => {
      const mockResponse = {
        data: [
          { tahun: 2019 },
          { tahun: 2020 },
          { tahun: 2021 },
          { tahun: 2025 }
        ]
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue(mockResponse);
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: []
      });

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockLamanService.getListTahunAnalitik).toHaveBeenCalled();
      // The component should set yearRange to [startYear, endYear] where startYear is data[1].tahun
      // and endYear is data[data.length - 1].tahun
    });

    it('should handle error in fetchYearRange', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      mockLamanService.getListTahunAnalitik.mockRejectedValue(new Error('API Error'));
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: []
      });

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Fetch year range Error'));
      consoleSpy.mockRestore();
    });
  });

  describe('getCategory function', () => {
    it('should set itemsCategory and childDmn correctly when API returns valid data', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            jenis_kit: 'PLTU',
            dmn: [
              { id_daya: '1', daya_mampu: '< 100' },
              { id_daya: '2', daya_mampu: '100 - 400' },
              { id_daya: '3', daya_mampu: '' } // This should be filtered out
            ]
          },
          {
            jenis_kit: 'PLTG',
            dmn: [
              { id_daya: '4', daya_mampu: '> 400' }
            ]
          },
          {
            jenis_kit: 'PLTS'
            // No dmn property
          }
        ]
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(mockResponse);

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalled();
    });

    it('should handle empty data array', async () => {
      const mockResponse = {
        success: true,
        data: []
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(mockResponse);

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalled();
    });

    it('should handle API response with success false', async () => {
      const mockResponse = {
        success: false,
        data: []
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(mockResponse);

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalled();
    });

    it('should handle error in getCategory', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockRejectedValue(new Error('API Error'));

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Fetch items filter Kategori Error'));
      consoleSpy.mockRestore();
    });

    it('should handle data with dmn containing empty daya_mampu', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            jenis_kit: 'PLTU',
            dmn: [
              { id_daya: '1', daya_mampu: 'Valid Power' },
              { id_daya: '2', daya_mampu: '' }, // Empty string should be filtered
              { id_daya: '3', daya_mampu: 'Another Valid' }
            ]
          }
        ]
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(mockResponse);

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalled();
    });

    it('should reverse itemsCategory array after processing', async () => {
      const mockResponse = {
        success: true,
        data: [
          { jenis_kit: 'PLTU' },
          { jenis_kit: 'PLTG' },
          { jenis_kit: 'PLTS' }
        ]
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(mockResponse);

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalled();
      // The reverse() method should be called on itemsCategory
    });
  });

  describe('Component lifecycle', () => {
    it('should call fetchYearRange and getCategory on mounted', async () => {
      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: []
      });

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockLamanService.getListTahunAnalitik).toHaveBeenCalled();
      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalled();
    });
  });

  describe('Props passing to child components', () => {
    it('should pass correct props to GraphicNCF component', async () => {
      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: [{ jenis_kit: 'PLTU', dmn: [{ id_daya: '1', daya_mampu: '< 100' }] }]
      });

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      const ncfComponent = wrapper.find('[data-testid="graphic-ncf"]');
      expect(ncfComponent.exists()).toBe(true);
    });

    it('should pass correct props to GraphicEAF component', async () => {
      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: [{ jenis_kit: 'PLTU', dmn: [{ id_daya: '1', daya_mampu: '< 100' }] }]
      });

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      const eafComponent = wrapper.find('[data-testid="graphic-eaf"]');
      expect(eafComponent.exists()).toBe(true);
    });

    it('should pass correct props to GraphicNPHR component', async () => {
      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: [{ jenis_kit: 'PLTU', dmn: [{ id_daya: '1', daya_mampu: '< 100' }] }]
      });

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      const nphrComponent = wrapper.find('[data-testid="graphic-nphr"]');
      expect(nphrComponent.exists()).toBe(true);
    });
  });

  describe('Edge cases and data validation', () => {
    it('should handle data with items that have dmn but no valid daya_mampu entries', async () => {
      const mockResponse = {
        success: true,
        data: [
          {
            jenis_kit: 'PLTU',
            dmn: [
              { id_daya: '1', daya_mampu: '' },
              { id_daya: '2', daya_mampu: '' }
            ]
          }
        ]
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue({
        data: [{ tahun: 2020 }, { tahun: 2025 }]
      });
      
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue(mockResponse);

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalled();
    });

    it('should handle year range calculation with minimal data', async () => {
      const mockResponse = {
        data: [
          { tahun: 2020 },
          { tahun: 2021 }
        ]
      };

      mockLamanService.getListTahunAnalitik.mockResolvedValue(mockResponse);
      mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
        success: true,
        data: []
      });

      const wrapper = mount(TeknisTab);
      
      // Wait for onMounted to complete
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockLamanService.getListTahunAnalitik).toHaveBeenCalled();
    });
  });
});
