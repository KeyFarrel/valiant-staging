import LogActivityService from '@/services/log-activity-service';
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

describe('LogActivityService', () => {
  let service: LogActivityService;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    service = new LogActivityService();
    
    // Mock BaseService methods
    mockPost = jest.spyOn(BaseService.prototype, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getLogActivity with basic parameters', async () => {
    const mockResponse = { data: 'mocked response for getLogActivity' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const params = { userId: 123, activityType: 'LOGIN' };
    const result = await service.getLogActivity(params);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getLogActivity with pagination parameters', async () => {
    const mockResponse = { 
      data: [
        { id: 1, activity: 'LOGIN', timestamp: '2023-01-01T00:00:00Z' },
        { id: 2, activity: 'LOGOUT', timestamp: '2023-01-01T01:00:00Z' }
      ],
      pagination: { page: 1, limit: 10, total: 2 }
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const params = { 
      page: 1, 
      limit: 10, 
      userId: 456, 
      activityType: 'ALL',
      startDate: '2023-01-01',
      endDate: '2023-01-31'
    };
    const result = await service.getLogActivity(params);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getLogActivity with filter parameters', async () => {
    const mockResponse = { 
      data: [
        { id: 1, activity: 'CREATE', module: 'USER', timestamp: '2023-01-01T00:00:00Z' }
      ]
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const params = { 
      userId: 789,
      activityType: 'CREATE',
      module: 'USER',
      search: 'user creation',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    };
    const result = await service.getLogActivity(params);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getLogActivity without parameters', async () => {
    const mockResponse = { data: 'all log activities' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getLogActivity(null);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', null);
    expect(result).toEqual(mockResponse);
  });

  it('should call getLogActivity with empty object', async () => {
    const mockResponse = { data: 'default log activities' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getLogActivity({});

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', {});
    expect(result).toEqual(mockResponse);
  });

  it('should handle complex log activity parameters', async () => {
    const mockResponse = { 
      data: [
        { 
          id: 1, 
          activity: 'BULK_UPDATE', 
          details: { 
            affected_records: 100, 
            operation: 'status_change' 
          },
          user: { id: 123, name: 'Admin User' },
          timestamp: '2023-01-01T00:00:00Z'
        }
      ]
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const params = { 
      userId: 123,
      activityTypes: ['CREATE', 'UPDATE', 'DELETE'],
      modules: ['USER', 'ROLE', 'PERMISSION'],
      dateRange: {
        start: '2023-01-01T00:00:00Z',
        end: '2023-01-31T23:59:59Z'
      },
      filters: {
        severity: 'HIGH',
        category: 'ADMIN_ACTION'
      },
      pagination: {
        page: 1,
        limit: 50,
        offset: 0
      }
    };
    const result = await service.getLogActivity(params);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', params);
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getLogActivity', async () => {
    const mockError = new Error('Log Activity Error');
    mockPost.mockRejectedValueOnce(mockError);

    const params = { userId: 123, activityType: 'LOGIN' };
    await expect(service.getLogActivity(params)).rejects.toThrow('Log Activity Error');
  });

  it('should handle network timeout errors', async () => {
    const mockError = new Error('Network timeout');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.getLogActivity({ userId: 456 })).rejects.toThrow('Network timeout');
  });

  it('should handle unauthorized access errors', async () => {
    const mockError = new Error('Unauthorized access');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.getLogActivity({ activityType: 'SENSITIVE' })).rejects.toThrow('Unauthorized access');
  });

  // Test parameter edge cases
  it('should handle numeric string userId', async () => {
    const mockResponse = { data: 'log for string user id' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const params = { userId: '123', activityType: 'LOGIN' };
    const result = await service.getLogActivity(params);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', params);
    expect(result).toEqual(mockResponse);
  });

  it('should handle boolean parameters', async () => {
    const mockResponse = { data: 'filtered log activities' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const params = { 
      includeDetails: true, 
      showOnlyErrors: false,
      exportToCSV: true
    };
    const result = await service.getLogActivity(params);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', params);
    expect(result).toEqual(mockResponse);
  });

  it('should handle array parameters', async () => {
    const mockResponse = { data: 'bulk log query result' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const params = { 
      userIds: [123, 456, 789],
      activityTypes: ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE'],
      excludeModules: ['SYSTEM', 'INTERNAL']
    };
    const result = await service.getLogActivity(params);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/log/all-log', params);
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
