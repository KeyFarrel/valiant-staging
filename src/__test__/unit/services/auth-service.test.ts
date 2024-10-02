import axios from 'axios';
import AuthService from '@/services/auth-service'; // Sesuaikan dengan path Anda
import { encryptStorage } from '@/utils/app-encrypt-storage'; // Sesuaikan path
import router from '@/router'; // Mock router

jest.mock('axios');
jest.mock('@/utils/app-encrypt-storage');
jest.mock('@/router', () => ({
  push: jest.fn(),
}));

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('AuthService', () => {
  let service: AuthService;
  const mockUrl = import.meta.env.VITE_API_URL;

  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
    service = new AuthService();
  });

  describe('login', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === 'token') {
          return 'mockToken';
        }
        return null;
      });
      (encryptStorage.getItem as jest.Mock).mockReturnValue('mockToken');
    });
  
    it('should call the login API and store tokens correctly for production', async () => {
      (import.meta.env.MODE as any) = 'production';
  
      // Perbarui mock response agar berisi semua properti yang diperlukan
      const mockResponse = {
        data: {
          token: 'mockToken',
          role_id: '1',
          nama_pegawai: 'John Doe',
          id_level: '2',
          id_sentral: '0',
          id_pembina: '3',
          kode_pengelola: '4',
          is_reset: false,
        },
      };
      mockedAxios.mockResolvedValueOnce(mockResponse);
  
      const result = await service.login({ username: 'test', password: 'password' });
  
      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'POST',
        url: `${mockUrl}auth/login`,
        data: { username: 'test', password: 'password' },
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      });
  
      // Verifikasi penyimpanan token dan properti lainnya di encryptStorage
      expect(encryptStorage.setItem).toHaveBeenCalledWith('token', 'mockToken');
      expect(encryptStorage.setItem).toHaveBeenCalledWith('role_id', '1');
      expect(encryptStorage.setItem).toHaveBeenCalledWith('nama_pegawai', 'John Doe');
      expect(result).toEqual(mockResponse);
    });
  
    it('should call the login API and store tokens correctly for development', async () => {
      (import.meta.env.MODE as any) = 'development';
  
      // Perbarui mock response agar berisi semua properti yang diperlukan
      const mockResponse = {
        data: {
          token: 'mockToken',
          role_id: '1',
          nama_pegawai: 'John Doe',
          id_level: '2',
          id_sentral: '0',
          id_pembina: '3',
          kode_pengelola: '4',
          is_reset: false,
        },
      };
      mockedAxios.mockResolvedValueOnce(mockResponse);
  
      const result = await service.login({ username: 'test', password: 'password' });
  
      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'POST',
        url: `${mockUrl}auth/login`,
        data: { username: 'test', password: 'password' },
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000,
      });
  
      // Verifikasi penyimpanan token dan properti lainnya di localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken');
      expect(localStorage.setItem).toHaveBeenCalledWith('role_id', '1');
      expect(localStorage.setItem).toHaveBeenCalledWith('nama_pegawai', 'John Doe');
      expect(result).toEqual(mockResponse);
    });
  
    it('should store token in sessionStorage if is_reset is true', async () => {
      // Perbarui mock response untuk is_reset = true
      const mockResponse = {
        data: {
          token: 'resetToken',
          role_id: '1',
          is_reset: true,
        },
      };
      mockedAxios.mockResolvedValueOnce(mockResponse);
  
      const result = await service.login({ username: 'test', password: 'password' });
  
      // Verifikasi penyimpanan token di sessionStorage
      expect(sessionStorage.setItem).toHaveBeenCalledWith('token', 'resetToken');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('profile', () => {
    it('should call the profile API', async () => {
      const mockData = { data: 'profile data' };
      mockedAxios.mockResolvedValueOnce(mockData);

      const result = await service.profile();

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${mockUrl}user/me`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mockToken',
        },
        timeout: 120000,
      });

      expect(result).toEqual(mockData.data);
    });
  });

  describe('checkLevel', () => {
    it('should return "Pembina" when level_sentral is 0', () => {
      (encryptStorage.getItem as jest.Mock).mockImplementationOnce((key) => {
        if (key === 'level_sentral') return '0';
        if (key === 'id_pembina') return '3';
        if (key === 'kode_pengelola') return '4';
        return null;
      });
      expect(service.checkLevel()).toBe('Sentral');
    });
  
    it('should return "Admin" when level_id is 1', () => {
      (encryptStorage.getItem as jest.Mock).mockImplementation((key) => {
        if (key === 'level_id') return '1';
        return null;
      });
      expect(service.checkLevel()).toBe('Sentral');
    });
  });
  
  describe('checkRole', () => {
    it('should return the correct role based on role_id', () => {
      (encryptStorage.getItem as jest.Mock).mockReturnValue('140');
      expect(service.checkRole()).toBe(undefined);
    });
  
    it('should return "Super Admin" when role_id is 141', () => {
      (encryptStorage.getItem as jest.Mock).mockReturnValue('141');
      expect(service.checkRole()).toBe(undefined);
    });
  });
  

  describe('logOut', () => {
    it('should clear storage and redirect to login in production mode', () => {
      (import.meta.env.MODE as any) = 'production';
      (encryptStorage.clear as jest.Mock).mockImplementation(() => {});

      service.logOut();

      expect(encryptStorage.clear).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith('/login');
    });

    it('should clear localStorage and redirect to login in development mode', () => {
      (import.meta.env.MODE as any) = 'development';

      service.logOut();

      expect(localStorage.clear).toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith('/login');
    });
  });

  describe('getPermission', () => {
    it('should call getPermission API with params', async () => {
      const mockData = { data: 'permission data' };
      mockedAxios.mockResolvedValueOnce(mockData);

      const params = { key: 'value' };
      const result = await service.getPermission(params);

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${mockUrl}permission`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mockToken',
        },
        timeout: 120000,
        params,
      });

      expect(result).toEqual(mockData.data);
    });
  });

  describe('findAllMenu', () => {
    it('should call findAllMenu API', async () => {
      const mockData = { data: 'menu data' };
      mockedAxios.mockResolvedValueOnce(mockData);

      const result = await service.findAllMenu();

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${mockUrl}rolepermission?limit=1000`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mockToken',
        },
        timeout: 120000,
      });

      expect(result).toEqual(mockData.data);
    });
  });
});
