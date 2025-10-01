import ParameterService from '@/services/parameter-service';
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

describe('ParameterService', () => {
  let service: ParameterService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    service = new ParameterService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getParameterData with all parameters', async () => {
    const mockResponse = { data: 'mocked response for getParameterData' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getParameterData(1, 10, 'search-query');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter', {
      page: 1,
      limit: 10,
      search: 'search-query'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getParameterData with partial parameters', async () => {
    const mockResponse = { data: 'mocked response for getParameterData partial' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getParameterData(1, 10);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter', {
      page: 1,
      limit: 10,
      search: undefined
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getParameterData without parameters', async () => {
    const mockResponse = { data: 'mocked response for getParameterData no params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getParameterData();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter', {
      page: undefined,
      limit: undefined,
      search: undefined
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getParameterByID with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getParameterByID' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getParameterByID('uuid-123');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter/uuid-123');
    expect(result).toEqual(mockResponse);
  });

  it('should call editParameter with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for editParameter' };
    const parameterData = { name: 'Test Parameter', value: 'test-value', description: 'Test description' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.editParameter('uuid-123', parameterData);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter/uuid-123', parameterData);
    expect(result).toEqual(mockResponse);
  });

  it('should call addParameter with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for addParameter' };
    const parameterData = { name: 'New Parameter', value: 'new-value', description: 'New parameter description' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.addParameter(parameterData);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter', parameterData);
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getParameterData', async () => {
    const mockError = new Error('API Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getParameterData(1, 10, 'search-query')).rejects.toThrow('API Error');
  });

  it('should handle errors in getParameterByID', async () => {
    const mockError = new Error('Parameter Not Found');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getParameterByID('uuid-123')).rejects.toThrow('Parameter Not Found');
  });

  it('should handle errors in editParameter', async () => {
    const mockError = new Error('Edit Parameter Error');
    const parameterData = { name: 'Test Parameter', value: 'test-value' };
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.editParameter('uuid-123', parameterData)).rejects.toThrow('Edit Parameter Error');
  });

  it('should handle errors in addParameter', async () => {
    const mockError = new Error('Add Parameter Error');
    const parameterData = { name: 'New Parameter', value: 'new-value' };
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.addParameter(parameterData)).rejects.toThrow('Add Parameter Error');
  });

  // Test parameter validation scenarios
  it('should handle null or undefined parameters in getParameterData', async () => {
    const mockResponse = { data: 'mocked response for null params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getParameterData(null, undefined, '');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter', {
      page: null,
      limit: undefined,
      search: ''
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty data in editParameter', async () => {
    const mockResponse = { data: 'mocked response for empty edit' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.editParameter('uuid-123', {});

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter/uuid-123', {});
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty data in addParameter', async () => {
    const mockResponse = { data: 'mocked response for empty add' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.addParameter({});

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/parameter', {});
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
