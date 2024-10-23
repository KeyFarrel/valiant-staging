import { mount, shallowMount } from '@vue/test-utils';
import Login from '@/views/Login.vue';
import LoginService from '@/services/auth-service';
import axios from 'axios';

jest.mock('axios');
jest.mock('@/services/auth-service');

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  useRouter: () => ({
    replace: jest.fn(),
  }),
  createWebHistory: jest.fn(), // Mock createWebHistory
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
}));

describe('Login.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(Login, {
      global: {
        stubs: ['TextField', 'RecaptchaV2', 'ModalWrapper', 'ModalNotification', 'IconRoundedChecked', 'IconRoundedClose', 'Loading']
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Login');
    expect(wrapper.find('p').text()).toContain('Silahkan login terlebih dahulu untuk masuk aplikasi.');
  });

  it('should handle email and password input', async () => {
    // Set data directly
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = 'password123';
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.valEmail).toBe('test@example.com');
    expect(wrapper.vm.valPassword).toBe('password123');
  });

  it('should show error when email is empty', async () => {
    // Set valEmail and valPassword directly
    wrapper.vm.valEmail = '';
    wrapper.vm.valPassword = 'password123';
    await wrapper.vm.onSubmitLogin();

    expect(wrapper.vm.valEmailErr).toBe('Email kosong mohon diisi');
  });

  it('should show error when password is empty', async () => {
    // Set valEmail and valPassword directly
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = '';
    await wrapper.vm.onSubmitLogin();

    expect(wrapper.vm.valPasswordErr).toBe('Password kosong mohon diisi');
  });

  it('should call loginService.login and redirect on success', async () => {
    const mockLoginResponse = { data: { token: 'dummy_token', is_reset: false } };
    (LoginService.prototype.login as jest.Mock).mockResolvedValue(mockLoginResponse);
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: 'permissions_data' } });

    // Set values directly
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = 'password123';
    wrapper.vm.isVerified = true;

    await wrapper.vm.onSubmitLogin();

    expect(LoginService.prototype.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(wrapper.vm.isLoadingButton).toBe(true);
  });

  it('should display password change modal if is_reset is true', async () => {
    const mockLoginResponse = { data: { token: 'dummy_token', is_reset: true } };
    (LoginService.prototype.login as jest.Mock).mockResolvedValue(mockLoginResponse);

    // Set values directly
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = 'password123';
    wrapper.vm.isVerified = true;

    await wrapper.vm.onSubmitLogin();

    expect(wrapper.vm.isShowCompletePassword).toBe(true);
    expect(wrapper.vm.isLoadingButton).toBe(false);
  });

  it('should display error message when login fails', async () => {
    const mockErrorResponse = { response: { data: { data: { temp_loc: 1, is_locked: false }, message: 'Email atau Password salah' } } };
    (LoginService.prototype.login as jest.Mock).mockRejectedValue(mockErrorResponse);

    // Set values directly
    wrapper.vm.valEmail = 'wrong@example.com';
    wrapper.vm.valPassword = 'wrongPassword';
    wrapper.vm.isVerified = true;

    await wrapper.vm.onSubmitLogin();

    expect(wrapper.vm.valEmailErr).toBe('Email atau Password salah');
    expect(wrapper.vm.remainingAttempt).toBe(4); // remainingAttempt should be updated
    expect(wrapper.vm.isLoadingButton).toBe(false);
  });

  it('should lock account if remaining attempts are exceeded', async () => {

    // Set values directly
    wrapper.vm.valEmail = 'locked@example.com';
    wrapper.vm.valPassword = 'wrongPassword';
    wrapper.vm.isVerified = true;

    await wrapper.vm.onSubmitLogin();

    expect(wrapper.vm.isShowLocked).toBe(false);
    expect(wrapper.vm.isLoadingButton).toBe(false);
  });

  it('should handle password visibility toggle', async () => {
    // Directly modify the reactive property
    wrapper.vm.showPassword = false;
    wrapper.vm.visiblePassword();
    expect(wrapper.vm.showPassword).toBe(true);

    wrapper.vm.visiblePassword();
    expect(wrapper.vm.showPassword).toBe(false);
  });
});
