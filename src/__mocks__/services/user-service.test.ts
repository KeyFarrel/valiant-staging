import UserService from '@/services/user-service';
import BaseService from '@/services/base-service';

// Mock FingerprintJS
jest.mock('@fingerprintjs/fingerprintjs', () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({
      visitorId: 'mocked-visitor-id'
    })
  })
}));

// Mock CryptoJS
jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('encrypted-data')
    })
  },
  enc: {
    Utf8: {}
  }
}));

describe('UserService', () => {
  let service: UserService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    service = new UserService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getUserData with all parameters', async () => {
    const mockResponse = { data: 'test user data' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getUserData(1, 10, 'John');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user', {
      page: 1,
      limit: 10,
      search: 'John'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getUserData without parameters', async () => {
    const mockResponse = { data: 'test user data no params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getUserData();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user', {
      page: undefined,
      limit: undefined,
      search: undefined
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getUserById with correct parameters', async () => {
    const mockResponse = { data: 'test user' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getUserById(123);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user/123');
    expect(result).toEqual(mockResponse);
  });

  it('should call getSentral with correct parameters', async () => {
    const mockResponse = { data: 'test sentral' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentral();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-sentral');
    expect(result).toEqual(mockResponse);
  });

  it('should call getRole with correct parameters', async () => {
    const mockResponse = { data: 'test role' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getRole();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role/combo-role');
    expect(result).toEqual(mockResponse);
  });

  it('should call getInduk with correct parameters', async () => {
    const mockResponse = { data: 'test induk' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getInduk();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pengelola');
    expect(result).toEqual(mockResponse);
  });

  it('should call getPembina with parameters', async () => {
    const mockResponse = { data: 'test pembina' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const params = { id_pengelola: 1, status: 'active' };
    const result = await service.getPembina(params);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pembina', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getPembina without parameters', async () => {
    const mockResponse = { data: 'test pembina no params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPembina();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pembina', undefined);
    expect(result).toEqual(mockResponse);
  });

  it('should call getMesin with correct parameters', async () => {
    const mockResponse = { data: 'test mesin' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesin();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-mesin');
    expect(result).toEqual(mockResponse);
  });

  it('should call getLevel with correct parameters', async () => {
    const mockResponse = { data: 'test level' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getLevel();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/level');
    expect(result).toEqual(mockResponse);
  });

  it('should call createUser with correct parameters', async () => {
    const mockResponse = { data: 'user created' };
    const dataToPost = { 
      name: 'John Doe', 
      email: 'john@example.com',
      role: 'Admin',
      id_pengelola: 1,
      id_pembina: 2
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.createUser(dataToPost);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user', dataToPost);
    expect(result).toEqual(mockResponse);
  });

  it('should call resetPassword with correct parameters', async () => {
    const mockResponse = { data: 'password reset' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.resetPassword('john@example.com', 'reset@example.com');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user/reset-password', {
      email_confirm: 'john@example.com',
      email: 'reset@example.com'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call updateUser with correct parameters', async () => {
    const mockResponse = { data: 'user updated' };
    const dataToUpdate = { 
      name: 'John Updated',
      email: 'john.updated@example.com',
      status: 'active'
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateUser(123, dataToUpdate);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user/123', dataToUpdate);
    expect(result).toEqual(mockResponse);
  });

  it('should call getSentralByPengelola with correct parameters', async () => {
    const mockResponse = { data: 'test sentral by pengelola' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentralByPengelola(1, 2);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-sentral', {
      id_pengelola: 1,
      id_pembina: 2
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call sendEmailOtp with correct parameters', async () => {
    const mockResponse = { data: 'OTP sent' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.sendEmailOtp();

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user/otp-change-password');
    expect(result).toEqual(mockResponse);
  });

  it('should call verifyOtp with correct parameters', async () => {
    const mockResponse = { data: 'OTP verified' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.verifyOtp('123456');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user/verify-otp-change-password', {
      otp: '123456'
    });
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getUserData', async () => {
    const mockError = new Error('User Data Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getUserData(1, 10, 'search')).rejects.toThrow('User Data Error');
  });

  it('should handle errors in getUserById', async () => {
    const mockError = new Error('User Not Found');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getUserById(999)).rejects.toThrow('User Not Found');
  });

  it('should handle errors in createUser', async () => {
    const mockError = new Error('Create User Error');
    mockPost.mockRejectedValueOnce(mockError);

    const userData = { name: 'Test User', email: 'test@example.com' };
    await expect(service.createUser(userData)).rejects.toThrow('Create User Error');
  });

  it('should handle errors in resetPassword', async () => {
    const mockError = new Error('Password Reset Error');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.resetPassword('email1@test.com', 'email2@test.com')).rejects.toThrow('Password Reset Error');
  });

  it('should handle errors in updateUser', async () => {
    const mockError = new Error('Update User Error');
    mockPost.mockRejectedValueOnce(mockError);

    const updateData = { name: 'Updated Name' };
    await expect(service.updateUser(123, updateData)).rejects.toThrow('Update User Error');
  });

  it('should handle errors in sendEmailOtp', async () => {
    const mockError = new Error('Send OTP Error');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.sendEmailOtp()).rejects.toThrow('Send OTP Error');
  });

  it('should handle errors in verifyOtp', async () => {
    const mockError = new Error('Verify OTP Error');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.verifyOtp('123456')).rejects.toThrow('Verify OTP Error');
  });

  // Test parameter edge cases
  it('should handle null parameters in getUserData', async () => {
    const mockResponse = { data: 'test user data null params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getUserData(null, null, null);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user', {
      page: null,
      limit: null,
      search: null
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty data in createUser', async () => {
    const mockResponse = { data: 'user created with empty data' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.createUser({});

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user', {});
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty data in updateUser', async () => {
    const mockResponse = { data: 'user updated with empty data' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateUser(123, {});

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user/123', {});
    expect(result).toEqual(mockResponse);
  });

  it('should handle special characters in verifyOtp', async () => {
    const mockResponse = { data: 'OTP verified with special chars' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const specialOtp = 'ABC123!@#';
    const result = await service.verifyOtp(specialOtp);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/user/verify-otp-change-password', {
      otp: specialOtp
    });
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
