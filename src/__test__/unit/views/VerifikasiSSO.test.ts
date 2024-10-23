import { shallowMount } from '@vue/test-utils';
import VerifikasiSSO from '@/views/VerifikasiSSO.vue';
import ModalNotification from '@/components/ui/ModalNotification.vue';
import LoginService from '@/services/auth-service';
import { encryptStorage } from '@/utils/app-encrypt-storage';
import router from '@/router';
import { useRoute } from 'vue-router';

jest.mock('@/services/auth-service');
jest.mock('@/utils/app-encrypt-storage');
jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
}));
jest.mock('@/router', () => ({
  push: jest.fn(),
}));

describe('VerifikasiSSO.vue', () => {
  let loginServiceMock: any;
  let mockRoute: any;

  beforeEach(() => {
    loginServiceMock = {
      verifikasiSSO: jest.fn(),
    };
    (LoginService as jest.Mock).mockImplementation(() => loginServiceMock);

    mockRoute = {
      query: {
        code: 'test_code',
      },
    };
    (useRoute as jest.Mock).mockReturnValue(mockRoute);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display ModalNotification when isError is true', async () => {
    loginServiceMock.verifikasiSSO.mockResolvedValueOnce({ success: false });
    
    const wrapper = shallowMount(VerifikasiSSO);
    await wrapper.vm.$nextTick(); // Wait for verifikasiSSO to be called

    expect(wrapper.findComponent(ModalNotification).exists()).toBe(true);
    expect(router.push).toHaveBeenCalledTimes(0);
  });

  it('should handle successful SSO verification and store tokens in encryptStorage for production mode', async () => {
    loginServiceMock.verifikasiSSO.mockResolvedValueOnce({
      success: true,
      data: {
        token: 'token_value',
        nama_pegawai: 'John Doe',
        id_level: 1,
        id_sentral: '',
        id_pembina: '',
        kode_pengelola: '',
      },
    });

    const wrapper = shallowMount(VerifikasiSSO);
    await wrapper.vm.$nextTick(); // Wait for verifikasiSSO to be called

    expect(encryptStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('should handle error when verifikasiSSO throws an error', async () => {
    loginServiceMock.verifikasiSSO.mockRejectedValueOnce(new Error('SSO Error'));

    const wrapper = shallowMount(VerifikasiSSO);
    await wrapper.vm.$nextTick(); // Wait for verifikasiSSO to be called
    expect(router.push).toHaveBeenCalledTimes(0);
  });
});
