import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import VerifikasiSSO from '@/views/VerifikasiSSO.vue';
import LoginService from '@/services/auth-service';

// Mock dependencies
vi.mock('@/services/auth-service');

const mocks = vi.hoisted(() => ({
  encryptStorage: {
    setItem: vi.fn(),
    clear: vi.fn(),
    decryptValue: vi.fn(),
  }
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve(mocks.encryptStorage),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: { code: 'test-sso-code' }
  }),
}));

const mockPush = vi.fn();
vi.mock('@/router', () => ({
  default: {
    push: (...args) => mockPush(...args),
  },
}));

vi.mock('crypto-js', () => ({
  default: {
    HmacSHA512: vi.fn(() => ({
      toString: () => 'mocked-hash'
    }))
  }
}));

const mockInvalidateSession = vi.fn();
vi.mock('@/store/storeSession', () => ({
  useSessionStore: () => ({
    invalidateSession: mockInvalidateSession
  })
}));

// Mock global window method
Object.defineProperty(window, 'userHashSecretKey', {
  value: vi.fn(() => 'secret-key'),
  writable: true,
});

// Mock console methods
global.console.error = vi.fn();

describe('VerifikasiSSO.vue', () => {
  let pinia: any;
  let mockLoginService: any;
  
  const createWrapper = (): any => {
    return mount(VerifikasiSSO, {
      global: {
        plugins: [pinia],
      },
    });
  };

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    
    // Reset mocks
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Mock LoginService
    mockLoginService = {
      verifikasiSSO: vi.fn(),
    };
    (LoginService as any).mockImplementation(() => mockLoginService);
    
    // Mock import.meta.env
    vi.stubEnv('MODE', 'development');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('should handle successful SSO verification and set storage (Production)', async () => {
    vi.stubEnv('MODE', 'production');
    mockLoginService.verifikasiSSO.mockResolvedValue({
      success: true,
      data: {
        nama_pegawai: 'John Doe',
        uuid_sentral: '123'
      }
    });

    createWrapper();

    await flushPromises();

    expect(mocks.encryptStorage.setItem).toHaveBeenCalledWith('nama_pegawai', 'John Doe');
    expect(mocks.encryptStorage.setItem).toHaveBeenCalledWith('level_sentral', '123');
    expect(mocks.encryptStorage.setItem).toHaveBeenCalledWith('user_hash', 'mocked-hash');
    expect(mockPush).toHaveBeenCalledWith('/peta');
  });

  it('should handle successful SSO verification with uuid_sentral "0" (Production)', async () => {
    vi.stubEnv('MODE', 'production');
    mockLoginService.verifikasiSSO.mockResolvedValue({
      success: true,
      data: {
        nama_pegawai: 'John Doe',
        uuid_sentral: '0'
      }
    });

    createWrapper();

    await flushPromises();

    expect(mocks.encryptStorage.setItem).toHaveBeenCalledWith('level_sentral', 0);
    expect(mockPush).toHaveBeenCalledWith('/peta');
  });

   it('should handle successful SSO verification with empty uuid_sentral (Production)', async () => {
    vi.stubEnv('MODE', 'production');
    mockLoginService.verifikasiSSO.mockResolvedValue({
      success: true,
      data: {
        nama_pegawai: 'John Doe',
        uuid_sentral: ''
      }
    });

    createWrapper();

    await flushPromises();

    expect(mocks.encryptStorage.setItem).toHaveBeenCalledWith('level_sentral', 0);
    expect(mockPush).toHaveBeenCalledWith('/peta');
  });

  it('should handle successful SSO verification and set storage (Development)', async () => {
    vi.stubEnv('MODE', 'development');
    mockLoginService.verifikasiSSO.mockResolvedValue({
      success: true,
      data: {
        nama_pegawai: 'Dev User',
        uuid_sentral: '456'
      }
    });

    const mockLocalStorage = { setItem: vi.fn(), clear: vi.fn() };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    createWrapper();

    await flushPromises();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nama_pegawai', 'Dev User');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('level_sentral', '456');
    expect(mockPush).toHaveBeenCalledWith('/peta');
  });

  it('should handle failure SSO response (Production) with wait delay', async () => {
    vi.stubEnv('MODE', 'production');
    mockLoginService.verifikasiSSO.mockResolvedValue({ success: false });

    const wrapper = createWrapper();

    await flushPromises();
    expect(wrapper.vm.isError).toBe(true);

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);
    await flushPromises();

    expect(mocks.encryptStorage.clear).toHaveBeenCalled();
    expect(mockInvalidateSession).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should handle failure SSO response (Development) with wait delay', async () => {
    vi.stubEnv('MODE', 'development');
    mockLoginService.verifikasiSSO.mockResolvedValue({ success: false });

    const mockLocalStorage = { setItem: vi.fn(), clear: vi.fn() };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    const wrapper = createWrapper();

    await flushPromises();
    expect(wrapper.vm.isError).toBe(true);

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);
    await flushPromises();

    expect(mockLocalStorage.clear).toHaveBeenCalled();
    expect(mockInvalidateSession).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should handle exception during SSO (Production) with wait delay', async () => {
    vi.stubEnv('MODE', 'production');
    const error = new Error('Network error');
    mockLoginService.verifikasiSSO.mockRejectedValue(error);

    const wrapper = createWrapper();

    await flushPromises();

    // Verify error state
    expect(wrapper.vm.isError).toBe(true);

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);
    await flushPromises();

    expect(mocks.encryptStorage.clear).toHaveBeenCalled();
    expect(mockInvalidateSession).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(console.error).toHaveBeenCalledWith("Error fetching data:", error);
  });

  it('should handle exception during SSO (Development) with wait delay', async () => {
    vi.stubEnv('MODE', 'development');
    const error = new Error('API Error');
    mockLoginService.verifikasiSSO.mockRejectedValue(error);

    const mockLocalStorage = { setItem: vi.fn(), clear: vi.fn() };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    const wrapper = createWrapper();

    await flushPromises();
    expect(wrapper.vm.isError).toBe(true);

    // Fast-forward 5 seconds
    vi.advanceTimersByTime(5000);
    await flushPromises();

    expect(mockLocalStorage.clear).toHaveBeenCalled();
    expect(mockInvalidateSession).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(console.error).toHaveBeenCalledWith("Error fetching data:", error);
  });

  it('should log error after handling it', async () => {
    vi.stubEnv('MODE', 'production');
    const error = new Error('Critical error');
    mockLoginService.verifikasiSSO.mockRejectedValue(error);
    
    createWrapper();
    
    await flushPromises();
    vi.advanceTimersByTime(5000);
    await flushPromises();
    
    expect(console.error).toHaveBeenCalledWith("Error fetching data:", error);
  });
});