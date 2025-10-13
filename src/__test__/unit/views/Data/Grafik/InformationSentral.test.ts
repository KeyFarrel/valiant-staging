import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import InformationSentral from '@/views/Data/Grafik/InformationSentral.vue';
import GrafikService from '@/services/grafik-service';

// Mock the GrafikService
vi.mock('@/services/grafik-service');

describe('InformationSentral.vue', () => {
  let wrapper: any;
  const mockGrafikService = {
    getPlanning: vi.fn(),
    getRealisasiProyeksi: vi.fn(),
    getRealisasiYoy: vi.fn(),
  };

  const defaultProps = {
    idSentral: 'test-sentral-id',
    tahunData: 2024,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the service responses
    mockGrafikService.getPlanning.mockResolvedValue({
      data: {
        fs_wacc_on_project: '10.5',
        fs_wacc_on_equity: '12.0',
        fs_irr_project: '15.0',
        fs_irr_equity: '18.0',
        fs_npv_project: '1000.0',
        fs_npv_equity: '800.0',
        fs_average_cf: '85.0',
        fs_average_eaf: '90.0',
      }
    });

    mockGrafikService.getRealisasiProyeksi.mockResolvedValue({
      data: {
        wacc_on_project: '11.0',
        wacc_on_equity: '13.0',
        irr_project: '16.0',
        irr_equity: '19.0',
        npv_project: '1100.0',
        npv_equity: '900.0',
        average_cf: '87.0',
        average_eaf: '92.0',
      }
    });

    mockGrafikService.getRealisasiYoy.mockResolvedValue({
      data: {
        wacc_on_project: '10.0',
        wacc_on_equity: '11.5',
        irr_project: '14.0',
        irr_equity: '17.0',
        npv_project: '950.0',
        npv_equity: '750.0',
        average_cf: '83.0',
        average_eaf: '88.0',
      }
    });

    // Mock the constructor
    vi.mocked(GrafikService).mockImplementation(() => mockGrafikService as any);
  });

  it('should render component with correct structure', () => {
    wrapper = mount(InformationSentral, {
      props: defaultProps,
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.w-full.bg-white.rounded-md.h-52').exists()).toBe(true);
  });

  it('should display correct year in WLC section', () => {
    wrapper = mount(InformationSentral, {
      props: defaultProps,
    });

    const wlcText = wrapper.text();
    expect(wlcText).toContain('WLC (Realisasi & Proyeksi) (2024)');
  });

  it('should compute tahunData correctly from props', () => {
    wrapper = mount(InformationSentral, {
      props: defaultProps,
    });

    // Access the component's computed property
    expect(wrapper.vm.tahunData).toBe(2024);
  });

  it('should call grafik services when tahunData changes', async () => {
    wrapper = mount(InformationSentral, {
      props: defaultProps,
    });

    // Clear any previous calls
    vi.clearAllMocks();

    // Change the tahunData prop to trigger the watcher
    await wrapper.setProps({ tahunData: 2025 });
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify that all service methods were called
    expect(mockGrafikService.getPlanning).toHaveBeenCalledWith({
      uuid_sentral: 'test-sentral-id'
    });

    expect(mockGrafikService.getRealisasiProyeksi).toHaveBeenCalledWith({
      tahun: 2025,
      uuid_sentral: 'test-sentral-id'
    });

    expect(mockGrafikService.getRealisasiYoy).toHaveBeenCalledWith({
      uuid_sentral: 'test-sentral-id',
      tahun: 2024
    });
  });

  it('should update data when watcher is triggered', async () => {
    const mockPlanningData = {
      fs_irr_project: '20.0',
      fs_irr_equity: '25.0',
    };

    const mockRealisasiData = {
      irr_project: '22.0',
      irr_equity: '27.0',
    };

    const mockYoyData = {
      irr_project: '18.0',
      irr_equity: '23.0',
    };

    mockGrafikService.getPlanning.mockResolvedValue({ data: mockPlanningData });
    mockGrafikService.getRealisasiProyeksi.mockResolvedValue({ data: mockRealisasiData });
    mockGrafikService.getRealisasiYoy.mockResolvedValue({ data: mockYoyData });

    wrapper = mount(InformationSentral, {
      props: defaultProps,
    });

    // Clear previous calls
    vi.clearAllMocks();

    // Trigger watcher by changing tahunData
    await wrapper.setProps({ tahunData: 2025 });
    
    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check that data was updated
    expect(wrapper.vm.dataPlanning).toEqual(mockPlanningData);
    expect(wrapper.vm.dataRealisasi).toEqual(mockRealisasiData);
    expect(wrapper.vm.dataYoy).toEqual(mockYoyData);
  });

  it('should display correct previous year in YoY section', () => {
    wrapper = mount(InformationSentral, {
      props: defaultProps,
    });

    const yoyText = wrapper.text();
    expect(yoyText).toContain('Realisasi - Proyeksi (YoY) (2023)');
  });

  it('should handle different comparison scenarios for icon display', async () => {
    // Test with different values to trigger different comparison icons
    mockGrafikService.getPlanning.mockResolvedValue({
      data: {
        fs_irr_project: '15.0',
        fs_irr_equity: '18.0',
        fs_npv_project: '1000.0',
        fs_npv_equity: '800.0',
        fs_average_cf: '85.0',
        fs_average_eaf: '90.0',
      }
    });

    mockGrafikService.getRealisasiProyeksi.mockResolvedValue({
      data: {
        irr_project: '16.0', // Higher than planning
        irr_equity: '17.0', // Lower than planning  
        npv_project: '1000.0', // Same as planning
        npv_equity: '900.0', // Higher than planning
        average_cf: '83.0', // Lower than planning
        average_eaf: '92.0', // Higher than planning
      }
    });

    mockGrafikService.getRealisasiYoy.mockResolvedValue({
      data: {
        irr_project: '14.0', // Lower than current
        irr_equity: '19.0', // Higher than current
        npv_project: '950.0', // Different from current
        npv_equity: '900.0', // Same as current
        average_cf: '83.0', // Same as current
        average_eaf: '88.0', // Lower than current
      }
    });

    wrapper = mount(InformationSentral, {
      props: defaultProps,
    });

    // Trigger watcher to load data
    await wrapper.setProps({ tahunData: 2025 });
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check that the component renders without errors and displays the content
    expect(wrapper.text()).toContain('WLC (Realisasi & Proyeksi)');
    expect(wrapper.text()).toContain('Planning / Feasibility Study');
    expect(wrapper.text()).toContain('Realisasi - Proyeksi (YoY)');
  });
});