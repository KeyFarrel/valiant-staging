import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import InformationMesin from '@/views/Data/Grafik/InformationMesin.vue';

// Mock the services
const mockGrafikService = {
  getPlanningMesin: vi.fn(),
  getRealisasiProyeksiMesin: vi.fn(),
  getRealisasiYoyMesin: vi.fn(),
};

const mockGlobalFormat = {
  formatRupiah: vi.fn((value) => `Rp ${value}`),
};

// Mock the modules
vi.mock('@/services/grafik-service', () => ({
  default: vi.fn(() => mockGrafikService),
}));

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn(() => mockGlobalFormat),
}));

// Mock the components
vi.mock('@/components/Grafik/PoupWacc.vue', () => ({
  default: {
    name: 'PopUp',
    props: ['title', 'content'],
    template: '<div>PopUp Mock</div>',
  },
}));

vi.mock('@/components/icons/FSRedDown.vue', () => ({
  default: { name: 'FSRedDown', template: '<div>FSRedDown</div>' },
}));

vi.mock('@/components/icons/FSGreenUp.vue', () => ({
  default: { name: 'FSGreenUp', template: '<div>FSGreenUp</div>' },
}));

vi.mock('@/components/icons/FSRedSame.vue', () => ({
  default: { name: 'FSRedSame', template: '<div>FSRedSame</div>' },
}));

vi.mock('@/components/icons/YoyRedDown.vue', () => ({
  default: { name: 'YoyRedDown', template: '<div>YoyRedDown</div>' },
}));

vi.mock('@/components/icons/YoyGreenUp.vue', () => ({
  default: { name: 'YoyGreenUp', template: '<div>YoyGreenUp</div>' },
}));

vi.mock('@/components/icons/YoyRedSame.vue', () => ({
  default: { name: 'YoyRedSame', template: '<div>YoyRedSame</div>' },
}));

describe('InformationMesin.vue', () => {
  const mockProps = {
    idMesin: 123,
    tahunData: 2024,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock responses
    mockGrafikService.getPlanningMesin.mockResolvedValue({
      data: {
        fs_wacc_on_project: '10.5',
        fs_wacc_on_equity: '12.0',
        fs_irr_project: '15.2',
        fs_irr_equity: '18.5',
        fs_npv_project: '1000000',
        fs_npv_equity: '750000',
        fs_average_cf: '85.0',
        fs_average_eaf: '90.0',
      },
    });

    mockGrafikService.getRealisasiProyeksiMesin.mockResolvedValue({
      data: {
        wacc_on_project: '11.0',
        wacc_on_equity: '13.0',
        irr_project: '16.0',
        irr_equity: '19.0',
        npv_project: '1100000',
        npv_equity: '800000',
        average_cf: '87.0',
        average_eaf: '92.0',
      },
    });

    mockGrafikService.getRealisasiYoyMesin.mockResolvedValue({
      data: {
        wacc_on_project: '10.8',
        wacc_on_equity: '12.5',
        irr_project: '15.8',
        irr_equity: '18.8',
        npv_project: '1050000',
        npv_equity: '775000',
        average_cf: '86.0',
        average_eaf: '91.0',
      },
    });
  });

  it('should render the component with correct structure', async () => {
    const wrapper = mount(InformationMesin, {
      props: mockProps,
    });

    await nextTick();

    // Check if the three main sections are rendered
    const sections = wrapper.findAll('.bg-white.rounded-md.h-52');
    expect(sections).toHaveLength(3);

    // Check section titles
    expect(wrapper.text()).toContain('Planning / Feasibility Study');
    expect(wrapper.text()).toContain('WLC (Realisasi & Proyeksi) (2024)');
    expect(wrapper.text()).toContain('Realisasi - Proyeksi (YoY) (2023)');
  });

  it('should call all service methods on mount', async () => {
    const wrapper = mount(InformationMesin, {
      props: mockProps,
    });

    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockGrafikService.getPlanningMesin).toHaveBeenCalledWith({
      uuid_mesin: 123,
    });
    expect(mockGrafikService.getRealisasiProyeksiMesin).toHaveBeenCalledWith({
      tahun: 2024,
      uuid_mesin: 123,
    });
    expect(mockGrafikService.getRealisasiYoyMesin).toHaveBeenCalledWith({
      uuid_mesin: 123,
      tahun: 2023,
    });
  });

  it('should update tahunData computed property correctly', async () => {
    const wrapper = mount(InformationMesin, {
      props: mockProps,
    });

    // Test computed property
    expect(wrapper.vm.tahunData).toBe(2024);

    // Test with different props
    await wrapper.setProps({ tahunData: 2025 });
    await nextTick();
    expect(wrapper.vm.tahunData).toBe(2025);
  });
});

// Additional tests to cover uncovered lines
describe('InformationMesin.vue - Additional Coverage Tests', () => {
  const mockProps = {
    idMesin: 123,
    tahunData: 2024,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle service errors gracefully', async () => {
    // Mock service errors
    mockGrafikService.getPlanningMesin.mockRejectedValue(new Error('Planning service error'));
    mockGrafikService.getRealisasiProyeksiMesin.mockRejectedValue(new Error('Realisasi service error'));
    mockGrafikService.getRealisasiYoyMesin.mockRejectedValue(new Error('YoY service error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(InformationMesin, {
      props: mockProps,
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    // Should have called console.error for each failed service
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Planning Mesin Error :', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledTimes(3);

    consoleSpy.mockRestore();
  });

  it('should display NUM when IRR values are empty strings', async () => {
    // Mock empty string responses
    mockGrafikService.getPlanningMesin.mockResolvedValue({
      data: {
        fs_irr_equity: '',
        fs_irr_project: '',
        fs_npv_project: '',
        fs_npv_equity: '',
        fs_average_cf: '',
        fs_average_eaf: '',
      },
    });

    mockGrafikService.getRealisasiProyeksiMesin.mockResolvedValue({
      data: {
        irr_project: '',
        irr_equity: '',
        npv_project: '',
        npv_equity: '',
        average_cf: '',
        average_eaf: '',
      },
    });

    mockGrafikService.getRealisasiYoyMesin.mockResolvedValue({
      data: {
        irr_project: '',
        irr_equity: '',
        npv_project: '',
        npv_equity: '',
        average_cf: '',
        average_eaf: '',
      },
    });

    const wrapper = mount(InformationMesin, {
      props: mockProps,
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    // Check that NUM is displayed for empty values
    expect(wrapper.text()).toContain('NUM');
  });

  it('should handle watch effect when tahunData changes', async () => {
    mockGrafikService.getPlanningMesin.mockResolvedValue({ data: {} });
    mockGrafikService.getRealisasiProyeksiMesin.mockResolvedValue({ data: {} });
    mockGrafikService.getRealisasiYoyMesin.mockResolvedValue({ data: {} });

    const wrapper = mount(InformationMesin, {
      props: mockProps,
    });

    // Wait for initial mount
    await new Promise(resolve => setTimeout(resolve, 100));
    vi.clearAllMocks();

    // Change tahunData prop
    await wrapper.setProps({ tahunData: 2025 });
    await new Promise(resolve => setTimeout(resolve, 100));

    // Should have called services again due to watch
    expect(mockGrafikService.getPlanningMesin).toHaveBeenCalled();
    expect(mockGrafikService.getRealisasiProyeksiMesin).toHaveBeenCalledWith({
      tahun: 2025,
      uuid_mesin: 123,
    });
    expect(mockGrafikService.getRealisasiYoyMesin).toHaveBeenCalledWith({
      uuid_mesin: 123,
      tahun: 2024, // tahunData - 1
    });
  });

  it('should render conditional icons based on comparison values', async () => {
    // Mock data to trigger different icon conditions
    mockGrafikService.getPlanningMesin.mockResolvedValue({
      data: {
        fs_irr_project: '15.0',
        fs_irr_equity: '18.0',
        fs_npv_project: '1000000',
        fs_npv_equity: '750000',
        fs_average_cf: '85.0',
        fs_average_eaf: '90.0',
      },
    });

    mockGrafikService.getRealisasiProyeksiMesin.mockResolvedValue({
      data: {
        irr_project: '16.0', // Greater than planning (15.0)
        irr_equity: '17.0',  // Less than planning (18.0)
        npv_project: '1000000', // Equal to planning
        npv_equity: '800000',
        average_cf: '87.0',
        average_eaf: '92.0',
      },
    });

    mockGrafikService.getRealisasiYoyMesin.mockResolvedValue({
      data: {
        irr_project: '15.5',
        irr_equity: '17.5',
        npv_project: '950000',
        npv_equity: '750000',
        average_cf: '86.0',
        average_eaf: '91.0',
      },
    });

    const wrapper = mount(InformationMesin, {
      props: mockProps,
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    // Should render the component with icons
    expect(wrapper.findComponent({ name: 'FSGreenUp' })).toBeTruthy();
    expect(wrapper.findComponent({ name: 'FSRedDown' })).toBeTruthy();
    expect(wrapper.findComponent({ name: 'YoyGreenUp' })).toBeTruthy();
  });

  it('should format values correctly using globalFormat', async () => {
    mockGlobalFormat.formatRupiah.mockReturnValue('Rp 15.5');

    mockGrafikService.getPlanningMesin.mockResolvedValue({
      data: {
        fs_irr_project: '15.5',
        fs_wacc_on_project: '10.0',
      },
    });

    mockGrafikService.getRealisasiProyeksiMesin.mockResolvedValue({
      data: {
        irr_project: '16.0',
        wacc_on_project: '11.0',
      },
    });

    mockGrafikService.getRealisasiYoyMesin.mockResolvedValue({
      data: {
        irr_project: '15.8',
        wacc_on_project: '10.5',
      },
    });

    const wrapper = mount(InformationMesin, {
      props: mockProps,
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    // Should have called formatRupiah function
    expect(mockGlobalFormat.formatRupiah).toHaveBeenCalled();
  });
});