import axios from 'axios';
import RoleService from '@/services/role-service'; // Sesuaikan dengan path yang benar ke file RoleService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    service = new RoleService();

    // Mock localStorage and encryptStorage for token retrieval
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'token') {
        return 'mockToken';
      }
      return null;
    });

    (localStorage.getItem as jest.Mock).mockReturnValue('mockToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getRoleData with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getRoleData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getRoleData(1, 10, 'admin');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}role`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { page: 1, limit: 10, role: 'admin' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getLevel with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getLevel' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getLevel();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}level`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getRoleById with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getRoleById' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getRoleById(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}role/1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call createRole with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for createRole' };
    const formData = { role: 'admin', permissions: ['read', 'write'] };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.createRole(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}role`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateRole with correct PUT parameters', async () => {
    const mockResponse = { data: 'mocked response for updateRole' };
    const data = { role: 'manager', permissions: ['read'] };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateRole(1, data);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PUT',
      url: `${mockUrl}role/1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getPermission with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getPermission' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPermission();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}permission`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getPermissionByRoleId with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getPermissionByRoleId' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPermissionByRoleId(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}rolepermission?role_id=1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateRolePermission with correct PUT parameters', async () => {
    const mockResponse = { data: 'mocked response for updateRolePermission' };
    const data = { permissions: ['read', 'write'] };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateRolePermission(1, data);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PUT',
      url: `${mockUrl}rolepermission/1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
