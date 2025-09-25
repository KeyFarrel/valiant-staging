import { shallowMount } from '@vue/test-utils';
import DetailFS from '@/views/Verifikasi/Sentral/TabPage/FS/DetailFS.vue';

// Mock all dependencies
jest.mock('vue-router', () => ({
  useRoute: jest.fn()
}));

jest.mock('@/services/persetujuan-service', () => {
  return jest.fn().mockImplementation(() => ({
    getPersetujuanFSSentral: jest.fn(),
  }));
});

jest.mock('@/services/helper/encryption', () => ({
  encryptAES: jest.fn().mockResolvedValue('encrypted'),
}));

jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: {
    getItem: jest.fn().mockResolvedValue('mockToken'),
  },
}));

jest.mock('@fingerprintjs/fingerprintjs', () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({
      components: {
        hardwareConcurrency: { value: 4 },
        deviceMemory: { value: 8 },
        platform: { value: "MacIntel" },
        architecture: { value: 64 },
        screenResolution: { value: [1920, 1080] },
        vendor: { value: "Google Inc." },
        vendorFlavors: { value: ["chrome"] },
        colorDepth: { value: 24 },
        canvas: { value: "canvas" },
        webGlBasics: { value: "webgl" },
        timezone: { value: "Asia/Jakarta" },
        touchSupport: { value: { maxTouchPoints: 0 } },
        cookiesEnabled: { value: true },
        localStorage: { value: true },
        sessionStorage: { value: true },
        colorGamut: { value: "srgb" },
        hdr: { value: false },
      },
    }),
  }),
  hashComponents: jest.fn().mockReturnValue("mockFingerprint"),
}));

// Mock UI components
jest.mock('@/components/ui/LoadingSpinner.vue', () => ({
  name: 'Loading',
  template: '<div class="loading">Loading...</div>',
}));

jest.mock('@/components/ui/InfoHeader.vue', () => ({
  name: 'InfoHeader',
  props: {
    namaMesin: String,
    namaPengelola: String,
    namaPembina: String,
    kodeJenisPembangkit: String,
    dayaTerpasang: String,
    dayaMampu: String,
    tahunOperasi: String,
    umurTeknis: String,
    kondisiUnit: String,
  },
  template: '<div class="info-header">InfoHeader</div>',
}));

import { useRoute } from 'vue-router';
import { nextTick } from 'vue';
import PersetujuanService from '@/services/persetujuan-service';

describe('DetailFS.vue', () => {
  let mockPersetujuanService: any;

  beforeEach(() => {
    // Mock route with query parameter
    (useRoute as jest.Mock).mockReturnValue({
      query: { uuid_sentral: '123' }
    });

    // Create a mock instance of PersetujuanService
    mockPersetujuanService = new PersetujuanService();
  });

  it('should render component successfully', async () => {
    // Mock a successful response with full data
    mockPersetujuanService.getPersetujuanFSSentral = jest.fn().mockResolvedValue({
      data: {
        sentral: 'Sentral 1',
        pengelola: 'Pengelola 1',
        pembina: 'Pembina 1',
        jenis_kit: 'Jenis 1',
        daya_terpasang: '1000',
        daya_mampu: '900',
        tahun_operasi: '2020',
        umur_teknis: '15',
        kondisi_unit: 'Baik'
      }
    });

    const wrapper = shallowMount(DetailFS, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should have required reactive properties', async () => {
    const wrapper = shallowMount(DetailFS, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: true,
        },
      },
    });

    expect(wrapper.vm).toHaveProperty('isLoading');
    expect(wrapper.vm).toHaveProperty('approveSentralFS');
  });
});
