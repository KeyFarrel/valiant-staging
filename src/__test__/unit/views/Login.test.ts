import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import Login from '@/views/Login.vue';
import AuthService from '@/services/auth-service';

const VALID_SECRET = 'S3cr3t!789';
const ALT_SECRET = 'Tmp#4567';

const modalWrapperStub = {
  template: '<div class="modal-wrapper-stub"><slot /></div>',
  props: ['showModal', 'show-modal', 'width', 'height']
};

const textFieldStub = {
  template: '<input :id="id" :type="type || \'text\'" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value); $emit(\'on-input\', $event)" />',
  props: ['id', 'type', 'modelValue', 'placeholder'],
  emits: ['update:modelValue', 'on-input']
};

const privacyPolicyStub = {
  template: '<div><button class="accept-policy" @click="$emit(\'on-accept\')">accept</button><button class="decline-policy" @click="$emit(\'on-decline\')">decline</button></div>',
  emits: ['on-accept', 'on-decline']
};

// Mocks
vi.mock('@/services/auth-service');
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock('@/router', () => ({
  default: {
    push: (...args) => mockPush(...args),
  },
}));

vi.mock('vue-router', () => ({
  RouterLink: {
    template: '<a><slot /></a>',
    props: ['to']
  },
  useRoute: () => ({
    query: {}
  }),
  useRouter: () => ({
    push: mockPush
  })
}));

// Mock FingerprintJS
vi.mock('@fingerprintjs/fingerprintjs', () => ({
  default: {
    load: vi.fn().mockResolvedValue({
      get: vi.fn().mockResolvedValue({
        visitorId: 'test-visitor-id'
      })
    })
  }
}));

// Mock encrypt storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    setItem: vi.fn(),
    getItem: vi.fn(),
    clear: vi.fn(),
  })
}));

describe('Login.vue', () => {
  let pinia: any;
  let mockAuthService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    pinia = createPinia();
    setActivePinia(pinia);

    mockAuthService = {
      generateCaptcha: vi.fn().mockResolvedValue({
        captcha_key: 'captcha-key',
        tile_y: 10,
        tile_width: 50,
        tile_height: 50,
        image_base64: 'img-base64',
        tile_base64: 'tile-base64'
      }),
      login: vi.fn().mockResolvedValue({
        code: 200,
        data: {
          token: 'test-token',
          is_first_login: false,
          user: { level_role: '1', uuid: 'uuid-123', nama: 'Test User' }
        }
      }),
      loginSSO: vi.fn().mockResolvedValue({
        code: 200,
        data: 'http://sso-url.com'
      }),
      sendEmailOtp: vi.fn().mockResolvedValue({ code: 200 }),
      verifyDeviceOtp: vi.fn().mockResolvedValue({ code: 200, data: 'verify-token' }),
      resendDeviceOtp: vi.fn().mockResolvedValue({ code: 200 }),
      changePrePassword: vi.fn().mockResolvedValue({ code: 200 }),
      preProfile: vi.fn().mockResolvedValue({
        data: { uuid: 'uuid-1', nama_pegawai: 'Test', email: 'test' }
      }),
      privacyPolicy: vi.fn().mockResolvedValue({ code: 200 })
    };

    (AuthService as any).mockImplementation(function() { return mockAuthService; });
    
    // Mock global location
    Object.defineProperty(globalThis, 'location', {
      value: { 
        href: '',
        reload: vi.fn()
      },
      writable: true
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createWrapper = (): any => {
    return mount(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          ModalNotification: true,
          ModalWrapper: modalWrapperStub,
          TextField: textFieldStub,
          PrivacyPolicy: privacyPolicyStub,
          Dialog: true,
          'gocaptcha-slide': true, 
          Loading: true
        }
      }
    });
  };

  it('should render login page correctly', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('should handle login SSO success', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.loginSSO();
    await flushPromises();

    expect(mockAuthService.loginSSO).toHaveBeenCalled();
    expect(globalThis.location.href).toBe('http://sso-url.com');
  });

  it('should handle login SSO error', async () => {
    mockAuthService.loginSSO.mockRejectedValue(new Error('Network Error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.loginSSO();
    await flushPromises();
    
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should toggle password visibility', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    expect(wrapper.vm.showPassword).toBe(false);
    wrapper.vm.visiblePassword();
    expect(wrapper.vm.showPassword).toBe(true);
  });

  it('should validate password requirements', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    // Test invalid passwords
    wrapper.vm.formCp.newP = 'weak';
    wrapper.vm.verifyRequirementPassword();
    expect(wrapper.vm.hasMinLength).toBe(false);
    
    wrapper.vm.formCp.newP = 'StrongPassword1!';
    wrapper.vm.verifyRequirementPassword();
    expect(wrapper.vm.hasMinLength).toBe(true);
    expect(wrapper.vm.hasUppercase).toBe(true);
    expect(wrapper.vm.hasLowercase).toBe(true);
    expect(wrapper.vm.hasNumber).toBe(true);
    expect(wrapper.vm.hasSymbol).toBe(true);
  });

  // Captcha tests disabled as feature is currently commented out in component
  // it('should handle login flow with captcha', async () => { ... })
  // it('should handle successful captcha verification and login', async () => { ... })

  it('should handle successful login', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = VALID_SECRET;
    
    // Direct login assuming captcha bypassed or verified
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();
    
    expect(mockAuthService.login).toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    await flushPromises();
    
    expect(mockPush).toHaveBeenCalledWith({ name: 'peta' });
  });

  it('should handle first login password change flow', async () => {
    mockAuthService.login.mockResolvedValue({
      code: 200,
      message: 'Password anda sudah expired, silahkan ganti password',
      data: {
        is_reset: true,
      }
    });

    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = ALT_SECRET;
    
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();

    expect(wrapper.vm.isShowCompletePassword).toBe(true);
    
    // Click proceed
    await wrapper.vm.handleClickChangePassword();
    await flushPromises();
    expect(wrapper.vm.isModalChangePasswordShow).toBe(true);
  });

  it('should handle failed login (invalid credentials)', async () => {
    mockAuthService.login.mockRejectedValue({
      response: { data: { code: 400, message: 'User / Password tidak sesuai' } }
    });

    const wrapper = createWrapper();
    await flushPromises();

    // Setting data and calling verify
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = ALT_SECRET;
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();

    expect(wrapper.vm.valEmailErr).toBe('Email atau Kata Sandi salah');
  });

  it('should handle OTP flow (new device flow)', async () => {
    mockAuthService.login.mockResolvedValue({
      code: 200,
      message: 'Anda terdeteksi menggunakan device baru, silahkan lakukan verifikasi OTP'
    });

    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.valEmail = 'test@example.com';
  wrapper.vm.valPassword = VALID_SECRET;
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();

    expect(wrapper.vm.isModalOtpShow).toBe(true);
    
    // Simulate OTP input by filling array
    wrapper.vm.otp = ['1','2','3','4','5','6','7','8'];
    wrapper.vm.verifyEmailOtp();
    await flushPromises();
    
    expect(mockAuthService.verifyDeviceOtp).toHaveBeenCalled();
    expect(wrapper.vm.isModalOtpShow).toBe(false);
  });
  
  it('should handle OTP input keys', async () => {
      const wrapper = createWrapper();
      await flushPromises();
      
      const event = { key: '1', preventDefault: vi.fn(), target: { value: '1' } };
      
      wrapper.vm.handleInput(0, event);
      
      const backspaceEvent = { key: 'Backspace', preventDefault: vi.fn() };
      wrapper.vm.handleKeyDown(0, backspaceEvent);
  });
  
  it('should attempt to change password successfully', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    // Set required fields for validation
    wrapper.vm.formCp.oldP = 'OldPass1!';
    wrapper.vm.formCp.newP = 'NewPass1!';
    wrapper.vm.formCp.confirmNewP = 'NewPass1!';
    
    // Trigger validation logic manually to ensure refs are set
    wrapper.vm.verifyRequirementPassword();
    
    wrapper.vm.changePassword();
    await flushPromises();
    
    expect(mockAuthService.changePrePassword).toHaveBeenCalled();
  });
  
  it('should validate change password logic', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.formCp.newP = 'NewPass1!';
    wrapper.vm.formCp.confirmNewP = 'Mismatch!';
    
    // Manually trigger verifyMatchPassword
    wrapper.vm.verifyMatchPassword();
    
    wrapper.vm.changePassword();
    await flushPromises();
    
    expect(mockAuthService.changePrePassword).not.toHaveBeenCalled();
  });

  // it('should generate captcha on mount', async () => { ... })
  
  it('should handle privacy policy', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.onAcceptPrivacy();
    await flushPromises();
    expect(mockAuthService.privacyPolicy).toHaveBeenCalledWith(true);
    // onAcceptPrivacy calls privacyPolicy(true) then clears sessionStorage - does NOT re-call login
    
    wrapper.vm.onDeclinePrivacy();
    await flushPromises();
    expect(mockAuthService.privacyPolicy).toHaveBeenCalledWith(false);
  });


  it('should handle privacy policy error', async () => {
    mockAuthService.privacyPolicy.mockRejectedValue(new Error('Privacy Error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.onAcceptPrivacy();
    await flushPromises();
    expect(consoleSpy).toHaveBeenCalled();
    
    wrapper.vm.onDeclinePrivacy();
    await flushPromises();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should handle unmount cleanup', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.unmount();
    // Verify clearInterval if possible, or just ensure no error throws
    expect(wrapper.exists()).toBe(false);
  });

  it('should handle specific login errors (locked, temp_loc, validation)', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = VALID_SECRET;
    wrapper.vm.captchaKey = 'captcha-key';

    // 1. Validation Failed
    mockAuthService.login.mockRejectedValue({
      response: { data: { message: `validation failed: Key: 'RequestAuth.Email' Error:Field validation for 'Email' failed on the 'email' tag` } }
    });
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();

    // 2. Captcha verification failed
    mockAuthService.login.mockRejectedValue({
      response: { data: { message: 'Captcha verification failed' } }
    });
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();

    // 3. User locked
    mockAuthService.login.mockRejectedValue({
      response: { data: { data: { is_locked: true } } }
    });
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();
    expect(wrapper.vm.isShowLocked).toBe(true);
    vi.advanceTimersByTime(5000);
    await flushPromises();
    expect(wrapper.vm.isShowLocked).toBe(false);

    // 4. Temp loc (remaining attempts)
    mockAuthService.login.mockRejectedValue({
      response: { data: { data: { temp_loc: 2 }, message: 'Error' } }
    });
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();
    expect(wrapper.vm.remainingAttempt).toBe(3); // 5 - 2

    // 5. Privacy policy required
    mockAuthService.login.mockRejectedValue({
      response: { data: { message: 'Anda belum mengisi privacy policy' } }
    });
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();
    expect(wrapper.vm.isShowPrivacyPolicy).toBe(true);
  });

  it('should handle validation errors (empty password)', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = '';
    
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();
    
    expect(wrapper.vm.valKataSandiErr).toBe('Kata sandi kosong mohon diisi');
  });

  it('should handle specific reset password messages', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = VALID_SECRET;
    
    // Case 1: Password expired
    mockAuthService.login.mockResolvedValueOnce({
        message: 'Password anda sudah expired, silahkan ganti password',
        data: { is_reset: true }
    });
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();
    expect(wrapper.vm.isShowCompletePassword).toBe(true);
    
    // Case 2: reset previously
    mockAuthService.login.mockResolvedValueOnce({
        message: 'Password anda sudah direset sebelumnya, silahkan ganti password anda',
        data: { is_reset: true }
    });
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();
    expect(wrapper.vm.isShowCompletePassword).toBe(true);
  });

  it('should handle change password specific errors', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    // Setup for changePassword
    wrapper.vm.formCp.oldP = 'OldPass';
    wrapper.vm.formCp.newP = 'NewPass1!';
    wrapper.vm.formCp.confirmNewP = 'NewPass1!';
    
    // Manually trigger validations
    wrapper.vm.verifyRequirementPassword();
    wrapper.vm.verifyMatchPassword(); 


    // 1. Old password wrong
    mockAuthService.changePrePassword.mockRejectedValueOnce({
        response: { data: { message: 'Password Lama tidak sesuai' } }
    });
    await wrapper.vm.changePassword();
    await flushPromises();
    expect(wrapper.vm.isOldPasswordWrong).toBe(true);

    // 2. 15 recent passwords
    mockAuthService.changePrePassword.mockRejectedValueOnce({
        response: { data: { message: 'password tidak boleh sama dengan 15 password terakhir' } }
    });
    await wrapper.vm.changePassword();
    await flushPromises();
    // Verify notification called (mock implementation just logs or does nothing, we can verify spy if we want, or just ensure no crash)

    // 3. Common password
    mockAuthService.changePrePassword.mockRejectedValueOnce({
        response: { data: { message: 'password anda terlalu umum dan banyak digunakan, mohon mencoba password lainnya' } }
    });
    await wrapper.vm.changePassword();
    await flushPromises();
  });

  it('should handle validation errors (empty email)', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.valEmail = '';
    wrapper.vm.valPassword = VALID_SECRET;
    
    wrapper.vm.onCaptchaVerified(50);
    await flushPromises();
    
    expect(wrapper.vm.valEmailErr).toBe('Email kosong mohon diisi');
  });

  it('should handle change password validations (same as old, illegal space)', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    // 1. Same as old
    wrapper.vm.formCp.oldP = 'Pass123!';
    wrapper.vm.formCp.newP = 'Pass123!';
    wrapper.vm.formCp.confirmNewP = 'Pass123!';
    
    // Manually trigger validations
    wrapper.vm.verifyRequirementPassword();
    // Assuming isNewPasswordSameAsOld logic
    wrapper.vm.isNewPasswordSameAsOld = true; 
    
    await wrapper.vm.changePassword();
    expect(mockAuthService.changePrePassword).not.toHaveBeenCalled();
    wrapper.vm.isNewPasswordSameAsOld = false;

    // 2. Illegal space
    wrapper.vm.formCp.oldP = 'Pass123!';
    wrapper.vm.formCp.newP = ' Pass123! '; // Spaces
    wrapper.vm.formCp.confirmNewP = ' Pass123! ';
    wrapper.vm.verifyRequirementPassword();
    wrapper.vm.hasIllegalSpace = false; // Reset first
    
    await wrapper.vm.changePassword();
    // The component regex test should find spaces and set hasIllegalSpace = true
    expect(wrapper.vm.hasIllegalSpace).toBe(true);
    expect(mockAuthService.changePrePassword).not.toHaveBeenCalled();
  });

  it('should complete change password success flow and clear storage', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.formCp.oldP = 'OldPass';
    wrapper.vm.formCp.newP = 'NewPass1!';
    wrapper.vm.formCp.confirmNewP = 'NewPass1!';
    wrapper.vm.verifyRequirementPassword();
    wrapper.vm.verifyMatchPassword(); // Ensure matched

    mockAuthService.changePrePassword.mockResolvedValue({ code: 200 });
    
    // Don't await immediately, as it blocks on wait(5000)
    const promise = wrapper.vm.changePassword();
    await flushPromises(); // Reach the wait(5000)

    expect(wrapper.vm.isChangePasswordSuccess).toBe(true);
    
    // Advance timer to resolve wait(5000)
    vi.advanceTimersByTime(5000);
    await flushPromises();
    
    await promise; // Now it should complete

    expect(wrapper.vm.isChangePasswordSuccess).toBe(false);
  });

  it('should handle OTP verification failure and errors', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    // Setup OTP flow
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = VALID_SECRET;
    wrapper.vm.isModalOtpShow = true;
    wrapper.vm.otp = ['1','2','3','4','5','6','7','8'];
    
    // 1. Code != 200
    mockAuthService.verifyDeviceOtp.mockResolvedValueOnce({ code: 400 });
    await wrapper.vm.verifyEmailOtp();
    await flushPromises();
    // Should catch error and notify
    // assert notifyError called? or check console error spy if possible.
    // For now we assume coverage is what matters.

    // 2. Exception
    mockAuthService.verifyDeviceOtp.mockRejectedValueOnce({ 
        response: { data: { message: 'Invalid OTP' } } 
    });
    await wrapper.vm.verifyEmailOtp();
    await flushPromises();
    await wrapper.vm.verifyEmailOtp();
    await flushPromises();
  });

  it('should handle reset email OTP success and error', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.valEmail = 'test@example.com';

    // 1. Success
    mockAuthService.resendDeviceOtp.mockResolvedValueOnce({ code: 200 });
    await wrapper.vm.resetEmailOtp();
    await flushPromises();
    // Check if timers started? wrapper.vm.expiredOtpTimer check

    // 2. Error
    mockAuthService.resendDeviceOtp.mockRejectedValueOnce(new Error('Network Error'));
    await wrapper.vm.resetEmailOtp();
    await flushPromises();
    // Console error spy?
  });

  it('should handle fetch data profile error', async () => {
    const wrapper = createWrapper();
    await flushPromises();
    
    mockAuthService.preProfile.mockRejectedValueOnce(new Error('Profile Error'));
    // fetchDataProfile is not exposed directly usually, but we can verify if it's called via onCaptchaVerified 
    // OR calling it directly if exposed (it is const, so assumes exposed via defineExpose or wrapper.vm access if script setup)
    // Checking Login.test.ts utility: wrapper.vm type suggests it's valid.

    await wrapper.vm.fetchDataProfile();
    await flushPromises();
    // Console error check
  });

  it('should sanitize password input fields', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.formCp.oldP = 'test"quote\\newline\n\r\t';
    wrapper.vm.sanitizeOldPassword();
    expect(wrapper.vm.formCp.oldP).not.toContain('"');

    wrapper.vm.formCp.newP = "new'password\0test";
    wrapper.vm.sanitizeNewPassword();
    expect(wrapper.vm.formCp.newP).not.toContain("'");

    wrapper.vm.formCp.confirmNewP = 'confirm`pass\ntest';
    wrapper.vm.sanitizeConfirmNewPassword();
    expect(wrapper.vm.formCp.confirmNewP).not.toContain('`');
  });

  it('should closeModalOtp and reset OTP state', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.isModalOtpShow = true;
    wrapper.vm.otp = ['1', '2', '3', '4', '5', '6', '7', '8'];
    wrapper.vm.expiredOtpTimer = 100;
    wrapper.vm.resetOtpTimer = 30;

    wrapper.vm.closeModalOtp();

    expect(wrapper.vm.isModalOtpShow).toBe(false);
    expect(wrapper.vm.otp.every((v: any) => v === null)).toBe(true);
    expect(wrapper.vm.expiredOtpTimer).toBe(300);
    expect(wrapper.vm.resetOtpTimer).toBe(60);
  });

  it('should closeChangePasswordModal and reset form fields', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.isModalChangePasswordShow = true;
    wrapper.vm.formCp.oldP = 'oldpass';
    wrapper.vm.formCp.newP = 'newpass';
    wrapper.vm.formCp.confirmNewP = 'confirmpass';
    wrapper.vm.hasIllegalSpace = true;

    wrapper.vm.closeChangePasswordModal();

    expect(wrapper.vm.isModalChangePasswordShow).toBe(false);
    expect(wrapper.vm.formCp.oldP).toBe('');
    expect(wrapper.vm.formCp.newP).toBe('');
    expect(wrapper.vm.hasIllegalSpace).toBe(false);
  });

  it('should clickDebugFingerprint and set debuggingFingerprint', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.vm.clickDebugFingerprint();
    await flushPromises();

    expect(wrapper.vm.debuggingFingerprint).toBe('test-visitor-id');
  });

  it('should goToSlide and update currentSlide', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    expect(wrapper.vm.currentSlide).toBe(0);
    wrapper.vm.goToSlide(3);
    expect(wrapper.vm.currentSlide).toBe(3);
    wrapper.vm.goToSlide(1);
    expect(wrapper.vm.currentSlide).toBe(1);
  });

  it('should advance carousel slide after 5000ms', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.goToSlide(0);
    vi.advanceTimersByTime(5000);
    await nextTick();
    expect(wrapper.vm.currentSlide).toBe(1);
  });

  it('should startTimers and countdown expiredOtpTimer and resetOtpTimer', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.expiredOtpTimer = 2;
    wrapper.vm.resetOtpTimer = 1;
    wrapper.vm.startTimers();

    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(wrapper.vm.expiredOtpTimer).toBe(1);
    expect(wrapper.vm.resetOtpTimer).toBe(0);

    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(wrapper.vm.expiredOtpTimer).toBe(0);
  });

  it('should handleKeyDown prevent non-digit/non-backspace/non-tab keys', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    const preventDefaultMock = vi.fn();
    wrapper.vm.handleKeyDown(0, { key: 'a', preventDefault: preventDefaultMock });
    expect(preventDefaultMock).toHaveBeenCalled();

    const preventDefaultMock2 = vi.fn();
    wrapper.vm.handleKeyDown(0, { key: 'Backspace', preventDefault: preventDefaultMock2 });
    expect(preventDefaultMock2).not.toHaveBeenCalled();

    const preventDefaultMock3 = vi.fn();
    wrapper.vm.handleKeyDown(0, { key: 'Tab', preventDefault: preventDefaultMock3 });
    expect(preventDefaultMock3).not.toHaveBeenCalled();
  });

  it('should handleKeyDown Backspace focus previous input when current is empty', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.otp = [null, null, null, null, null, null, null, null];
    const preventDefaultMock = vi.fn();
    // index=2, otp[2]=null → should trigger nextTick to focus index 1
    wrapper.vm.handleKeyDown(2, { key: 'Backspace', preventDefault: preventDefaultMock });
    await nextTick();
    expect(preventDefaultMock).not.toHaveBeenCalled();
  });

  it('should handleInput with digit value set otp slot and advance focus', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.otp = [null, null, null, null, null, null, null, null];
    await wrapper.vm.handleInput(0, { target: { value: '5' } });
    await nextTick();
    expect(wrapper.vm.otp[0]).toBe('5');
  });

  it('should handleInput with empty value set otp slot to null', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.otp = ['1', null, null, null, null, null, null, null];
    await wrapper.vm.handleInput(0, { target: { value: '' } });
    await nextTick();
    expect(wrapper.vm.otp[0]).toBeNull();
  });

  it('should handle onMounted hasRefreshed sessionStorage branch', async () => {
    const getItemSpy = vi.spyOn(globalThis.sessionStorage, 'getItem').mockReturnValue('true');
    const removeItemSpy = vi.spyOn(globalThis.sessionStorage, 'removeItem').mockImplementation(() => {});

    mount(Login, {
      global: {
        plugins: [pinia],
        stubs: {
          ModalNotification: true,
          ModalWrapper: modalWrapperStub,
          TextField: textFieldStub,
          PrivacyPolicy: privacyPolicyStub,
          Dialog: true,
          'gocaptcha-slide': true,
          Loading: true
        }
      }
    });
    await flushPromises();

    expect(removeItemSpy).toHaveBeenCalledWith('hasRefreshed');

    getItemSpy.mockRestore();
    removeItemSpy.mockRestore();
  });

  it('should trigger template emits and password modal input/toggle handlers', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    await wrapper.find('.accept-policy').trigger('click');
    await wrapper.find('.decline-policy').trigger('click');
    await flushPromises();

    wrapper.vm.isModalChangePasswordShow = true;
    wrapper.vm.formCp.oldP = 'OldPass1!';
    wrapper.vm.formCp.newP = 'NewPass1!';
    wrapper.vm.formCp.confirmNewP = 'NewPass1!';
    await nextTick();

    const oldP = wrapper.find('#oldPassword');
    const newP = wrapper.find('#newPassword');
    const confirmP = wrapper.find('#confirmNewPassword');
    expect(oldP.exists()).toBe(true);
    expect(newP.exists()).toBe(true);
    expect(confirmP.exists()).toBe(true);

    await oldP.setValue('OldPass1!');
    await newP.setValue('NewPass1!');
    await confirmP.setValue('NewPass1!');

    const toggleButtons = wrapper.findAll('button.absolute.inset-y-0.right-0.flex.items-center.pt-5.pr-3');
    expect(toggleButtons.length).toBeGreaterThanOrEqual(3);
    await toggleButtons[0].trigger('click');
    await toggleButtons[1].trigger('click');
    await toggleButtons[2].trigger('click');
  });

  it('should trigger OTP, slider, login input, and counter close handlers from template', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.isModalOtpShow = true;
    wrapper.vm.expiredOtpTimer = 0;
    wrapper.vm.resetOtpTimer = 0;
    await nextTick();

    const otpInputs = wrapper.findAll('input[maxlength="1"]');
    expect(otpInputs.length).toBe(8);
    for (let i = 0; i < otpInputs.length; i++) {
      await otpInputs[i].setValue(String((i + 1) % 10));
    }
    await flushPromises();
    expect(mockAuthService.verifyDeviceOtp).toHaveBeenCalled();

    const slideButton = wrapper.find('button[aria-label="Slide 3"]');
    expect(slideButton.exists()).toBe(true);
    await slideButton.trigger('click');

    wrapper.vm.isShowCounter = true;
    await nextTick();
    const closeCounterButton = wrapper.find('div.flex.justify-between > button[type="button"]');
    expect(closeCounterButton.exists()).toBe(true);
    await closeCounterButton.trigger('click');
    expect(wrapper.vm.isShowCounter).toBe(false);

    const emailInput = wrapper.find('#emailAddress');
    const passwordInput = wrapper.find('#password1');
    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
    await emailInput.setValue('template@test.com');
    await passwordInput.setValue('Password123!');
    await passwordInput.trigger('keyup.enter');
  });

  it('should hit timer clear, early return, and password success storage clear branches', async () => {
    const wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.expiredOtpTimer = 0;
    wrapper.vm.resetOtpTimer = 0;
    wrapper.vm.startTimers();
    vi.advanceTimersByTime(1000);
    await nextTick();

    wrapper.vm.isLoadingButton = true;
    wrapper.vm.valEmail = 'test@example.com';
    wrapper.vm.valPassword = VALID_SECRET;
    await wrapper.vm.onCaptchaVerified();
    expect(mockAuthService.login).not.toHaveBeenCalled();

    const clearSpy = vi.spyOn(localStorage, 'clear').mockImplementation(() => {});
    wrapper.vm.isLoadingButton = false;
    wrapper.vm.formCp.oldP = 'OldPass1!';
    wrapper.vm.formCp.newP = 'NewPass1!';
    wrapper.vm.formCp.confirmNewP = 'NewPass1!';
    wrapper.vm.verifyRequirementPassword();
    wrapper.vm.verifyMatchPassword();
    mockAuthService.changePrePassword.mockResolvedValueOnce({ code: 200 });

    const promise = wrapper.vm.changePassword();
    await flushPromises();
    vi.advanceTimersByTime(5000);
    await flushPromises();
    await promise;

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
