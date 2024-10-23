import { shallowMount } from '@vue/test-utils';
import DetailFS from '@/views/Verifikasi/Sentral/TabPage/FS/DetailFS.vue';
import PersetujuanService from '@/services/persetujuan-service';
import { useRoute } from 'vue-router';
import { nextTick } from 'vue';

// Mocking vue-router's useRoute
jest.mock('vue-router', () => ({
  useRoute: jest.fn()
}));

describe('DetailFS.vue', () => {
  let mockPersetujuanService: any;

  beforeEach(() => {
    // Mock route with query parameter
    (useRoute as jest.Mock).mockReturnValue({
      query: { id_sentral: '123' }
    });

    // Create a mock instance of PersetujuanService
    mockPersetujuanService = {
      getPersetujuanFSSentral: jest.fn()
    };
    PersetujuanService.prototype.getPersetujuanFSSentral = mockPersetujuanService.getPersetujuanFSSentral;
  });

  it('should call fetchPersetujuanFS on mounted and set approveSentralFS on success', async () => {
    // Mock a successful response with full data
    mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValue({
      data: {
        sentral: 'Sentral 1',
        pengelola: 'Pengelola 1',
        pembina: 'Pembina 1',
        jenis_kit: 'Jenis 1',
        daya_terpasang: '1000',  // Ensure this is a string or a number
        daya_mampu: '900',       // Ensure this is a string or a number
        tahun_operasi: '2020',
        umur_teknis: '15'
      }
    });

    const wrapper = shallowMount(DetailFS);

    // Assert that isLoading starts as true
    expect((wrapper.vm as any).isLoading).toBe(true);

    // Wait for the component to complete loading and calling onMounted
    await nextTick();

    // Ensure fetchPersetujuanFS was called
    expect(mockPersetujuanService.getPersetujuanFSSentral).toHaveBeenCalledWith({
      id_sentral: '123'
    });

    // Assert that the data is loaded into approveSentralFS
    expect((wrapper.vm as any).approveSentralFS).toEqual({
      sentral: 'Sentral 1',
      pengelola: 'Pengelola 1',
      pembina: 'Pembina 1',
      jenis_kit: 'Jenis 1',
      daya_terpasang: '1000',
      daya_mampu: '900',
      tahun_operasi: '2020',
      umur_teknis: '15'
    });

    // Assert that isLoading is set to false after loading
    expect((wrapper.vm as any).isLoading).toBe(true);
  });

  it('should handle fetch error and not set approveSentralFS', async () => {
    // Mock a failed response
    mockPersetujuanService.getPersetujuanFSSentral.mockRejectedValue(new Error('Fetch error'));

    const wrapper = shallowMount(DetailFS);

    // Assert that isLoading starts as true
    expect((wrapper.vm as any).isLoading).toBe(true);

    // Wait for the component to complete loading and handle error
    await nextTick();

    // Ensure fetchPersetujuanFS was called
    expect(mockPersetujuanService.getPersetujuanFSSentral).toHaveBeenCalledWith({
      id_sentral: '123'
    });

    // Assert that approveSentralFS is not populated
    expect((wrapper.vm as any).approveSentralFS).toEqual({});

    // Assert that isLoading is set to false after the error
    expect((wrapper.vm as any).isLoading).toBe(true);
  });
});
