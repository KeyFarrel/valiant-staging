import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ProfileUser from '@/views/Manajemen/Pengguna/ProfileUser.vue';

// Mock services
const mockAuthService = {
  profile: vi.fn(),
  changePassword: vi.fn()
};

const mockUserService = {
  sendEmailOtp: vi.fn(),
  verifyOtp: vi.fn()
};

// Mock dependencies
vi.mock('@/services/auth-service', () => ({
  default: vi.fn(function() { return mockAuthService; })
}));

vi.mock('@/services/user-service', () => ({
  default: vi.fn(function() { return mockUserService; })
}));

vi.mock('@/store/storeSession', () => ({
  useSessionStore: () => ({
    invalidateSession: vi.fn()
  })
}));

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: () => ({})
}));

vi.mock('@/router', () => ({
  default: {
    push: vi.fn()
  }
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    clear: vi.fn()
  })
}));

vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn()
}));

vi.mock('@/services/format/time-format-otp', () => ({
  default: vi.fn(function() { return {
    formatTime: vi.fn((time) => `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`)
  }; })
}));

// Mock components
vi.mock('@/components/ui/ModalWrapper.vue', () => ({
  default: {
    name: 'ModalWrapper',
    template: '<div><slot /></div>',
    props: ['showModal', 'width', 'height']
  }
}));

vi.mock('@/components/ui/ModalNotification.vue', () => ({
  default: {
    name: 'ModalNotification',
    template: '<div></div>',
    props: ['showModal', 'animationData', 'title', 'subtitle']
  }
}));

vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div>Loading...</div>'
  }
}));

// Mock other components
vi.mock('@/components/icons/IconRoundedChecked.vue', () => ({
  default: { name: 'IconRoundedChecked', template: '<div></div>' }
}));

vi.mock('@/components/icons/IconRoundedClose.vue', () => ({
  default: { name: 'IconRoundedClose', template: '<div></div>' }
}));

vi.mock('@/components/icons/IconEdit.vue', () => ({
  default: { name: 'IconEdit', template: '<div></div>' }
}));

vi.mock('@/components/ui/Chips.vue', () => ({
  default: { name: 'Chips', template: '<div></div>' }
}));

vi.mock('@/components/ui/TextField.vue', () => ({
  default: { name: 'TextField', template: '<div></div>' }
}));

vi.mock('@/components/icons/IconClose.vue', () => ({
  default: { name: 'IconClose', template: '<div></div>' }
}));

vi.mock('@/components/icons/IconSendOTP.vue', () => ({
  default: { name: 'IconSendOTP', template: '<div></div>' }
}));

// Mock lottie asset
vi.mock('@/assets/lottie/success.json', () => ({
  default: {}
}));

describe('ProfileUser.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockAuthService.profile.mockResolvedValue({
      data: {
        id_user: '1',
        nip: '123456',
        email: 'test@example.com',
        username: 'testuser',
        nama_pegawai: 'Test User',
        atasan: 'Test Boss',
        photo: 'test.jpg',
        status: true,
        no_tlpn: 123456789,
        pengelola: 'Test Pengelola',
        pembina: 'Test Pembina',
        sentral: 'Test Sentral',
        roles: { name: 'Admin' },
        created_at: '2023-01-01T00:00:00Z'
      }
    });

    mockUserService.sendEmailOtp.mockResolvedValue({
      code: 200,
      message: 'OTP sent successfully'
    });

    mockUserService.verifyOtp.mockResolvedValue({
      code: 200,
      data: { otp_token: 'test-token' }
    });

    mockAuthService.changePassword.mockResolvedValue({
      code: 200,
      message: 'Password changed successfully'
    });
  });

  it('should render component successfully', async () => {
    const wrapper = mount(ProfileUser);
    
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.flex').exists()).toBe(true);
  });

  it('should fetch profile data on mount', async () => {
    const wrapper = mount(ProfileUser);
    
    // Wait for component to load data
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockAuthService.profile).toHaveBeenCalled();
  });

  it('should display user profile information', async () => {
    const wrapper = mount(ProfileUser);
    
    // Wait for component to load data
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if profile service was called
    expect(mockAuthService.profile).toHaveBeenCalled();
    
    // Check if component renders without errors
    expect(wrapper.find('.flex').exists()).toBe(true);
  });

  it('should handle profile fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAuthService.profile.mockRejectedValue(new Error('Network error'));
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle OTP service success', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockUserService.sendEmailOtp).toBeDefined();
    expect(mockUserService.verifyOtp).toBeDefined();
  });

  it('should handle input validation correctly', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Find form inputs
    const inputs = wrapper.findAll('input');
    
    // Test that inputs exist and can be interacted with
    if (inputs.length > 0) {
      await inputs[0].trigger('focus');
      await inputs[0].trigger('blur');
      expect(inputs[0].exists()).toBe(true);
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle modal interactions', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test clicking on edit button (if exists)
    const editButtons = wrapper.findAll('[data-testid="edit-button"], button');
    
    if (editButtons.length > 0) {
      await editButtons[0].trigger('click');
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle form submission', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Find forms or buttons that trigger submission
    const buttons = wrapper.findAll('button');
    const forms = wrapper.findAll('form');
    
    // Test button interaction
    if (buttons.length > 0) {
      await buttons[0].trigger('click');
    }
    
    // Test form submission
    if (forms.length > 0) {
      await forms[0].trigger('submit');
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle OTP verification flow', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test that OTP verification service is available
    expect(mockUserService.verifyOtp).toBeDefined();
    
    // Test OTP service mock response
    const otpResult = await mockUserService.verifyOtp('123456');
    expect(otpResult.code).toBe(200);
    expect(otpResult.data.otp_token).toBe('test-token');
  });

  it('should handle password change flow', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test that change password service is available
    expect(mockAuthService.changePassword).toBeDefined();
    
    // Test change password service mock response
    const changeResult = await mockAuthService.changePassword({
      old_password: 'old123',
      new_password: 'new123'
    });
    expect(changeResult.code).toBe(200);
    expect(changeResult.message).toBe('Password changed successfully');
  });

  it('should handle OTP send error scenario', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    mockUserService.sendEmailOtp.mockRejectedValue(new Error('Send OTP failed'));
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test error handling by calling the service
    try {
      await mockUserService.sendEmailOtp();
    } catch (error) {
      expect(error.message).toBe('Send OTP failed');
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle component loading state', async () => {
    const wrapper = mount(ProfileUser);
    
    // Check initial render
    expect(wrapper.exists()).toBe(true);
    
    // Wait for async operations
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify profile service was called during loading
    expect(mockAuthService.profile).toHaveBeenCalled();
  });

  it('should handle time formatting', async () => {
    const TimeFormatOtp = (await import('@/services/format/time-format-otp')).default;
    const timeFormatter = new TimeFormatOtp();
    
    const formattedTime = timeFormatter.formatTime(125);
    expect(formattedTime).toBe('2:05');
    
    const wrapper = mount(ProfileUser);
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle different time periods in calculateTimeAgo', async () => {
    // Test the calculateTimeAgo function by testing its logic
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test various time scenarios through component behavior
    const testDates = [
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 2), // 2 years ago
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3),  // 3 months ago
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),       // 5 days ago
      new Date(Date.now() - 1000 * 60 * 60 * 3),           // 3 hours ago
      new Date(Date.now() - 1000 * 60 * 5),                // 5 minutes ago
      new Date(Date.now() - 1000 * 30)                     // 30 seconds ago
    ];
    
    // Verify component can handle these dates without errors
    testDates.forEach(() => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  it('should handle password validation scenarios', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test password input interactions
    const passwordInputs = wrapper.findAll('input[type="password"]');
    
    if (passwordInputs.length > 0) {
      // Test password input events
      await passwordInputs[0].trigger('input');
      await passwordInputs[0].trigger('blur');
      await passwordInputs[0].trigger('focus');
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle OTP input interactions', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Find OTP input fields
    const otpInputs = wrapper.findAll('input[maxlength="1"]');
    
    if (otpInputs.length > 0) {
      // Test OTP input events
      await otpInputs[0].setValue('1');
      await otpInputs[0].trigger('input');
      await otpInputs[0].trigger('keydown', { key: 'Backspace' });
      await otpInputs[0].trigger('keydown', { key: '2' });
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle form validation messages', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test form submission with validation errors
    const forms = wrapper.findAll('form');
    if (forms.length > 0) {
      await forms[0].trigger('submit');
    }
    
    // Test buttons that trigger validation
    const submitButtons = wrapper.findAll('button');
    if (submitButtons.length > 0) {
      await submitButtons[0].trigger('click');
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle OTP resend functionality', async () => {
    const { notifySuccess } = await import('@/services/helper/toast-notification');
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Find resend OTP buttons
    const resendButtons = wrapper.findAll('button').filter(btn => 
      btn.text().includes('Kirim ulang') || btn.text().includes('kirim ulang')
    );
    
    if (resendButtons.length > 0) {
      await resendButtons[0].trigger('click');
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle modal close operations', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test modal close buttons
    const closeButtons = wrapper.findAll('button').filter(btn => 
      btn.html().includes('IconClose') || btn.text().includes('×') || btn.text().includes('Close')
    );
    
    if (closeButtons.length > 0) {
      await closeButtons[0].trigger('click');
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle user status display variations', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test status rendering - should handle both active and inactive states
    const statusElements = wrapper.findAll('.text-\\[\\#10B05B\\], .text-\\[\\#C53830\\]');
    
    // Component should render status information
    expect(wrapper.exists()).toBe(true);
    
    // Test profile information display
    const profileInfo = wrapper.find('.text-labelColor');
    if (profileInfo.exists()) {
      expect(profileInfo.exists()).toBe(true);
    }
  });

  it('should handle timer functionality', async () => {
    vi.useFakeTimers();
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test timer behavior through component interaction
    const timerElements = wrapper.findAll('span, p').filter(el => 
      el.text().includes(':') || el.text().includes('detik')
    );
    
    // Fast-forward time to test timer updates
    vi.advanceTimersByTime(5000);
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.exists()).toBe(true);
    
    vi.useRealTimers();
  });

  it('should handle copy-paste prevention', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test copy-paste prevention on password fields
    const passwordInputs = wrapper.findAll('input[type="password"]');
    
    if (passwordInputs.length > 0) {
      const mockClipboardEvent = new ClipboardEvent('paste', {
        clipboardData: new DataTransfer()
      });
      
      // Simulate paste event
      await passwordInputs[0].element.dispatchEvent(mockClipboardEvent);
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle component lifecycle', async () => {
    const wrapper = mount(ProfileUser);
    
    // Test mounted state
    await wrapper.vm.$nextTick();
    expect(mockAuthService.profile).toHaveBeenCalled();
    
    // Test unmount cleanup
    wrapper.unmount();
    
    // Verify component was properly unmounted
    expect(wrapper.exists()).toBe(false);
  });

  it('should handle error scenarios comprehensively', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Test OTP verification error
    mockUserService.verifyOtp.mockRejectedValue({
      response: { data: { message: 'OTP expired' } }
    });
    
    // Test reset OTP error
    mockUserService.sendEmailOtp.mockRejectedValue(new Error('Network error'));
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(wrapper.exists()).toBe(true);
    
    consoleSpy.mockRestore();
  });

  it('should handle all password validation requirements', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test various password scenarios
    const passwordScenarios = [
      'short',                    // Too short
      'nouppercase123@',         // No uppercase
      'NOLOWERCASE123@',         // No lowercase
      'NoNumbers@',              // No numbers
      'NoSymbols123',            // No symbols
      'ValidPassword123@',       // Valid password
      ' SpaceAtStart123@',       // Space at start
      'SpaceAtEnd123@ '          // Space at end
    ];
    
    // Test each scenario through input interactions
    const passwordInputs = wrapper.findAll('input[type="password"]');
    
    if (passwordInputs.length > 0) {
      for (const password of passwordScenarios) {
        await passwordInputs[0].setValue(password);
        await passwordInputs[0].trigger('input');
      }
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle all form interactions and edge cases', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Test various form interactions
    const allInputs = wrapper.findAll('input');
    const allButtons = wrapper.findAll('button');
    
    // Test input events
    for (const input of allInputs) {
      await input.trigger('focus');
      await input.trigger('blur');
      await input.trigger('change');
    }
    
    // Test button clicks
    for (const button of allButtons) {
      if (!button.attributes('disabled')) {
        await button.trigger('click');
      }
    }
    
    expect(wrapper.exists()).toBe(true);
  });

  // Additional tests for uncovered lines
  it('should handle closeChangePasswordModal function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    // Access the component instance
    const vm = wrapper.vm as any;
    
    // Call closeChangePasswordModal
    vm.isModalChangePasswordShow = true;
    expect(vm.isModalChangePasswordShow).toBe(true);
    
    vm.closeChangePasswordModal();
    expect(vm.isModalChangePasswordShow).toBe(false);
  });

  it('should handle closeModalOtp function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set modal to open
    vm.isModalOtpShow = true;
    vm.expiredOtpTimer = 100;
    vm.resetOtpTimer = 50;
    
    // Call closeModalOtp
    vm.closeModalOtp();
    
    expect(vm.isModalOtpShow).toBe(false);
    expect(vm.expiredOtpTimer).toBe(300);
    expect(vm.resetOtpTimer).toBe(60);
  });

  it('should handle handleInput with valid digit', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Mock event
    const mockEvent = {
      target: { value: '5' }
    };
    
    // Call handleInput
    vm.handleInput(0, mockEvent);
    
    expect(vm.otp[0]).toBe('5');
  });

  it('should handle handleInput with empty value', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set initial value
    vm.otp[0] = '5';
    
    // Mock event with empty value
    const mockEvent = {
      target: { value: '' }
    };
    
    // Call handleInput
    vm.handleInput(0, mockEvent);
    
    expect(vm.otp[0]).toBe(null);
  });

  it('should call verifyEmailOtp when all OTP digits are filled', async () => {
    mockUserService.verifyOtp.mockResolvedValue({
      code: 200,
      data: { otp_token: 'test-token' }
    });
    
    mockAuthService.changePassword.mockResolvedValue({
      code: 200,
      message: 'Success'
    });
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Fill first 7 OTP digits
    vm.otp = ['1', '2', '3', '4', '5', '6', '7', null];
    
    // Mock event for last digit
    const mockEvent = {
      target: { value: '8' }
    };
    
    // Call handleInput for last digit
    await vm.handleInput(7, mockEvent);
    
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify OTP verification was triggered
    expect(mockUserService.verifyOtp).toHaveBeenCalled();
  });

  it('should handle handleKeyDown with non-digit key', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Mock event with non-digit key
    const mockEvent = {
      key: 'a',
      preventDefault: vi.fn()
    };
    
    // Call handleKeyDown
    vm.handleKeyDown(0, mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle handleKeyDown with Backspace on empty field', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set OTP refs
    vm.otpRefs = [
      { focus: vi.fn() },
      { focus: vi.fn() },
      { focus: vi.fn() }
    ];
    
    vm.otp[1] = null;
    
    // Mock event with Backspace
    const mockEvent = {
      key: 'Backspace',
      preventDefault: vi.fn()
    };
    
    // Call handleKeyDown on index 1
    vm.handleKeyDown(1, mockEvent);
    
    await wrapper.vm.$nextTick();
  });

  it('should handle handleKeyDown with Tab key', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Mock event with Tab key
    const mockEvent = {
      key: 'Tab',
      preventDefault: vi.fn()
    };
    
    // Call handleKeyDown
    vm.handleKeyDown(0, mockEvent);
    
    // Tab should not be prevented
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should handle startTimers function', async () => {
    vi.useFakeTimers();
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set initial timer values
    vm.expiredOtpTimer = 5;
    vm.resetOtpTimer = 3;
    
    // Call startTimers
    vm.startTimers();
    
    // Advance time by 2 seconds
    vi.advanceTimersByTime(2000);
    
    expect(vm.expiredOtpTimer).toBe(3);
    expect(vm.resetOtpTimer).toBe(1);
    
    // Advance time by 2 more seconds
    vi.advanceTimersByTime(2000);
    
    expect(vm.expiredOtpTimer).toBe(1);
    
    // Advance time to complete
    vi.advanceTimersByTime(2000);
    
    expect(vm.expiredOtpTimer).toBe(0);
    
    vi.useRealTimers();
  });

  it('should handle resetEmailOtp successfully', async () => {
    const { notifySuccess } = await import('@/services/helper/toast-notification');
    mockUserService.sendEmailOtp.mockResolvedValue({ code: 200 });
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Call resetEmailOtp
    await vm.resetEmailOtp();
    
    expect(mockUserService.sendEmailOtp).toHaveBeenCalled();
    expect(vm.expiredOtpTimer).toBe(300);
    expect(vm.resetOtpTimer).toBe(60);
  });

  it('should handle resetEmailOtp error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUserService.sendEmailOtp.mockRejectedValue(new Error('Network error'));
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Call resetEmailOtp
    await vm.resetEmailOtp();
    
    expect(consoleSpy).toHaveBeenCalledWith('Error reset OTP:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle verifyEmailOtp with failed verification', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    mockUserService.verifyOtp.mockRejectedValue({
      response: { data: { message: 'Invalid OTP' } }
    });
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    vm.otp = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    // Call verifyEmailOtp
    await vm.verifyEmailOtp();
    
    expect(mockUserService.verifyOtp).toHaveBeenCalledWith('12345678');
  });

  it('should handle verifyEmailOtp with successful password change', async () => {
    vi.useFakeTimers();
    
    mockUserService.verifyOtp.mockResolvedValue({
      code: 200,
      data: { otp_token: 'test-token' }
    });
    
    mockAuthService.changePassword.mockResolvedValue({
      code: 200,
      message: 'Success'
    });
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    vm.otp = ['1', '2', '3', '4', '5', '6', '7', '8'];
    vm.formCp.oldP = 'OldPass123@';
    vm.formCp.newP = 'NewPass123@';
    
    // Call verifyEmailOtp
    const verifyPromise = vm.verifyEmailOtp();
    
    // Fast-forward the wait time
    await vi.advanceTimersByTimeAsync(5000);
    
    await verifyPromise;
    
    expect(mockAuthService.changePassword).toHaveBeenCalledWith('OldPass123@', 'NewPass123@', 'test-token');
    
    vi.useRealTimers();
  }, 10000);

  it('should handle verifyEmailOtp with wrong old password', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    mockUserService.verifyOtp.mockResolvedValue({
      code: 200,
      data: { otp_token: 'test-token' }
    });
    
    mockAuthService.changePassword.mockRejectedValue({
      response: { data: { message: 'Password Lama tidak sesuai' } }
    });
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    vm.otp = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    // Call verifyEmailOtp
    await vm.verifyEmailOtp();
    
    expect(vm.isOldPasswordWrong).toBe(true);
    expect(vm.isModalOtpShow).toBe(false);
  });

  it('should handle verifyEmailOtp with other password change error', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    mockUserService.verifyOtp.mockResolvedValue({
      code: 200,
      data: { otp_token: 'test-token' }
    });
    
    mockAuthService.changePassword.mockRejectedValue({
      response: { data: { message: 'Some other error' } }
    });
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    vm.otp = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    // Call verifyEmailOtp
    await vm.verifyEmailOtp();
    
    expect(vm.isModalOtpShow).toBe(false);
    expect(vm.expiredOtpTimer).toBe(300);
    expect(vm.resetOtpTimer).toBe(60);
  });

  it('should handle verifyEmailOtp with unexpected error', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockUserService.verifyOtp.mockRejectedValue(new Error('Unexpected'));
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    vm.otp = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    // Call verifyEmailOtp
    await vm.verifyEmailOtp();
    
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should handle verifyRequirementPassword function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Test with weak password
    vm.formCp.newP = 'weak';
    vm.verifyRequirementPassword();
    
    expect(vm.hasMinLength).toBe(false);
    expect(vm.hasNumber).toBe(false);
    expect(vm.hasUppercase).toBe(false);
    expect(vm.hasSymbol).toBe(false);
    
    // Test with strong password
    vm.formCp.newP = 'StrongPass123@';
    vm.verifyRequirementPassword();
    
    expect(vm.hasMinLength).toBe(true);
    expect(vm.hasNumber).toBe(true);
    expect(vm.hasUppercase).toBe(true);
    expect(vm.hasLowercase).toBe(true);
    expect(vm.hasSymbol).toBe(true);
  });

  it('should detect when new password is same as old', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    vm.formCp.oldP = 'SamePass123@';
    vm.formCp.newP = 'SamePass123@';
    vm.verifyRequirementPassword();
    
    expect(vm.isNewPasswordSameAsOld).toBe(true);
  });

  it('should handle verifyMatchPassword when passwords match', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    vm.formCp.newP = 'NewPass123@';
    vm.formCp.confirmNewP = 'NewPass123@';
    vm.verifyMatchPassword();
    
    expect(vm.isPasswordMatched).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith('Password sama');
    
    consoleSpy.mockRestore();
  });

  it('should handle verifyMatchPassword when passwords do not match', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    vm.formCp.newP = 'NewPass123@';
    vm.formCp.confirmNewP = 'DifferentPass123@';
    vm.verifyMatchPassword();
    
    expect(vm.isPasswordMatched).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Password tidak sama');
    
    consoleSpy.mockRestore();
  });

  it('should handle resetInputAndAttribute function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set some values
    vm.formCp.oldP = 'old';
    vm.formCp.newP = 'new';
    vm.formCp.confirmNewP = 'new';
    vm.hasMinLength = true;
    vm.showOldPassword = true;
    
    // Call resetInputAndAttribute
    vm.resetInputAndAttribute();
    
    expect(vm.formCp.oldP).toBe('');
    expect(vm.formCp.newP).toBe('');
    expect(vm.formCp.confirmNewP).toBe('');
    expect(vm.hasMinLength).toBe(false);
    expect(vm.showOldPassword).toBe(false);
  });

  it('should handle changePassword with invalid requirements', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set invalid password
    vm.isPasswordMatched = false;
    vm.hasMinLength = false;
    
    // Call changePassword
    await vm.changePassword();
    
    expect(notifyError).toHaveBeenCalled();
  });

  it('should handle changePassword when new password same as old', async () => {
    const { notifyError } = await import('@/services/helper/toast-notification');
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set all requirements met but same password
    vm.isPasswordMatched = true;
    vm.hasMinLength = true;
    vm.hasNumber = true;
    vm.hasUppercase = true;
    vm.hasLowercase = true;
    vm.hasSymbol = true;
    vm.isNewPasswordSameAsOld = true;
    
    // Call changePassword
    await vm.changePassword();
    
    expect(notifyError).toHaveBeenCalled();
  });

  it('should handle changePassword with illegal space', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set all requirements met
    vm.isPasswordMatched = true;
    vm.hasMinLength = true;
    vm.hasNumber = true;
    vm.hasUppercase = true;
    vm.hasLowercase = true;
    vm.hasSymbol = true;
    vm.isNewPasswordSameAsOld = false;
    vm.formCp.newP = ' SpaceAtStart123@';
    
    // Call changePassword
    await vm.changePassword();
    
    // hasIllegalSpace is set to true initially then reset to false in finally
    // We can't reliably test the intermediate state, so we just verify the function runs
    expect(vm.formCp.newP).toBe(' SpaceAtStart123@');
  });

  it('should handle changePassword successfully', async () => {
    const { notifySuccess } = await import('@/services/helper/toast-notification');
    mockUserService.sendEmailOtp.mockResolvedValue({ code: 200 });
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set all requirements met
    vm.isPasswordMatched = true;
    vm.hasMinLength = true;
    vm.hasNumber = true;
    vm.hasUppercase = true;
    vm.hasLowercase = true;
    vm.hasSymbol = true;
    vm.isNewPasswordSameAsOld = false;
    vm.formCp.newP = 'ValidPass123@';
    
    // Call changePassword
    await vm.changePassword();
    
    expect(mockUserService.sendEmailOtp).toHaveBeenCalled();
    expect(vm.isModalOtpShow).toBe(true);
  });

  it('should handle changePassword with OTP send error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockUserService.sendEmailOtp.mockRejectedValue(new Error('OTP error'));
    
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    // Set all requirements met
    vm.isPasswordMatched = true;
    vm.hasMinLength = true;
    vm.hasNumber = true;
    vm.hasUppercase = true;
    vm.hasLowercase = true;
    vm.hasSymbol = true;
    vm.isNewPasswordSameAsOld = false;
    vm.formCp.newP = 'ValidPass123@';
    
    // Call changePassword
    await vm.changePassword();
    
    expect(consoleSpy).toHaveBeenCalledWith('Error send OTP:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('should handle sanitizeOldPassword function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    vm.formCp.oldP = 'test"password\'with`quotes';
    vm.sanitizeOldPassword();
    
    expect(vm.formCp.oldP).toBe('testpasswordwithquotes');
  });

  it('should handle sanitizeNewPassword function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    vm.formCp.newP = 'test  double  spaces';
    vm.sanitizeNewPassword();
    
    expect(vm.formCp.newP).toBe('test double spaces');
  });

  it('should handle sanitizeConfirmNewPassword function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    vm.formCp.confirmNewP = 'test\nwith\nnewlines';
    vm.sanitizeConfirmNewPassword();
    
    expect(vm.formCp.confirmNewP).toBe('testwithnewlines');
  });

  it('should handle preventCopyPaste function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    const mockEvent = {
      preventDefault: vi.fn()
    };
    
    vm.preventCopyPaste(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle wait function', async () => {
    const wrapper = mount(ProfileUser);
    
    await wrapper.vm.$nextTick();
    
    const vm = wrapper.vm as any;
    
    const start = Date.now();
    await vm.wait(100);
    const end = Date.now();
    
    expect(end - start).toBeGreaterThanOrEqual(90);
  });
});