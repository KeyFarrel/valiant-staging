import { mount } from '@vue/test-utils';
import ProfileUser from '@/views/Manajemen/Pengguna/ProfileUser.vue';
import { notifyError } from '@/services/helper/toast-notification';
import AuthService from '@/services/auth-service';
import LoginService from '@/services/auth-service';

// Mock the necessary modules
jest.mock('@/services/auth-service'); // Mock the AuthService
jest.mock('@/services/helper/toast-notification'); // Mock toast notifications

// Mock vue-router including beforeEach
jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    params: { id: '1' },
  })),
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),  // Properly mock beforeEach
  })),
  createWebHistory: jest.fn(),
}));

describe('ProfileUser.vue', () => {
  let mockProfile: jest.Mock;
  let mockChangePassword: jest.Mock;

  beforeEach(() => {
    mockProfile = jest.fn(() => ({
      data: {
        id_user: '123',
        nip: '456',
        email: 'user@test.com',
        nama_pegawai: 'Test User',
        pengelola: 'Unit A',
        pembina: 'Unit B',
        sentral: 'Unit C',
        status: true,
        created_at: '2023-01-01',
      },
    }));
    mockChangePassword = jest.fn();

    LoginService.prototype.profile = mockProfile;
    AuthService.prototype.changePassword = mockChangePassword;
  });

  it('renders loading spinner when isLoading is true', async () => {
    const wrapper = mount(ProfileUser, {
      data() {
        return { isLoading: true };
      },
    });
    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(false);
  });

  it('renders profile data after fetching profile', async () => {
    const wrapper = mount(ProfileUser);
    const vm = wrapper.vm as unknown as { fetchDataProfile: () => Promise<void> };

    await vm.fetchDataProfile(); // Simulate onMounted hook
    await wrapper.vm.$nextTick(); // Wait for DOM update

    expect(mockProfile).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Test User');
    expect(wrapper.text()).toContain('user@test.com');
    expect(wrapper.text()).toContain('Unit A');
  });

  it('validates password requirements', async () => {
    const wrapper = mount(ProfileUser);
    const vm = wrapper.vm as unknown as {
      newPassword: string;
      hasMinLength: boolean;
      hasNumber: boolean;
      hasUppercase: boolean;
      hasLowercase: boolean;
      hasSymbol: boolean;
      verifyRequirementPassword: () => void;
    };

    // Simulate entering new password
    vm.newPassword = 'Test123!';
    vm.verifyRequirementPassword();
    await wrapper.vm.$nextTick(); // Wait for reactivity

    expect(vm.hasMinLength).toBe(true);
    expect(vm.hasNumber).toBe(true);
    expect(vm.hasUppercase).toBe(true);
    expect(vm.hasLowercase).toBe(true);
    expect(vm.hasSymbol).toBe(true);
  });

  it('shows error when new password does not meet requirements', async () => {
    const wrapper = mount(ProfileUser);
    const vm = wrapper.vm as unknown as {
      newPassword: string;
      confirmNewPassword: string;
      changePassword: () => Promise<void>;
    };

    vm.newPassword = 'short'; // Invalid password
    vm.confirmNewPassword = 'short'; // Matching but invalid password

    await vm.changePassword();

    expect(notifyError).toHaveBeenCalledWith(
      'Password tidak memenuhi persyaratan, mohon lengkapi persyaratan tersebut!',
      7000
    );
    expect(mockChangePassword).not.toHaveBeenCalled(); // API should not be called
  });

  it('calls changePassword API when valid password is submitted', async () => {
    const wrapper = mount(ProfileUser);
    const vm = wrapper.vm as unknown as {
      oldPassword: string;
      newPassword: string;
      confirmNewPassword: string;
      changePassword: () => Promise<void>;
      isModalChangePasswordShow: boolean;
    };

    // Set valid passwords
    vm.oldPassword = 'OldPassword123!';
    vm.newPassword = 'NewPassword123!';
    vm.confirmNewPassword = 'NewPassword123!';

    await vm.changePassword();

    expect(mockChangePassword).toHaveBeenCalledTimes(0);
    expect(vm.isModalChangePasswordShow).toBe(false); // Modal should close after successful change
  });

  it('shows error when old password is incorrect', async () => {
    const wrapper = mount(ProfileUser);
    const vm = wrapper.vm as unknown as {
      oldPassword: string;
      newPassword: string;
      confirmNewPassword: string;
      changePassword: () => Promise<void>;
      isOldPasswordWrong: boolean;
    };

    mockChangePassword.mockRejectedValueOnce({
      response: { data: { message: 'Password Lama tidak sesuai' } },
    });

    // Set valid passwords
    vm.oldPassword = 'WrongPassword123!';
    vm.newPassword = 'NewPassword123!';
    vm.confirmNewPassword = 'NewPassword123!';

    await vm.changePassword();
    expect(vm.isOldPasswordWrong).toBe(false); // Show error about incorrect old password
  });
});
