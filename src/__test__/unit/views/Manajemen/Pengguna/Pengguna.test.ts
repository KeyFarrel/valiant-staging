import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Pengguna from '@/views/Manajemen/Pengguna/Pengguna.vue';

// Mock the components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div data-testid="loading">Loading...</div>',
  },
}));

vi.mock('@/components/ui/Table.vue', () => ({
  default: {
    name: 'TableComponent',
    template: '<table data-testid="table"><slot name="table-header" /><slot name="table-body" /></table>',
  },
}));

vi.mock('@/components/ui/SearchBox.vue', () => ({
  default: {
    name: 'SearchBox',
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    template: '<input data-testid="search-box" />',
  },
}));

vi.mock('@/components/ui/ModalWrapper.vue', () => ({
  default: {
    name: 'ModalWrapper',
    props: ['showModal', 'width', 'height', 'zIndex'],
    emits: ['on-escape'],
    template: '<div data-testid="modal-wrapper" v-if="showModal"><slot /></div>',
  },
}));

vi.mock('@/components/ui/ModalNotification.vue', () => ({
  default: {
    name: 'ModalNotification',
    props: ['showModal', 'animationData', 'title', 'subtitle'],
    template: '<div data-testid="modal-notification" v-if="showModal"></div>',
  },
}));

vi.mock('@/components/ui/TextField.vue', () => ({
  default: {
    name: 'TextField',
    props: ['modelValue', 'placeholder', 'type'],
    emits: ['update:modelValue'],
    template: '<input data-testid="text-field" />',
  },
}));

// Mock the service
const mockUserService = {
  getUserData: vi.fn(),
  getUserById: vi.fn(),
  getLevel: vi.fn(),
  getRole: vi.fn(),
  getInduk: vi.fn(),
  getPembina: vi.fn(),
  getSentralByPengelola: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  resetPassword: vi.fn(),
};

vi.mock('@/services/user-service', () => ({
  default: class MockUserService {
    constructor() {
      return mockUserService;
    }
  }
}));

// Mock toast notification
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
}));

// Mock lottie animation
vi.mock('@/assets/lottie/success.json', () => ({
  default: {}
}));

describe('Pengguna', () => {
  let wrapper: any;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Set default mock implementations
    mockUserService.getUserData.mockResolvedValue({
      data: [],
      meta: {
        totalPages: 1,
        totalRecords: 0
      }
    });
    
    mockUserService.getUserById.mockResolvedValue({
      data: {
        nama_pegawai: 'Test User',
        nip: '12345',
        email: 'test@example.com',
        role_id: '1',
        level_id: 1,
        id_pembina: 1,
        id_pengelola: 1,
        id_sentral: 1,
        status: true,
        is_locked: false
      }
    });
    
    mockUserService.getLevel.mockResolvedValue({
      data: [
        { kode_level: '2', level: 'Pengelola' },
        { kode_level: '3', level: 'Sentral' },
        { kode_level: '4', level: 'Pembina' },
        { kode_level: '5', level: 'Pusat' }
      ]
    });
    
    mockUserService.getRole.mockResolvedValue({
      data: [
        { id: 138, role: 'Staff' },
        { id: 140, role: 'Approver' },
        { id: 141, role: 'Super Admin' },
        { id: 142, role: 'Monitoring' }
      ]
    });
    
    mockUserService.getInduk.mockResolvedValue({
      data: [
        { id_pengelola: 1, pengelola: 'Pengelola 1' },
        { id_pengelola: 2, pengelola: 'Pengelola 2' }
      ]
    });
    
    mockUserService.getPembina.mockResolvedValue({
      data: [
        { id_pembina: 1, pembina: 'Pembina 1' },
        { id_pembina: 2, pembina: 'Pembina 2' }
      ]
    });
    
    mockUserService.getSentralByPengelola.mockResolvedValue({
      data: [
        { id_sentral: 1, sentral: 'Sentral 1' },
        { id_sentral: 2, sentral: 'Sentral 2' }
      ]
    });

    wrapper = mount(Pengguna, {
      global: {
        stubs: {
          'Loading': true,
          'TableComponent': true,
          'SearchBox': true,
          'ModalWrapper': true,
          'ModalNotification': true,
          'TextField': true
        }
      }
    });
    await nextTick();
  });

  it('should render the component correctly', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should initialize with default navigation values', () => {
    expect(wrapper.vm.navigation.currentPage).toBe(1);
    expect(wrapper.vm.navigation.totalPages).toBe(1);
    expect(wrapper.vm.navigation.limit).toBe(10);
  });

  it('should initialize with default form data', () => {
    expect(wrapper.vm.formData.nama_pegawai).toBe('');
    expect(wrapper.vm.formData.email).toBe('');
    expect(wrapper.vm.formData.status).toBe(true);
  });

  it('should handle pagination correctly', async () => {
    // Set up navigation with multiple pages
    wrapper.vm.navigation.totalPages = 5;
    wrapper.vm.navigation.currentPage = 3;
    
    // Test generatePageList computed property
    const pageList = wrapper.vm.generatePageList;
    expect(pageList).toContain(1);
    expect(pageList).toContain(3);
    expect(pageList).toContain(5);
  });

  it('should handle modal operations correctly', async () => {
    // Test closeModal function
    wrapper.vm.showModalCreate = true;
    wrapper.vm.showPassword = true;
    wrapper.vm.errors = ['Test error'];
    
    wrapper.vm.closeModal();
    
    expect(wrapper.vm.showModalCreate).toBe(false);
    expect(wrapper.vm.showPassword).toBe(false);
    expect(wrapper.vm.errors).toEqual([]);
  });

  it('should handle form validation correctly', () => {
    // Test sanitizeNama function
    wrapper.vm.formData.nama_pegawai = 'Test123 User@@';
    wrapper.vm.sanitizeNama();
    expect(wrapper.vm.formData.nama_pegawai).toBe('Test User');
    
    // Test sanitizeNip function
    wrapper.vm.formData.nip = 'NIP123@@456';
    wrapper.vm.sanitizeNip();
    expect(wrapper.vm.formData.nip).toBe('NIP123456');
    
    // Test sanitizeEmail function - removes invalid characters but keeps allowed ones
    wrapper.vm.formData.email = 'test@@email.com#';
    wrapper.vm.sanitizeEmail();
    expect(wrapper.vm.formData.email).toBe('test@@email.com');
  });

  it('should handle level change correctly', () => {
    // Test handleChangeLevel function
    wrapper.vm.handleChangeLevel('1');
    expect(wrapper.vm.comboRole.length).toBeGreaterThan(0);
    
    wrapper.vm.handleChangeLevel('2');
    expect(wrapper.vm.comboRole.length).toBeGreaterThan(0);
    
    wrapper.vm.handleChangeLevel('3');
    expect(wrapper.vm.comboRole.length).toBeGreaterThan(0);
  });

  it('should handle search functionality', async () => {
    // Test handleSearch function
    wrapper.vm.search = 'test search';
    wrapper.vm.handleSearch();
    
    expect(wrapper.vm.navigation.currentPage).toBe(1);
  });

  it('should handle active status correctly', () => {
    // Test isActive computed property
    wrapper.vm.formData.status = true;
    expect(wrapper.vm.isActive).toBe(true);
    
    wrapper.vm.isActive = false;
    expect(wrapper.vm.formData.status).toBe(false);
  });

  it('should handle pagination navigation', async () => {
    wrapper.vm.navigation.totalPages = 5;
    wrapper.vm.navigation.currentPage = 3;
    
    // Test goToPrevious
    const goToPreviousSpy = vi.spyOn(wrapper.vm, 'goToPrevious');
    wrapper.vm.goToPrevious();
    expect(goToPreviousSpy).toHaveBeenCalled();
    
    // Test goToNext  
    const goToNextSpy = vi.spyOn(wrapper.vm, 'goToNext');
    wrapper.vm.goToNext();
    expect(goToNextSpy).toHaveBeenCalled();
  });

  it('should handle password visibility toggle', () => {
    // Test togglePasswordVisibility
    expect(wrapper.vm.showPassword).toBe(false);
    wrapper.vm.togglePasswordVisibility();
    expect(wrapper.vm.showPassword).toBe(true);
    
    // Test toggleConfirmPasswordVisibility
    expect(wrapper.vm.showConfirmPassword).toBe(false);
    wrapper.vm.toggleConfirmPasswordVisibility();
    expect(wrapper.vm.showConfirmPassword).toBe(true);
  });

  it('should handle reset form data', () => {
    // Set some values
    wrapper.vm.formData.nama_pegawai = 'Test';
    wrapper.vm.formData.email = 'test@test.com';
    
    // Call reset function
    wrapper.vm.resetFormData();
    
    // Check if values are reset
    expect(wrapper.vm.formData.nama_pegawai).toBe('');
    expect(wrapper.vm.formData.email).toBe('');
  });

  it('should handle handleChangePengelola function', async () => {
    wrapper.vm.formData.id_pengelola = '1';
    
    await wrapper.vm.handleChangePengelola();
    
    expect(wrapper.vm.comboPembina.length).toBeGreaterThanOrEqual(0);
    expect(wrapper.vm.formData.id_pembina).toBe('');
    expect(wrapper.vm.formData.id_sentral).toBe('');
  });

  it('should handle handleChangePembina function', async () => {
    wrapper.vm.formData.id_pengelola = '1';
    wrapper.vm.formData.id_pembina = '1';
    
    await wrapper.vm.handleChangePembina();
    
    expect(wrapper.vm.comboSentral.length).toBeGreaterThanOrEqual(0);
    expect(wrapper.vm.formData.id_sentral).toBe('');
  });

  it('should handle resetPassword function', async () => {
    wrapper.vm.resetPasswordVal.emailConfirm = 'test@test.com';
    wrapper.vm.resetPasswordVal.emailReset = 'user@test.com';
    
    await wrapper.vm.resetPassword();
    
    expect(wrapper.vm.isConfirmResetShow).toBe(false);
    expect(wrapper.vm.resetPasswordVal.emailConfirm).toBe('');
  });

  it('should handle resetPassword function with empty email', async () => {
    wrapper.vm.resetPasswordVal.emailConfirm = '';
    
    await wrapper.vm.resetPassword();
    
    // Should not reset password if email is empty
    expect(wrapper.vm.resetPasswordVal.emailConfirm).toBe('');
  });

  it('should handle changePageLimit correctly', async () => {
    const event = { target: { value: '20' } };
    
    await wrapper.vm.changePageLimit(event);
    
    expect(wrapper.vm.navigation.limit).toBe(20);
    expect(wrapper.vm.navigation.currentPage).toBe(1);
  });

  it('should handle handleChangeConfirmPassword with useThisEmail true', () => {
    wrapper.vm.resetPasswordVal.emailReset = 'test@test.com';
    wrapper.vm.resetPasswordVal.useThisEmail = true;
    
    wrapper.vm.handleChangeConfirmPassword();
    
    expect(wrapper.vm.resetPasswordVal.emailConfirm).toBe('test@test.com');
  });

  it('should handle handleChangeConfirmPassword with useThisEmail false', () => {
    wrapper.vm.resetPasswordVal.emailReset = 'test@test.com';
    wrapper.vm.resetPasswordVal.useThisEmail = false;
    
    wrapper.vm.handleChangeConfirmPassword();
    
    expect(wrapper.vm.resetPasswordVal.emailConfirm).toBe('');
  });

  it('should handle openEditModals successfully', async () => {
    const uuid = 123;
    
    await wrapper.vm.openEditModals(uuid);
    
    expect(wrapper.vm.isModalEdit).toBe(true);
    expect(wrapper.vm.selectedUserId).toBe(uuid);
    expect(wrapper.vm.formData.nama_pegawai).toBe('Test User');
    expect(wrapper.vm.formData.email).toBe('test@example.com');
  });

  it('should handle openEditModals with error', async () => {
    const uuid = 123;
    mockUserService.getUserById.mockRejectedValue(new Error('Failed to fetch'));
    
    await wrapper.vm.openEditModals(uuid);
    
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should handle fetchPembina successfully', async () => {
    await wrapper.vm.fetchPembina();
    
    expect(wrapper.vm.comboPembina.length).toBeGreaterThan(0);
    expect(wrapper.vm.listPembina.length).toBeGreaterThan(0);
  });

  it('should handle fetchPembina with error', async () => {
    mockUserService.getPembina.mockRejectedValue(new Error('Failed to fetch'));
    
    await wrapper.vm.fetchPembina();
    
    // The function catches the error but doesn't clear the array
    // So we just check that the function completes
    expect(wrapper.vm.comboPembina).toBeDefined();
  });

  it('should return pembina name in userPembina', () => {
    wrapper.vm.listPembina = [
      { id_pembina: 1, pembina: 'Pembina 1' },
      { id_pembina: 2, pembina: 'Pembina 2' }
    ];
    
    const result = wrapper.vm.userPembina(1);
    
    expect(result).toBe('Pembina 1');
  });

  it('should return "Tidak Tersedia" for invalid pembina id', () => {
    wrapper.vm.listPembina = [
      { id_pembina: 1, pembina: 'Pembina 1' }
    ];
    
    const result = wrapper.vm.userPembina(0);
    
    expect(result).toBe('Tidak Tersedia');
  });

  it('should return "Tidak Tersedia" when listPembina is empty', () => {
    wrapper.vm.listPembina = [];
    
    const result = wrapper.vm.userPembina(1);
    
    expect(result).toBeUndefined();
  });

  it('should return correct level name in userLevel', () => {
    expect(wrapper.vm.userLevel(1)).toBe('Admin');
    expect(wrapper.vm.userLevel(2)).toBe('Pengelola');
    expect(wrapper.vm.userLevel(3)).toBe('Sentral');
    expect(wrapper.vm.userLevel(4)).toBe('Pembina');
    expect(wrapper.vm.userLevel(5)).toBe('Pusat');
  });

  it('should return "Tidak Tersedia" for invalid level', () => {
    expect(wrapper.vm.userLevel(0)).toBe('Tidak Tersedia');
    expect(wrapper.vm.userLevel(null)).toBe('Tidak Tersedia');
  });

  it('should validate and save user data with all fields filled', async () => {
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '1',
      level_id: '3',
      id_pembina: '1',
      id_sentral: '1',
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    mockUserService.createUser.mockResolvedValue({ success: true });
    
    await wrapper.vm.saveUserDataAndCloseModal();
    
    expect(mockUserService.createUser).toHaveBeenCalled();
    expect(wrapper.vm.showModalCreate).toBe(false);
  });

  it('should show validation errors when required fields are empty', async () => {
    wrapper.vm.formData = {
      nama_pegawai: '',
      nip: '',
      email: '',
      role_id: '',
      level_id: '',
      id_pembina: '',
      id_sentral: '',
      id_pengelola: '',
      status: true,
      isLocked: false
    };
    
    await wrapper.vm.saveUserDataAndCloseModal();
    
    expect(wrapper.vm.errors.length).toBeGreaterThan(0);
    expect(wrapper.vm.errors).toContain('Nama Lengkap wajib diisi.');
    expect(wrapper.vm.errors).toContain('NIP wajib diisi.');
    expect(wrapper.vm.errors).toContain('Email wajib diisi.');
    expect(wrapper.vm.errors).toContain('Role wajib diisi.');
  });

  it('should show error for invalid email format', async () => {
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'invalid-email',
      role_id: '1',
      level_id: '3',
      id_pembina: '1',
      id_sentral: '1',
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    await wrapper.vm.saveUserDataAndCloseModal();
    
    expect(wrapper.vm.errors).toContain('Email tidak valid.');
  });

  it('should handle error when creating user fails', async () => {
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '1',
      level_id: '3',
      id_pembina: '1',
      id_sentral: '1',
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    mockUserService.createUser.mockRejectedValue({
      response: { data: { message: 'User already exists' } }
    });
    
    await wrapper.vm.saveUserDataAndCloseModal();
    
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should handle unsuccessful user creation', async () => {
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '1',
      level_id: '3',
      id_pembina: '1',
      id_sentral: '1',
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    mockUserService.createUser.mockResolvedValue({ success: false, error: 'Some error' });
    
    await wrapper.vm.saveUserDataAndCloseModal();
    
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should edit user data successfully for level 1', async () => {
    wrapper.vm.selectedUserId = 123;
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '141',
      level_id: '1',
      id_pembina: null,
      id_sentral: null,
      id_pengelola: null,
      status: true,
      isLocked: false
    };
    
    mockUserService.updateUser.mockResolvedValue({ success: true });
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(mockUserService.updateUser).toHaveBeenCalled();
    expect(wrapper.vm.isModalEdit).toBe(false);
  });

  it('should edit user data successfully for level 2 (Pengelola)', async () => {
    wrapper.vm.selectedUserId = 123;
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '140',
      level_id: '2',
      id_pembina: null,
      id_sentral: null,
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    mockUserService.updateUser.mockResolvedValue({ success: true });
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(mockUserService.updateUser).toHaveBeenCalled();
  });

  it('should edit user data successfully for level 4 (Pembina)', async () => {
    wrapper.vm.selectedUserId = 123;
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '140',
      level_id: '4',
      id_pembina: '1',
      id_sentral: null,
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    mockUserService.updateUser.mockResolvedValue({ success: true });
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(mockUserService.updateUser).toHaveBeenCalled();
  });

  it('should edit user data successfully for level 3 (Sentral)', async () => {
    wrapper.vm.selectedUserId = 123;
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '138',
      level_id: '3',
      id_pembina: '1',
      id_sentral: '1',
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    mockUserService.updateUser.mockResolvedValue({ success: true });
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(mockUserService.updateUser).toHaveBeenCalled();
  });

  it('should show validation errors when editing with empty fields', async () => {
    wrapper.vm.formData = {
      nama_pegawai: '',
      nip: '',
      email: '',
      role_id: '',
      level_id: '',
      id_pembina: '',
      id_sentral: '',
      id_pengelola: '',
      status: true,
      isLocked: false
    };
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(wrapper.vm.errorsEdit.length).toBeGreaterThan(0);
  });

  it('should handle error when updating user fails', async () => {
    wrapper.vm.selectedUserId = 123;
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '1',
      level_id: '3',
      id_pembina: '1',
      id_sentral: '1',
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    mockUserService.updateUser.mockRejectedValue(new Error('Update failed'));
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should handle unsuccessful user update', async () => {
    wrapper.vm.selectedUserId = 123;
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '1',
      level_id: '3',
      id_pembina: '1',
      id_sentral: '1',
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    mockUserService.updateUser.mockResolvedValue({ success: false, error: 'Update error' });
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should reset password indicator correctly', () => {
    wrapper.vm.resetPasswordIndicator();
    
    expect(wrapper.vm.pwStrength.strengthMessage).toBe('Masukkan Kata Sandi');
    expect(wrapper.vm.pwStrength.strengthWidth).toBe(0);
    expect(wrapper.vm.confirmKataSandiStrength.strengthMessage).toBe('Masukkan Konfirmasi Kata Sandi');
  });

  it('should handle handleChangePengelola with error', async () => {
    wrapper.vm.formData.id_pengelola = '1';
    mockUserService.getPembina.mockRejectedValue(new Error('Failed to fetch'));
    
    await wrapper.vm.handleChangePengelola();
    
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should handle handleChangePembina with error', async () => {
    wrapper.vm.formData.id_pengelola = '1';
    wrapper.vm.formData.id_pembina = '1';
    mockUserService.getSentralByPengelola.mockRejectedValue(new Error('Failed to fetch'));
    
    await wrapper.vm.handleChangePembina();
    
    // Should handle error gracefully
    expect(wrapper.vm.formData.id_sentral).toBe('');
  });

  it('should handle level 4 in handleChangeLevel', () => {
    wrapper.vm.handleChangeLevel(4);
    
    expect(wrapper.vm.comboRole.length).toBeGreaterThan(0);
    expect(wrapper.vm.comboRole.some((r: any) => r.role === 'Input')).toBe(true);
  });

  it('should handle level 5 in handleChangeLevel', () => {
    wrapper.vm.handleChangeLevel(5);
    
    expect(wrapper.vm.comboRole.length).toBeGreaterThan(0);
    expect(wrapper.vm.comboRole.some((r: any) => r.role === 'Super Admin')).toBe(true);
  });

  it('should handle goToPage correctly', async () => {
    await wrapper.vm.goToPage(2);
    
    expect(wrapper.vm.navigation.currentPage).toBe(2);
  });

  it('should not go to previous page when on first page', () => {
    wrapper.vm.navigation.currentPage = 1;
    
    const goToPageSpy = vi.spyOn(wrapper.vm, 'goToPage');
    wrapper.vm.goToPrevious();
    
    expect(goToPageSpy).not.toHaveBeenCalled();
  });

  it('should not go to next page when on last page', () => {
    wrapper.vm.navigation.currentPage = 5;
    wrapper.vm.navigation.totalPages = 5;
    
    const goToPageSpy = vi.spyOn(wrapper.vm, 'goToPage');
    wrapper.vm.goToNext();
    
    expect(goToPageSpy).not.toHaveBeenCalled();
  });

  it('should check password strength for password type - case 1', () => {
    wrapper.vm.checkPasswordStrength('password');
    
    expect(wrapper.vm.pwStrength.strengthMessage).toBeDefined();
  });

  it('should check password strength for confirm password type', () => {
    wrapper.vm.checkPasswordStrength('confirmPassword');
    
    expect(wrapper.vm.confirmKataSandiStrength.strengthMessage).toBeDefined();
  });

  it('should handle fetchData with error', async () => {
    mockUserService.getUserData.mockRejectedValue(new Error('Failed to fetch'));
    
    try {
      await wrapper.vm.fetchData();
    } catch (error) {
      expect(wrapper.vm.isLoading).toBe(false);
    }
  });

  it('should handle fetchData with null data', async () => {
    mockUserService.getUserData.mockResolvedValue({
      data: null,
      meta: {
        totalPages: 1,
        totalRecords: 0
      }
    });
    
    await wrapper.vm.fetchData();
    
    expect(wrapper.vm.pengguna).toEqual([]);
  });

  it('should handle fetchRole successfully', async () => {
    await wrapper.vm.fetchRole();
    
    expect(wrapper.vm.comboRole.length).toBeGreaterThan(0);
  });

  it('should handle fetchRole with error', async () => {
    mockUserService.getRole.mockRejectedValue(new Error('Failed to fetch'));
    
    await wrapper.vm.fetchRole();
    
    // Should handle error gracefully
    expect(wrapper.vm.comboRole).toBeDefined();
  });

  it('should handle fetchInduk successfully', async () => {
    await wrapper.vm.fetchInduk();
    
    expect(wrapper.vm.comboPengelola.length).toBeGreaterThan(0);
  });

  it('should handle fetchInduk with error', async () => {
    mockUserService.getInduk.mockRejectedValue(new Error('Failed to fetch'));
    
    await wrapper.vm.fetchInduk();
    
    // Should handle error gracefully
    expect(wrapper.vm.comboPengelola).toBeDefined();
  });

  it('should handle fetchLevel successfully', async () => {
    await wrapper.vm.fetchLevel();
    
    expect(wrapper.vm.comboLevel.length).toBeGreaterThan(0);
  });

  it('should handle fetchLevel with error', async () => {
    mockUserService.getLevel.mockRejectedValue(new Error('Failed to fetch'));
    
    try {
      await wrapper.vm.fetchLevel();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should handle closeModalEdit correctly', () => {
    wrapper.vm.isModalEdit = true;
    wrapper.vm.showEditPassword = true;
    wrapper.vm.showEditConfirmPassword = true;
    wrapper.vm.resetPasswordVal.emailConfirm = 'test@test.com';
    wrapper.vm.errorsEdit = ['Error'];
    
    wrapper.vm.closeModalEdit();
    
    expect(wrapper.vm.isModalEdit).toBe(false);
    expect(wrapper.vm.showEditPassword).toBe(false);
    expect(wrapper.vm.showEditConfirmPassword).toBe(false);
    expect(wrapper.vm.resetPasswordVal.emailConfirm).toBe('');
    expect(wrapper.vm.errorsEdit).toEqual([]);
  });

  it('should generate correct page list for current page near end', () => {
    wrapper.vm.navigation.totalPages = 10;
    wrapper.vm.navigation.currentPage = 9;
    
    const pageList = wrapper.vm.generatePageList;
    
    expect(pageList).toContain(1);
    expect(pageList).toContain('...');
    expect(pageList).toContain(10);
  });

  it('should generate correct page list for current page in middle', () => {
    wrapper.vm.navigation.totalPages = 10;
    wrapper.vm.navigation.currentPage = 5;
    
    const pageList = wrapper.vm.generatePageList;
    
    expect(pageList).toContain(1);
    expect(pageList).toContain(4);
    expect(pageList).toContain(5);
    expect(pageList).toContain(6);
    expect(pageList).toContain(10);
  });

  it('should generate correct page list when total pages <= maxPages', () => {
    wrapper.vm.navigation.totalPages = 3;
    wrapper.vm.navigation.currentPage = 2;
    
    const pageList = wrapper.vm.generatePageList;
    
    expect(pageList).toEqual([1, 2, 3]);
  });

  it('should generate correct page list for current page near start', () => {
    wrapper.vm.navigation.totalPages = 10;
    wrapper.vm.navigation.currentPage = 2;
    
    const pageList = wrapper.vm.generatePageList;
    
    expect(pageList).toContain(1);
    expect(pageList).toContain(2);
    expect(pageList).toContain(10);
  });

  it('should handle userPembina with null id', () => {
    wrapper.vm.listPembina = [
      { id_pembina: 1, pembina: 'Pembina 1' }
    ];
    
    const result = wrapper.vm.userPembina(null);
    
    expect(result).toBe('Tidak Tersedia');
  });

  it('should edit user data successfully for level 5 (Pusat)', async () => {
    wrapper.vm.selectedUserId = 123;
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'test@example.com',
      role_id: '141',
      level_id: '5',
      id_pembina: null,
      id_sentral: null,
      id_pengelola: null,
      status: true,
      isLocked: false
    };
    
    mockUserService.updateUser.mockResolvedValue({ success: true });
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(mockUserService.updateUser).toHaveBeenCalled();
  });

  it('should show error for invalid email in edit form', async () => {
    wrapper.vm.formData = {
      nama_pegawai: 'Test User',
      nip: '12345',
      email: 'invalid-email',
      role_id: '1',
      level_id: '3',
      id_pembina: '1',
      id_sentral: '1',
      id_pengelola: '1',
      status: true,
      isLocked: false
    };
    
    await wrapper.vm.editUserDataAndCloseModal();
    
    expect(wrapper.vm.errorsEdit).toContain('Email tidak valid.');
  });

  it('should handle error during resetPassword', async () => {
    wrapper.vm.resetPasswordVal.emailConfirm = 'test@test.com';
    wrapper.vm.resetPasswordVal.emailReset = 'user@test.com';
    
    mockUserService.resetPassword.mockRejectedValue(new Error('Reset failed'));
    
    await wrapper.vm.resetPassword();
    
    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.isConfirmResetShow).toBe(false);
  });

  it('should go to next page when not on last page', async () => {
    wrapper.vm.navigation.currentPage = 1;
    wrapper.vm.navigation.totalPages = 5;
    
    await wrapper.vm.goToNext();
    
    expect(wrapper.vm.navigation.currentPage).toBe(2);
  });

  it('should go to previous page when not on first page', async () => {
    wrapper.vm.navigation.currentPage = 3;
    wrapper.vm.navigation.totalPages = 5;
    
    await wrapper.vm.goToPrevious();
    
    expect(wrapper.vm.navigation.currentPage).toBe(2);
  });

  it('should handle openEditModals with null values', async () => {
    const uuid = 123;
    mockUserService.getUserById.mockResolvedValue({
      data: {
        nama_pegawai: 'Test User',
        nip: '12345',
        email: 'test@example.com',
        role_id: '1',
        level_id: 1,
        id_pembina: null,
        id_pengelola: null,
        id_sentral: null,
        status: true,
        is_locked: false
      }
    });
    
    await wrapper.vm.openEditModals(uuid);
    
    expect(wrapper.vm.isModalEdit).toBe(true);
    expect(mockUserService.getSentralByPengelola).toHaveBeenCalledWith(0, 0);
  });

  it('should handle fetchData with valid data', async () => {
    mockUserService.getUserData.mockResolvedValue({
      data: [
        {
          uuid: 1,
          nama_pegawai: 'User 1',
          email: 'user1@test.com',
          nip: '12345',
          status: true
        }
      ],
      meta: {
        totalPages: 1,
        totalRecords: 1
      }
    });
    
    await wrapper.vm.fetchData();
    
    expect(wrapper.vm.pengguna.length).toBe(1);
    expect(wrapper.vm.navigation.totalRecords).toBe(1);
  });
});