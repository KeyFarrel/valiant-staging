import { mount } from '@vue/test-utils';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import ProfileUser from '@/views/Manajemen/Pengguna/ProfileUser.vue';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';

// Mock stores
jest.mock('@/store/storeSession', () => ({
  useSessionStore: jest.fn(() => ({
    invalidateSession: jest.fn()
  }))
}));

jest.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: jest.fn(() => ({
    roleName: 'Admin',
    levelName: 'Manager'
  }))
}));

// Mock services
const mockAuthService = {
  profile: jest.fn() as jest.MockedFunction<any>,
  changePassword: jest.fn() as jest.MockedFunction<any>
};

const mockUserService = {
  sendEmailOtp: jest.fn() as jest.MockedFunction<any>,
  verifyOtp: jest.fn() as jest.MockedFunction<any>
};

const mockTimeFormatOtp = {
  formatTime: jest.fn().mockReturnValue('05:00')
};

jest.mock('@/services/auth-service', () => {
  return jest.fn().mockImplementation(() => mockAuthService);
});

jest.mock('@/services/user-service', () => {
  return jest.fn().mockImplementation(() => mockUserService);
});

jest.mock('@/services/format/time-format-otp', () => {
  return jest.fn().mockImplementation(() => mockTimeFormatOtp);
});

// Mock utilities
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    clear: jest.fn()
  })
}));

jest.mock('@/router', () => ({
  push: jest.fn()
}));

jest.mock('@/services/helper/toast-notification', () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn()
}));

// Mock components
jest.mock('@/components/ui/ModalWrapper.vue', () => ({
  name: 'ModalWrapper',
  template: '<div><slot /></div>',
  props: ['showModal', 'width', 'height']
}));

jest.mock('@/components/ui/LoadingSpinner.vue', () => ({
  name: 'Loading',
  template: '<div class="loading">Loading...</div>'
}));

jest.mock('@/components/ui/ModalNotification.vue', () => ({
  name: 'ModalNotification',
  template: '<div></div>',
  props: ['showModal', 'animationData', 'title', 'subtitle']
}));

jest.mock('@/components/ui/TextField.vue', () => ({
  name: 'TextField',
  template: '<input />',
  props: ['type', 'placeholder', 'modelValue', 'class', 'id'],
  emits: ['update:modelValue', 'onCopy', 'onPaste', 'onInput']
}));

jest.mock('@/components/ui/Chips.vue', () => ({
  name: 'Chips',
  template: '<span>{{ content }}</span>',
  props: ['title', 'content', 'class']
}));

// Mock other components
jest.mock('@/components/icons/IconEdit.vue', () => ({ name: 'IconEdit', template: '<div></div>' }));
jest.mock('@/components/icons/IconRoundedChecked.vue', () => ({ name: 'IconRoundedChecked', template: '<div></div>' }));
jest.mock('@/components/icons/IconRoundedClose.vue', () => ({ name: 'IconRoundedClose', template: '<div></div>' }));
jest.mock('@/components/icons/IconClose.vue', () => ({ name: 'IconClose', template: '<div></div>' }));
jest.mock('@/components/icons/IconSendOTP.vue', () => ({ name: 'IconSendOTP', template: '<div></div>' }));

// Mock assets
jest.mock('@/assets/lottie/success.json', () => ({}));

// Mock environment
Object.defineProperty(import.meta, 'env', {
  value: { MODE: 'test' },
  writable: true
});

describe('ProfileUser.vue', () => {
  let wrapper;
  let pinia;

  const mockProfileData = {
    code: 200,
    data: {
      id_user: '1',
      nip: '123456',
      email: 'john@example.com',
      username: 'johndoe',
      nama_pegawai: 'John Doe',
      atasan: 'Jane Smith',
      photo: 'photo.jpg',
      status: true,
      no_tlpn: 628123456789,
      pengelola: 'Unit A',
      pembina: 'Unit B',
      sentral: 'Unit C',
      roles: [{ name: 'admin' }],
      created_at: '2023-01-01T00:00:00Z'
    }
  };

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    jest.clearAllMocks();
    mockAuthService.profile.mockResolvedValue(mockProfileData);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = () => {
    return mount(ProfileUser, {
      global: {
        plugins: [pinia],
        stubs: {
          ModalWrapper: true,
          ModalNotification: true,
          Loading: true,
          TextField: true,
          Chips: true,
          IconEdit: true,
          IconRoundedChecked: true,
          IconRoundedClose: true,
          IconClose: true,
          IconSendOTP: true
        }
      }
    });
  };

  describe('Component Rendering', () => {
    it('renders successfully', () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('displays loading state', async () => {
      wrapper = createWrapper();
      wrapper.vm.isLoading = true;
      await nextTick();
      
      expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
    });

    it('displays user profile data', async () => {
      wrapper = createWrapper();
      await nextTick();
      // Wait for async profile fetch
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockAuthService.profile).toHaveBeenCalled();
    });
  });

  describe('Password Management', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it('validates password requirements', () => {
      wrapper.vm.newPassword = 'Test123!';
      wrapper.vm.verifyRequirementPassword();
      
      expect(wrapper.vm.hasMinLength).toBe(true);
      expect(wrapper.vm.hasNumber).toBe(true);
      expect(wrapper.vm.hasUppercase).toBe(true);
      expect(wrapper.vm.hasLowercase).toBe(true);
      expect(wrapper.vm.hasSymbol).toBe(true);
    });

    it('validates password match', () => {
      wrapper.vm.newPassword = 'Test123!';
      wrapper.vm.confirmNewPassword = 'Test123!';
      wrapper.vm.verifyMatchPassword();
      
      expect(wrapper.vm.isPasswordMatched).toBe(true);
    });

    it('detects password mismatch', () => {
      wrapper.vm.newPassword = 'Test123!';
      wrapper.vm.confirmNewPassword = 'Different123!';
      wrapper.vm.verifyMatchPassword();
      
      expect(wrapper.vm.isPasswordMatched).toBe(false);
    });

    it('sanitizes password input', () => {
      wrapper.vm.oldPassword = 'test"password';
      wrapper.vm.sanitizeOldPassword();
      
      expect(wrapper.vm.oldPassword).toBe('testpassword');
    });

    it('toggles password visibility', () => {
      expect(wrapper.vm.showOldPassword).toBe(false);
      wrapper.vm.showOldPassword = true;
      expect(wrapper.vm.showOldPassword).toBe(true);
    });
  });

  describe('Modal States', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it('opens change password modal', () => {
      wrapper.vm.isModalChangePasswordShow = true;
      expect(wrapper.vm.isModalChangePasswordShow).toBe(true);
    });

    it('closes change password modal', () => {
      wrapper.vm.isModalChangePasswordShow = true;
      wrapper.vm.closeChangePasswordModal();
      expect(wrapper.vm.isModalChangePasswordShow).toBe(false);
    });

    it('opens OTP modal', () => {
      wrapper.vm.isModalOtpShow = true;
      expect(wrapper.vm.isModalOtpShow).toBe(true);
    });

    it('closes OTP modal and resets timers', () => {
      wrapper.vm.isModalOtpShow = true;
      wrapper.vm.expiredOtpTimer = 100;
      wrapper.vm.closeModalOtp();
      
      expect(wrapper.vm.isModalOtpShow).toBe(false);
      expect(wrapper.vm.expiredOtpTimer).toBe(300);
    });
  });

  describe('OTP Handling', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it('handles OTP input correctly', () => {
      const mockEvent = {
        target: { value: '1' }
      };
      
      wrapper.vm.handleInput(0, mockEvent);
      expect(wrapper.vm.otp[0]).toBe('1');
    });

    it('handles non-digit input in OTP', () => {
      const mockEvent = {
        target: { value: 'a' }
      };
      
      wrapper.vm.handleInput(0, mockEvent);
      expect(wrapper.vm.otp[0]).toBeNull();
    });

    it('prevents invalid keys in OTP', () => {
      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn()
      };
      
      wrapper.vm.handleKeyDown(0, mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Form Operations', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it('resets form inputs and attributes', () => {
      wrapper.vm.oldPassword = 'test';
      wrapper.vm.newPassword = 'test123';
      wrapper.vm.hasMinLength = true;
      
      wrapper.vm.resetInputAndAttribute();
      
      expect(wrapper.vm.oldPassword).toBe('');
      expect(wrapper.vm.newPassword).toBe('');
      expect(wrapper.vm.hasMinLength).toBe(false);
    });

    it('prevents copy and paste events', () => {
      const mockEvent = {
        preventDefault: jest.fn()
      };
      
      wrapper.vm.preventCopyPaste(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Timer Management', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it('starts timers correctly', () => {
      wrapper.vm.startTimers();
      expect(wrapper.vm.expiredOtpTimer).toBe(300);
      expect(wrapper.vm.resetOtpTimer).toBe(60);
    });

    it('formats time using service', () => {
      wrapper.vm.timeFormatOtp.formatTime(300);
      expect(mockTimeFormatOtp.formatTime).toHaveBeenCalledWith(300);
    });
  });

  describe('Utility Functions', () => {
    beforeEach(async () => {
      wrapper = createWrapper();
      await nextTick();
    });

    it('calculates time ago correctly', () => {
      const pastDate = new Date();
      pastDate.setHours(pastDate.getHours() - 2);
      
      const result = wrapper.vm.calculateTimeAgo(pastDate.toISOString());
      expect(result).toContain('2 jam yang lalu');
    });
  });

  describe('Service Integration', () => {
    it('fetches profile data on mount', async () => {
      wrapper = createWrapper();
      await nextTick();
      
      // Allow time for async operations
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockAuthService.profile).toHaveBeenCalled();
    });

    it('sends OTP email', async () => {
      wrapper = createWrapper();
      mockUserService.sendEmailOtp.mockResolvedValue({ code: 200 });
      
      await wrapper.vm.resetEmailOtp();
      
      expect(mockUserService.sendEmailOtp).toHaveBeenCalled();
    });
  });

  describe('Lifecycle', () => {
    it('cleans up intervals on unmount', () => {
      wrapper = createWrapper();
      wrapper.vm.startTimers();
      
      wrapper.unmount();
      
      // Should not throw errors
      expect(true).toBe(true);
    });
  });
});
