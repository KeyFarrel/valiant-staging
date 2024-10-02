import { mount, flushPromises } from '@vue/test-utils';
import ProfileUser from '@/views/Manajemen/Pengguna/ProfileUser.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ModalNotification from '@/components/ui/ModalNotification.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import TextField from '@/components/ui/TextField.vue';
import AuthService from '@/services/auth-service';
import LoginService from '@/services/auth-service';
import { notifyError } from '@/services/helper/toast-notification';

// Mock services
jest.mock('@/services/auth-service');
jest.mock('@/services/helper/toast-notification');

// Create mock instances
const authServiceMock = new AuthService();
const loginServiceMock = new LoginService();

globalThis.importMetaEnv = {
  MODE: "development",
};

describe('ProfileUser.vue', () => {
  let wrapper: any;

  beforeEach(async () => {
    // Mock implementation for profile fetch
    loginServiceMock.profile = jest.fn().mockResolvedValue({
      data: {
        nama_pegawai: 'John Doe',
        email: 'johndoe@example.com',
        status: true,
        created_at: '2023-01-01T00:00:00Z',
        nip: '123456',
        pengelola: '',
        pembina: '',
        sentral: '',
      },
    });

    Object.defineProperty(global, 'importMeta', {
      value: {
        env: {
          MODE: 'development',
        },
      },
    });

    // Mock implementation for password change
    authServiceMock.changePassword = jest.fn().mockResolvedValue({});

    // Mount component
    wrapper = mount(ProfileUser, {
      global: {
        components: { ModalWrapper, ModalNotification, Loading, TextField },
      },
    });

    // Wait for the onMounted lifecycle hook to fetch data
    await flushPromises();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile information after fetching data', async () => {
    // Check if the fetched profile data is displayed correctly
    expect(wrapper.find('.text-base.font-semibold').text()).toBe('John Doe');
    expect(wrapper.find('.text-[#4791F2]').text()).toBe('johndoe@example.com');
    expect(wrapper.find('.text-sm').text()).toContain('123456');
  });

  it('opens the password change modal when clicking "Ganti Password"', async () => {
    const changePasswordButton = wrapper.find('button');
    await changePasswordButton.trigger('click');

    expect(wrapper.vm.isModalChangePasswordShow).toBe(true);
  });

  it('displays password validation messages correctly', async () => {
    // Simulate input in the new password field that does not meet requirements
    const newPasswordInput = wrapper.find('#newPassword');
    await newPasswordInput.setValue('short');

    await flushPromises();

    expect(wrapper.find('.text-sm.text-primaryTextColor').text()).toContain('Minimal 8 karakter');
    expect(wrapper.vm.hasMinLength).toBe(false); // Should not meet minimum length
  });

  it('successfully changes password when valid', async () => {
    // Simulate valid password input
    wrapper.vm.oldPassword = 'oldPassword123!';
    wrapper.vm.newPassword = 'NewPassword123!';
    wrapper.vm.confirmNewPassword = 'NewPassword123!';
    wrapper.vm.isPasswordMatched = true;
    wrapper.vm.hasMinLength = true;
    wrapper.vm.hasNumber = true;
    wrapper.vm.hasUppercase = true;
    wrapper.vm.hasLowercase = true;
    wrapper.vm.hasSymbol = true;

    await wrapper.vm.changePassword();

    expect(authServiceMock.changePassword).toHaveBeenCalledWith('johndoe@example.com', 'oldPassword123!', 'NewPassword123!');
    expect(wrapper.vm.isSuccess).toBe(true); // Show success modal
  });

  it('displays error when password change fails due to incorrect old password', async () => {
    // Cast the method to Jest mock so we can use mockRejectedValueOnce
    (authServiceMock.changePassword as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Password Lama tidak sesuai' } },
    });

    wrapper.vm.oldPassword = 'wrongOldPassword';
    wrapper.vm.newPassword = 'NewPassword123!';
    wrapper.vm.confirmNewPassword = 'NewPassword123!';
    wrapper.vm.isPasswordMatched = true;

    await wrapper.vm.changePassword();

    expect(wrapper.vm.isOldPasswordWrong).toBe(true);
    expect(notifyError).toHaveBeenCalledWith('Password lama anda salah, mohon periksa kembali password lama anda!', 7000);
  });

  it('prevents form submission when new password does not meet the requirements', async () => {
    wrapper.vm.newPassword = 'short';
    wrapper.vm.oldPassword = 'oldPassword123!';

    await wrapper.vm.changePassword();

    expect(notifyError).toHaveBeenCalledWith('Password tidak memenuhi persyaratan, mohon lengkapi persyaratan tersebut!', 7000);
    expect(authServiceMock.changePassword).not.toHaveBeenCalled();
  });

  it('resets input fields and attributes after successful password change', async () => {
    // Simulate successful password change
    wrapper.vm.oldPassword = 'oldPassword123!';
    wrapper.vm.newPassword = 'NewPassword123!';
    wrapper.vm.confirmNewPassword = 'NewPassword123!';
    wrapper.vm.isPasswordMatched = true;

    await wrapper.vm.changePassword();

    // Check that input fields and attributes are reset
    expect(wrapper.vm.oldPassword).toBe('');
    expect(wrapper.vm.newPassword).toBe('');
    expect(wrapper.vm.confirmNewPassword).toBe('');
    expect(wrapper.vm.hasMinLength).toBe(false);
    expect(wrapper.vm.isPasswordMatched).toBe(false);
  });

  it('renders the loading spinner when data is being fetched', async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });
});
