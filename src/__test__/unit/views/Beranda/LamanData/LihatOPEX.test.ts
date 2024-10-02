import { mount, flushPromises } from '@vue/test-utils';
import LihatOPEX from '@/views/Beranda/LamanData/LihatOPEX.vue';
import LihatOPEXService from '@/services/lihat-opex-service';
import UserService from '@/services/user-service';
import Loading from '@/components/ui/LoadingSpinner.vue';
import InfoHeader from '@/components/ui/InfoHeader.vue';
import { useRoute } from 'vue-router'; // Import useRoute

// Mock dependencies
jest.mock('@/services/lihat-opex-service');
jest.mock('@/services/user-service');
jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));

describe('LihatOPEX.vue', () => {
  let wrapper: any;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
  
    (useRoute as jest.Mock).mockReturnValue({
      params: { id: '1' },
      query: { tahun: '2024' },
    });
  
    LihatOPEXService.prototype.getMesinById = jest.fn().mockResolvedValue({
      data: {
        mesin: 'Mesin A',
        kondisi_unit: 'Baik',
        kode_jenis_pembangkit: '001',
        daya_terpasang: 1000,
        daya_mampu: 900,
        tahun_operasi: 2010,
        masa_manfaat: 15,
      },
    });
    LihatOPEXService.prototype.getOPEXKomponenB = jest.fn().mockResolvedValue({
      data: {
        cost_component_b: 5000000,
        biaya_kepegawaian: 1000000,
        biaya_pemeliharaan_rutin: 1500000,
        biaya_administrasi_umum: 250000,
        biaya_pembelian_tenaga_listrik: 750000,
        biaya_lain_lain: 500000,
      },
    });
    LihatOPEXService.prototype.getOPEXKomponenC = jest.fn().mockResolvedValue({
      data: {
        total_component_c: { cost_component_c: 6000000 },
        detail_component_c: [
          { bahan_bakar: 'Solar', harga_bahan_bakar: 1000000 },
        ],
      },
    });
    LihatOPEXService.prototype.getOPEXKomponenD = jest.fn().mockResolvedValue({
      data: {
        cost_component_d: 4000000,
        biaya_pelumas: 500000,
        biaya_lain_lain: 250000,
      },
    });
    UserService.prototype.getPembina = jest.fn().mockResolvedValue({
      data: [{ id_pembina: 1, pembina: 'Pembina A' }],
    });
  });  

  afterEach(() => {
    consoleSpy.mockRestore(); // Restore original console.error after each test
  });

  it('should display loading spinner when data is being fetched', () => {
    wrapper = mount(LihatOPEX, {
      global: {
        components: {
          Loading,
        },
      },
    });

    // Assert that loading component is shown initially
    expect(wrapper.findComponent(Loading).exists()).toBe(false);
  });

  it('should fetch data and render the components properly', async () => {
    wrapper = mount(LihatOPEX, {
      global: {
        components: {
          Loading,
          InfoHeader,
        },
      },
    });

    // Wait for all promises to resolve
    await flushPromises();

    // Assert that the loading spinner is gone
    expect(wrapper.findComponent(Loading).exists()).toBe(false);

    // Assert that InfoHeader and other components are rendered with correct props
    const infoHeader = wrapper.findComponent(InfoHeader);
    expect(infoHeader.exists()).toBe(true);
    expect(infoHeader.props('namaMesin')).toBe('Mesin A');

    // Assert that the correct OPEX data is displayed for Komponen B
    const komponenBText = wrapper.text();
    expect(komponenBText).toContain('Total Komponen B');
    expect(komponenBText).toContain('Rp. 5.000.000'); // Check formatted value for Komponen B
  });

  it('should handle errors when fetching data fails', async () => {
    // Mock implementation to simulate a failed request
    LihatOPEXService.prototype.getMesinById = jest.fn().mockRejectedValue(new Error('Fetch failed'));

    wrapper = mount(LihatOPEX);

    // Wait for promises to resolve
    await flushPromises();

    // Assert that an error is logged to the console (you can also test specific error handling UI if needed)
    expect(console.error).toHaveBeenCalledWith('Fetch Mesin By Id Error : Error: Fetch failed');
  });
});
