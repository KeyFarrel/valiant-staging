import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FinansialTab from '@/views/Beranda/LamanAnalitik/TabPage/FinansialTab.vue';
import GrafikService from '@/services/grafik-service';
import LamanService from '@/services/laman-service';

// Mock services
vi.mock('@/services/grafik-service');
vi.mock('@/services/laman-service');

// Mock komponen Loading
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div data-testid="loading">Loading...</div>',
  },
}));

// Mock graphic components
vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicRnfa_Ebitda.vue', () => ({
  default: {
    name: 'GraphicRnfa_Ebitda',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
    template: '<div data-testid="graphicrnfa_ebitda">GraphicRnfa_Ebitda</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Eaf.vue', () => ({
  default: {
    name: 'GraphicCapex_Eaf',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
    template: '<div data-testid="graphiccapex_eaf">GraphicCapex_Eaf</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Ncf.vue', () => ({
  default: {
    name: 'GraphicCapex_Ncf',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
    template: '<div data-testid="graphiccapex_ncf">GraphicCapex_Ncf</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Efor.vue', () => ({
  default: {
    name: 'GraphicCapex_Efor',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
    template: '<div data-testid="graphiccapex_efor">GraphicCapex_Efor</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexBd.vue', () => ({
  default: {
    name: 'GraphicOpexBd',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
    template: '<div data-testid="graphicopexbd">GraphicOpexBd</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexc_Nphr.vue', () => ({
  default: {
    name: 'GraphicOpexc_Nphr',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu'],
    template: '<div data-testid="graphicopexc_nphr">GraphicOpexc_Nphr</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentA.vue', () => ({
  default: {
    name: 'GraphicComponentA',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu', 'itemsDaya'],
    template: '<div data-testid="graphiccomponenta">GraphicComponentA</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentBD.vue', () => ({
  default: {
    name: 'GraphicComponentBD',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu', 'itemsDaya'],
    template: '<div data-testid="graphiccomponentbd">GraphicComponentBD</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentC.vue', () => ({
  default: {
    name: 'GraphicComponentC',
    props: ['title', 'itemsPembangkit', 'yearRange', 'itemsDayaMampu', 'itemsDaya'],
    template: '<div data-testid="graphiccomponentc">GraphicComponentC</div>',
  },
}));

describe('FinansialTab.vue', () => {
  let mockGrafikService: any;
  let mockLamanService: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mock services
    mockGrafikService = {
      getComboKategoriPembangkit: vi.fn(),
      getFilterDaya: vi.fn(),
      getInitialPembangkit: vi.fn().mockResolvedValue({ data: [{ kode_jenis_pembangkit: 'PLTU' }] }),
    };
    
    mockLamanService = {
      getListTahunAnalitik: vi.fn(),
    };

    // Mock the service constructors
    vi.mocked(GrafikService).mockImplementation(() => mockGrafikService);
    vi.mocked(LamanService).mockImplementation(() => mockLamanService);
  });

  it('should render component successfully', async () => {
    // Setup mock responses
    mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
      success: true,
      data: []
    });
    mockLamanService.getListTahunAnalitik.mockResolvedValue({
      data: [
        { tahun: 2020 },
        { tahun: 2021 },
        { tahun: 2025 }
      ]
    });

    const wrapper = mount(FinansialTab);
    
    // Wait for async operations
    await wrapper.vm.$nextTick();
    
    // Should render component
    expect(wrapper.exists()).toBe(true);
  });

  it('should fetch year range and category data on mount', async () => {
    // Setup mock responses
    mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
      success: true,
      data: [
        {
          jenis_kit: 'PLTU',
          dmn: [
            { id_daya: '1', daya_mampu: '< 100' },
            { id_daya: '2', daya_mampu: '100 - 400' }
          ]
        },
        {
          jenis_kit: 'PLTG',
          dmn: [
            { id_daya: '3', daya_mampu: '> 400' }
          ]
        }
      ]
    });
    
    mockLamanService.getListTahunAnalitik.mockResolvedValue({
      data: [
        { tahun: 2020 },
        { tahun: 2021 },
        { tahun: 2025 }
      ]
    });

    const wrapper = mount(FinansialTab);
    
    // Wait for async operations
    await wrapper.vm.$nextTick();
    
    // Verify services were called
    expect(mockLamanService.getListTahunAnalitik).toHaveBeenCalled();
    expect(mockGrafikService.getComboKategoriPembangkit).toHaveBeenCalled();
  });

  it('should render graphic components when data is loaded successfully', async () => {
    // Setup mock responses
    mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
      success: true,
      data: [
        {
          jenis_kit: 'PLTU',
          dmn: [
            { id_daya: '1', daya_mampu: '< 100' }
          ]
        }
      ]
    });
    
    mockLamanService.getListTahunAnalitik.mockResolvedValue({
      data: [
        { tahun: 2020 },
        { tahun: 2021 },
        { tahun: 2025 }
      ]
    });

    const wrapper = mount(FinansialTab);
    
    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    
    // Should have graphic components after loading
    expect(wrapper.find('[data-testid="graphicrnfa_ebitda"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="graphiccapex_eaf"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="graphicopexbd"]').exists()).toBe(true);
  });

  it('should handle error when getComboKategoriPembangkit fails', async () => {
    // Setup console.log spy
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Setup mock responses - error for category
    mockGrafikService.getComboKategoriPembangkit.mockRejectedValue(new Error('Category fetch failed'));
    
    mockLamanService.getListTahunAnalitik.mockResolvedValue({
      data: [
        { tahun: 2020 },
        { tahun: 2021 },
        { tahun: 2025 }
      ]
    });

    const wrapper = mount(FinansialTab);
    
    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    
    // Should log error message
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Fetch items filter Kategori Error'));
    
    consoleSpy.mockRestore();
  });

  it('should handle error when getListTahunAnalitik fails', async () => {
    // Setup console.error spy
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Setup mock responses - error for year range
    mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
      success: true,
      data: []
    });
    
    mockLamanService.getListTahunAnalitik.mockRejectedValue(new Error('Year range fetch failed'));

    const wrapper = mount(FinansialTab);
    
    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    
    // Should log error message
    expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Year Range Error', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle empty category data correctly', async () => {
    // Setup mock responses with empty category data
    mockGrafikService.getComboKategoriPembangkit.mockResolvedValue({
      success: true,
      data: []
    });
    
    mockLamanService.getListTahunAnalitik.mockResolvedValue({
      data: [
        { tahun: 2020 },
        { tahun: 2021 },
        { tahun: 2025 }
      ]
    });

    const wrapper = mount(FinansialTab);
    
    // Wait for all async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
    
    // Should not have graphic components when no category data
    expect(wrapper.find('[data-testid="graphicrnfa_ebitda"]').exists()).toBe(false);
  });
});