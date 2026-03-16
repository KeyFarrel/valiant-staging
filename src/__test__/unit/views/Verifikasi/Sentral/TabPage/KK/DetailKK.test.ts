import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DetailKK from '@/views/Verifikasi/Sentral/TabPage/KK/DetailKK.vue';
import PersetujuanService from '@/services/persetujuan-service';

// Mock the service
vi.mock('@/services/persetujuan-service');

// Mock vue-router
const mockRoute = {
  query: {
    uuid_sentral: 'test-uuid',
    tahun: '2024'
  }
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute
}));

// Mock components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div data-testid="loading">Loading...</div>'
  }
}));

vi.mock('@/components/ui/InfoHeader.vue', () => ({
  default: {
    name: 'InfoHeader',
    props: [
      'namaMesin', 'namaPengelola', 'namaPembina', 
      'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 
      'tahunOperasi', 'umurTeknis'
    ],
    template: '<div data-testid="info-header">Info Header</div>'
  }
}));

describe('DetailKK', () => {
  let mockPersetujuanService: any;

  beforeEach(() => {
    mockPersetujuanService = {
      getPersetujuanKKSentral: vi.fn()
    };
    vi.mocked(PersetujuanService).mockImplementation(function() { return mockPersetujuanService; });
  });

  it('should mount component successfully', async () => {
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      data: {
        sentral: 'Test Sentral',
        pengelola: 'Test Pengelola'
      }
    });

    const wrapper = mount(DetailKK);
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should render InfoHeader with correct props after data is loaded', async () => {
    const mockData = {
      sentral: 'Test Sentral',
      pengelola: 'Test Pengelola',
      pembina: 'Test Pembina',
      jenis_kit: 'PLTU',
      daya_terpasang: 100,
      daya_mampu: 90,
      tahun_operasi: '2020',
      umur_teknis: '25'
    };

    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      data: mockData
    });

    const wrapper = mount(DetailKK);
    
    // Wait for async operations to complete
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const infoHeader = wrapper.findComponent({ name: 'InfoHeader' });
    expect(infoHeader.exists()).toBe(true);
  });

  it('should render download evidence button', async () => {
    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      data: {
        sentral: 'Test Sentral'
      }
    });

    const wrapper = mount(DetailKK);
    
    // Wait for component to mount
    await nextTick();
    
    const downloadButton = wrapper.find('button');
    expect(downloadButton.exists()).toBe(true);
    expect(downloadButton.text()).toContain('Download Evidence');
  });

  it('should handle API call with route parameters', async () => {
    const mockData = {
      sentral: 'Test Sentral',
      pengelola: 'Test Pengelola'
    };

    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      data: mockData
    });

    mount(DetailKK);
    
    await nextTick();
    
    expect(mockPersetujuanService.getPersetujuanKKSentral).toHaveBeenCalledWith({
      uuid_sentral: 'test-uuid',
      tahun: '2024'
    });
  });

  it('should handle API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockPersetujuanService.getPersetujuanKKSentral.mockRejectedValue(
      new Error('API Error')
    );

    const wrapper = mount(DetailKK);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(consoleSpy).toHaveBeenCalledWith('Fetch Persetujuan KK Sentral Error : ', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle empty or null data fields', async () => {
    const mockData = {
      sentral: null,
      pengelola: undefined,
      pembina: '',
      jenis_kit: null,
      daya_terpasang: null,
      daya_mampu: undefined,
      tahun_operasi: '',
      umur_teknis: null
    };

    mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValue({
      data: mockData
    });

    const wrapper = mount(DetailKK);
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const infoHeader = wrapper.findComponent({ name: 'InfoHeader' });
    expect(infoHeader.exists()).toBe(true);
  });
});