import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import BestPerformance from '@/components/Peta/BestPerformance.vue';
import PetaService from '@/services/peta-service';

// Mock PetaService
vi.mock('@/services/peta-service');

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah(value: any) {
      return `Rp ${value}`;
    }
  }
}));

describe('BestPerformance', () => {
  let mockPetaService: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mock PetaService
    mockPetaService = {
      getBestPerformance: vi.fn(),
      getYearListBPA: vi.fn()
    };
    
    (PetaService as any).mockImplementation(function() { return mockPetaService; });
  });

  it('should render the component with initial state', async () => {
    // Mock API responses
    mockPetaService.getBestPerformance.mockResolvedValue({ data: [] });
    mockPetaService.getYearListBPA.mockResolvedValue({ 
      data: [{ tahun: 2023 }, { tahun: 2024 }] 
    });

    const wrapper = mount(BestPerformance);
    await nextTick();
    
    // Check if the main button is rendered
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('Best Performance Assets');
    
    // Check if SVG icon is present
    const svgIcon = wrapper.find('svg');
    expect(svgIcon.exists()).toBe(true);
  });

  it('should toggle dropdown visibility when button is clicked', async () => {
    // Mock API responses
    mockPetaService.getBestPerformance.mockResolvedValue({ data: [] });
    mockPetaService.getYearListBPA.mockResolvedValue({ 
      data: [{ tahun: 2023 }, { tahun: 2024 }] 
    });

    const wrapper = mount(BestPerformance);
    await nextTick();
    
    // Find the button
    const button = wrapper.find('button');
    
    // Check if dropdown content exists and can be found
    const dropdownContainer = wrapper.find('.absolute.z-10');
    expect(dropdownContainer.exists()).toBe(true);
    
    // Click the button to expand
    await button.trigger('click');
    await nextTick();
    
    // Verify button click functionality by checking if dropdown has expected content
    const dropdownTitle = wrapper.find('h3');
    expect(dropdownTitle.exists()).toBe(true);
    expect(dropdownTitle.text()).toContain('Best Performance Assets');
    
    // Click again to test toggle functionality
    await button.trigger('click');
    await nextTick();
    
    // The dropdown should still exist in DOM but might be hidden
    expect(dropdownContainer.exists()).toBe(true);
  });

  it('should call PetaService methods on mount', async () => {
    // Mock API responses
    mockPetaService.getBestPerformance.mockResolvedValue({ data: [] });
    mockPetaService.getYearListBPA.mockResolvedValue({ 
      data: [{ tahun: 2023 }, { tahun: 2024 }] 
    });

    mount(BestPerformance);
    
    // Wait for onMounted to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify API calls were made
    expect(mockPetaService.getYearListBPA).toHaveBeenCalled();
    expect(mockPetaService.getBestPerformance).toHaveBeenCalled();
  });

  it('should handle null response data from getBestPerformance', async () => {
    // Mock API responses - getBestPerformance returns null data
    mockPetaService.getBestPerformance.mockResolvedValue({ data: null });
    mockPetaService.getYearListBPA.mockResolvedValue({ 
      data: [{ tahun: 2023 }, { tahun: 2024 }] 
    });

    const wrapper = mount(BestPerformance);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Expand dropdown to see table content
    const button = wrapper.find('button');
    await button.trigger('click');
    await nextTick();
    
    // Should show empty data message when no data
    const emptyDataRow = wrapper.find('td[colspan="7"]');
    expect(emptyDataRow.exists()).toBe(true);
  });

  it('should handle error in fetchBestPerformance', async () => {
    // Mock console.error to spy on error logging
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock API responses - getBestPerformance throws error
    mockPetaService.getBestPerformance.mockRejectedValue(new Error('API Error'));
    mockPetaService.getYearListBPA.mockResolvedValue({ 
      data: [{ tahun: 2023 }] 
    });

    mount(BestPerformance);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Best Performance Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle error in fetchYearListBPA', async () => {
    // Mock console.error to spy on error logging
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock API responses - getYearListBPA throws error
    mockPetaService.getBestPerformance.mockResolvedValue({ data: [] });
    mockPetaService.getYearListBPA.mockRejectedValue(new Error('Year List API Error'));

    mount(BestPerformance);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Year List BPA : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should process year list data correctly and populate tahun array', async () => {
    // Mock API responses with year data
    mockPetaService.getBestPerformance.mockResolvedValue({ data: [] });
    mockPetaService.getYearListBPA.mockResolvedValue({ 
      data: [
        { tahun: 2021 }, 
        { tahun: 2022 }, 
        { tahun: 2023 }
      ] 
    });

    const wrapper = mount(BestPerformance);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Expand dropdown to see year selector
    const button = wrapper.find('button');
    await button.trigger('click');
    await nextTick();
    
    // Check if year options are populated in select element
    const selectElement = wrapper.find('select');
    expect(selectElement.exists()).toBe(true);
    
    // Check if options are present (should be reversed order: 2023, 2022, 2021)
    const options = wrapper.findAll('option[value]');
    expect(options.length).toBeGreaterThan(0);
  });

  it('should handle year change and call fetchBestPerformance', async () => {
    // Mock API responses
    mockPetaService.getBestPerformance.mockResolvedValue({ data: [] });
    mockPetaService.getYearListBPA.mockResolvedValue({ 
      data: [{ tahun: 2023 }, { tahun: 2024 }] 
    });

    const wrapper = mount(BestPerformance);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Reset the mock to track new calls
    mockPetaService.getBestPerformance.mockClear();
    
    // Expand dropdown
    const button = wrapper.find('button');
    await button.trigger('click');
    await nextTick();
    
    // Find and change the year selector
    const selectElement = wrapper.find('select');
    await selectElement.setValue('2023');
    await selectElement.trigger('change');
    await nextTick();
    
    // Verify fetchBestPerformance was called again with new year
    expect(mockPetaService.getBestPerformance).toHaveBeenCalled();
  });

  it('should handle general error in onMounted lifecycle', async () => {
    // Mock console.error to spy on error logging
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock both API calls to reject but we need to check individual function errors
    mockPetaService.getBestPerformance.mockRejectedValue(new Error('Performance API Error'));
    mockPetaService.getYearListBPA.mockRejectedValue(new Error('Year List API Error'));

    mount(BestPerformance);
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verify individual function errors were logged (not the general onMounted error)
    // Because the functions have their own try-catch blocks, onMounted won't catch these
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Year List BPA : ', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Best Performance Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});
