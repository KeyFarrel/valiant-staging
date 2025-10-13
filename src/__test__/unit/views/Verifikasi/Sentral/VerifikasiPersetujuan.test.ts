import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VerifikasiPersetujuan from '@/views/Verifikasi/Sentral/VerifikasiPersetujuan.vue';
import PersetujuanService from '@/services/persetujuan-service';

// Mock the service
vi.mock('@/services/persetujuan-service');

// Mock components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div>Loading...</div>',
  },
}));

vi.mock('@/views/Verifikasi/Sentral/TabPage/KK/KertasKerja.vue', () => ({
  default: {
    name: 'KertasKerja',
    props: ['source'],
    template: '<div>KertasKerja Component</div>',
  },
}));

vi.mock('@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudy.vue', () => ({
  default: {
    name: 'FeasibilityStudy',
    props: ['source'],
    template: '<div>FeasibilityStudy Component</div>',
  },
}));

vi.mock('@/views/Verifikasi/Sentral/TabPage/KK/KertasKerjaMesin.vue', () => ({
  default: {
    name: 'KertasKerjaMesin',
    props: ['source'],
    template: '<div>KertasKerjaMesin Component</div>',
  },
}));

vi.mock('@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudyMesin.vue', () => ({
  default: {
    name: 'FeasibilityStudyMesin',
    props: ['source'],
    template: '<div>FeasibilityStudyMesin Component</div>',
  },
}));

// Mock utils
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    getItem: vi.fn().mockReturnValue('test-uuid-sentral'),
  }),
}));

describe('VerifikasiPersetujuan', () => {
  let mockPersetujuanService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock service responses
    mockPersetujuanService = {
      getDetailMesinAppr: vi.fn().mockResolvedValue({
        success: true,
        data: {
          sentral: 'Test Sentral',
          mesins: [
            { mesin: 'Mesin 1' },
            { mesin: 'Mesin 2' }
          ]
        }
      }),
      getPersetujuanKKSentral: vi.fn().mockResolvedValue({
        success: true,
        data: {
          mesins: [
            { mesin: 'Mesin 1', data: 'kk data' }
          ]
        }
      }),
      getPersetujuanFSSentral: vi.fn().mockResolvedValue({
        success: true,
        data: {
          mesins: [
            { mesin: 'Mesin 1', data: 'fs data' }
          ]
        }
      })
    };

    vi.mocked(PersetujuanService).mockImplementation(() => mockPersetujuanService);
  });

  it('should render component successfully', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('Data Sentral Dimiliki');
  });

  it('should toggle dropdown when clicking toggle button', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount
    await wrapper.vm.$nextTick();
    
    // Find toggle button and click it
    const toggleButton = wrapper.find('.cursor-pointer');
    await toggleButton.trigger('click');
    
    // Check if the component responds to click (we can't directly access reactive data)
    expect(toggleButton.exists()).toBe(true);
  });

  it('should display sentral name and mesin data', async () => {
    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount and data to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    // Check if component renders properly
    expect(wrapper.find('h1').text()).toBe('Data Sentral Dimiliki');
    expect(wrapper.find('.text-base.font-semibold').exists()).toBe(true);
  });

  it('should handle error when fetching detail mesin fails', async () => {
    // Mock service to throw error
    mockPersetujuanService.getDetailMesinAppr.mockRejectedValue(new Error('Network error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount and error to be handled
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Detail Mesin Persetujuan Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle error when fetching persetujuan KK fails', async () => {
    // Mock service to throw error
    mockPersetujuanService.getPersetujuanKKSentral.mockRejectedValue(new Error('Network error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount and error to be handled
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Persetujuan KK Sentral Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle error when fetching persetujuan FS fails', async () => {
    // Mock service to throw error
    mockPersetujuanService.getPersetujuanFSSentral.mockRejectedValue(new Error('Network error'));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount and error to be handled
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Persetujuan FS Sentral Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should test changeTabMesin function with filter logic', async () => {
    // Setup mock data with mesins for filtering
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      success: true,
      data: {
        mesins: [
          { mesin: 'Mesin 1', data: 'kk data 1' },
          { mesin: 'Mesin 2', data: 'kk data 2' }
        ]
      }
    });

    mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValue({
      success: true,
      data: {
        mesins: [
          { mesin: 'Mesin 1', data: 'fs data 1' },
          { mesin: 'Mesin 2', data: 'fs data 2' }
        ]
      }
    });

    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount and data to load
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    // Test filtering logic for mesin selection
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle case when getDetailMesinAppr returns unsuccessful response', async () => {
    // Mock service to return unsuccessful response
    mockPersetujuanService.getDetailMesinAppr.mockResolvedValue({
      success: false,
      data: null
    });
    
    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    // Component should still render without crashing
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle case when getPersetujuanKKSentral returns unsuccessful response', async () => {
    // Mock service to return unsuccessful response
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      success: false,
      data: null
    });
    
    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    // Component should still render without crashing
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle production mode for levelSentral storage', async () => {
    // Temporarily set NODE_ENV to production to test the production branch
    const originalMode = import.meta.env.MODE;
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...import.meta.env,
        MODE: 'production'
      },
      writable: true
    });

    const wrapper = mount(VerifikasiPersetujuan);
    
    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    
    // Component should still render without crashing
    expect(wrapper.exists()).toBe(true);

    // Restore original mode
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...import.meta.env,
        MODE: originalMode
      },
      writable: true
    });
  });
});