import RoleService from '@/services/role-service';
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

describe('RoleService', () => {
  let service: RoleService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new RoleService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
    
    // Mock console.log for updateRolePermission
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getRoleData with all parameters', async () => {
    const mockResponse = { data: 'mocked response for getRoleData' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getRoleData(1, 10, 'admin');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role', {
      page: 1,
      limit: 10,
      role: 'admin'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getRoleData with partial parameters', async () => {
    const mockResponse = { data: 'mocked response for getRoleData partial' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getRoleData(1, 10);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role', {
      page: 1,
      limit: 10,
      role: undefined
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getRoleData without parameters', async () => {
    const mockResponse = { data: 'mocked response for getRoleData no params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getRoleData();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role', {
      page: undefined,
      limit: undefined,
      role: undefined
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getLevel with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getLevel' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getLevel();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/level');
    expect(result).toEqual(mockResponse);
  });

  it('should call getRoleById with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getRoleById' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getRoleById(123);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role/123');
    expect(result).toEqual(mockResponse);
  });

  it('should call createRole with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for createRole' };
    const formData = { 
      name: 'Admin Role', 
      description: 'Administrator role with full access',
      permissions: ['read', 'write', 'delete']
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.createRole(formData);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role', formData);
    expect(result).toEqual(mockResponse);
  });

  it('should call updateRole with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for updateRole' };
    const data = { 
      name: 'Manager Role', 
      description: 'Manager role with limited access',
      permissions: ['read', 'write']
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateRole(123, data);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role/123', data);
    expect(result).toEqual(mockResponse);
  });

  it('should call getPermission with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPermission' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPermission();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/permission');
    expect(result).toEqual(mockResponse);
  });

  it('should call getPermissionByRoleId with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPermissionByRoleId' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPermissionByRoleId(123);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/rolepermission?role_id=123');
    expect(result).toEqual(mockResponse);
  });

  it('should call updateRolePermission with correct parameters and log data', async () => {
    const mockResponse = { data: 'mocked response for updateRolePermission' };
    const data = { 
      permissions: ['read', 'write', 'delete'],
      role_id: 123
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateRolePermission(123, data);

    expect(consoleSpy).toHaveBeenCalledWith('Sending data:', data);
    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/rolepermission/123', data);
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getRoleData', async () => {
    const mockError = new Error('Role Data Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getRoleData(1, 10, 'admin')).rejects.toThrow('Role Data Error');
  });

  it('should handle errors in getLevel', async () => {
    const mockError = new Error('Level Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getLevel()).rejects.toThrow('Level Error');
  });

  it('should handle errors in getRoleById', async () => {
    const mockError = new Error('Role Not Found');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getRoleById(999)).rejects.toThrow('Role Not Found');
  });

  it('should handle errors in createRole', async () => {
    const mockError = new Error('Create Role Error');
    mockPost.mockRejectedValueOnce(mockError);

    const formData = { name: 'Test Role', permissions: ['read'] };
    await expect(service.createRole(formData)).rejects.toThrow('Create Role Error');
  });

  it('should handle errors in updateRole', async () => {
    const mockError = new Error('Update Role Error');
    mockPost.mockRejectedValueOnce(mockError);

    const data = { name: 'Updated Role' };
    await expect(service.updateRole(123, data)).rejects.toThrow('Update Role Error');
  });

  it('should handle errors in getPermission', async () => {
    const mockError = new Error('Permission Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getPermission()).rejects.toThrow('Permission Error');
  });

  it('should handle errors in getPermissionByRoleId', async () => {
    const mockError = new Error('Permission by Role Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getPermissionByRoleId(123)).rejects.toThrow('Permission by Role Error');
  });

  it('should handle errors in updateRolePermission', async () => {
    const mockError = new Error('Update Role Permission Error');
    mockPost.mockRejectedValueOnce(mockError);

    const data = { permissions: ['read'] };
    await expect(service.updateRolePermission(123, data)).rejects.toThrow('Update Role Permission Error');
    expect(consoleSpy).toHaveBeenCalledWith('Sending data:', data);
  });

  // Test parameter edge cases
  it('should handle null role filter in getRoleData', async () => {
    const mockResponse = { data: 'mocked response for null role' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getRoleData(1, 10, null);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role', {
      page: 1,
      limit: 10,
      role: null
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty data in createRole', async () => {
    const mockResponse = { data: 'mocked response for empty data' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.createRole({});

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role', {});
    expect(result).toEqual(mockResponse);
  });

  it('should handle complex permissions array in updateRolePermission', async () => {
    const mockResponse = { data: 'mocked response for complex permissions' };
    const complexData = {
      permissions: [
        { id: 1, name: 'read', module: 'users' },
        { id: 2, name: 'write', module: 'roles' },
        { id: 3, name: 'delete', module: 'permissions' }
      ],
      role_id: 123,
      metadata: { updated_by: 'admin', timestamp: '2023-01-01' }
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateRolePermission(123, complexData);

    expect(consoleSpy).toHaveBeenCalledWith('Sending data:', complexData);
    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/rolepermission/123', complexData);
    expect(result).toEqual(mockResponse);
  });

  it('should handle zero as role ID', async () => {
    const mockResponse = { data: 'mocked response for zero ID' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getRoleById(0);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role/0');
    expect(result).toEqual(mockResponse);
  });

  it('should handle string role filter in getRoleData', async () => {
    const mockResponse = { data: 'mocked response for string role' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getRoleData(1, 10, 'super-admin');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/role', {
      page: 1,
      limit: 10,
      role: 'super-admin'
    });
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
