import PersetujuanService from '@/services/persetujuan-service';
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

describe('PersetujuanService', () => {
  let service: PersetujuanService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    service = new PersetujuanService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getPersetujuanKertasKerja with correct parameters', async () => {
    const mockResponse = { data: 'test persetujuan KK' };
    const param = { 
      status: 'approved', 
      page: 1, 
      limit: 10,
      search: 'test'
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getPersetujuanKertasKerja(param);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/all-persetujuan', param);
    expect(result).toEqual(mockResponse);
  });

  it('should call getPersetujuanFS with correct parameters', async () => {
    const mockResponse = { data: 'test persetujuan FS' };
    const param = { 
      status: 'pending', 
      page: 1, 
      limit: 20,
      filter: 'feasibility-study'
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getPersetujuanFS(param);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/all-persetujuan-fs', param);
    expect(result).toEqual(mockResponse);
  });

  it('should call updateStatusKK with correct parameters', async () => {
    const mockResponse = { data: 'status updated for KK' };
    const param = { 
      id: 123, 
      status: 'approved',
      comment: 'Approved by admin',
      approved_by: 'admin@test.com'
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateStatusKK(param);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/update-status', param);
    expect(result).toEqual(mockResponse);
  });

  it('should call updateStatusFS with correct parameters', async () => {
    const mockResponse = { data: 'status updated for FS' };
    const param = { 
      id: 456, 
      status: 'rejected',
      reason: 'Not meeting requirements',
      rejected_by: 'reviewer@test.com'
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateStatusFS(param);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/update-status-fs', param);
    expect(result).toEqual(mockResponse);
  });

  it('should call getPersetujuanKKSentral with correct parameters', async () => {
    const mockResponse = { data: 'detail KK sentral' };
    const param = { 
      id: 789,
      include_details: true,
      include_history: true
    };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPersetujuanKKSentral(param);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/detail-persetujuan', param);
    expect(result).toEqual(mockResponse);
  });

  it('should call getPersetujuanFSSentral with correct parameters', async () => {
    const mockResponse = { data: 'detail FS sentral' };
    const param = { 
      id: 101,
      expand: 'all',
      version: 'latest'
    };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPersetujuanFSSentral(param);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/detail-persetujuan-fs', param);
    expect(result).toEqual(mockResponse);
  });

  it('should call getDetailMesinAppr with correct parameters', async () => {
    const mockResponse = { data: 'detail mesin approved' };
    const param = { 
      id_mesin: 999,
      include_financials: true,
      include_technical: true
    };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getDetailMesinAppr(param);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/detail-sentral', param);
    expect(result).toEqual(mockResponse);
  });

  it('should call getPengelolaData with correct parameters', async () => {
    const mockResponse = { data: 'pengelola data' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPengelolaData();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pengelola');
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getPersetujuanKertasKerja', async () => {
    const mockError = new Error('Persetujuan KK Error');
    mockPost.mockRejectedValueOnce(mockError);

    const param = { status: 'approved' };
    await expect(service.getPersetujuanKertasKerja(param)).rejects.toThrow('Persetujuan KK Error');
  });

  it('should handle errors in getPersetujuanFS', async () => {
    const mockError = new Error('Persetujuan FS Error');
    mockPost.mockRejectedValueOnce(mockError);

    const param = { status: 'pending' };
    await expect(service.getPersetujuanFS(param)).rejects.toThrow('Persetujuan FS Error');
  });

  it('should handle errors in updateStatusKK', async () => {
    const mockError = new Error('Update Status KK Error');
    mockPost.mockRejectedValueOnce(mockError);

    const param = { id: 123, status: 'approved' };
    await expect(service.updateStatusKK(param)).rejects.toThrow('Update Status KK Error');
  });

  it('should handle errors in updateStatusFS', async () => {
    const mockError = new Error('Update Status FS Error');
    mockPost.mockRejectedValueOnce(mockError);

    const param = { id: 456, status: 'rejected' };
    await expect(service.updateStatusFS(param)).rejects.toThrow('Update Status FS Error');
  });

  it('should handle errors in getPersetujuanKKSentral', async () => {
    const mockError = new Error('Detail KK Sentral Error');
    mockGet.mockRejectedValueOnce(mockError);

    const param = { id: 789 };
    await expect(service.getPersetujuanKKSentral(param)).rejects.toThrow('Detail KK Sentral Error');
  });

  it('should handle errors in getPersetujuanFSSentral', async () => {
    const mockError = new Error('Detail FS Sentral Error');
    mockGet.mockRejectedValueOnce(mockError);

    const param = { id: 101 };
    await expect(service.getPersetujuanFSSentral(param)).rejects.toThrow('Detail FS Sentral Error');
  });

  it('should handle errors in getDetailMesinAppr', async () => {
    const mockError = new Error('Detail Mesin Error');
    mockGet.mockRejectedValueOnce(mockError);

    const param = { id_mesin: 999 };
    await expect(service.getDetailMesinAppr(param)).rejects.toThrow('Detail Mesin Error');
  });

  it('should handle errors in getPengelolaData', async () => {
    const mockError = new Error('Pengelola Data Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getPengelolaData()).rejects.toThrow('Pengelola Data Error');
  });

  // Test parameter edge cases
  it('should handle empty parameters in getPersetujuanKertasKerja', async () => {
    const mockResponse = { data: 'empty param response' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getPersetujuanKertasKerja({});

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/all-persetujuan', {});
    expect(result).toEqual(mockResponse);
  });

  it('should handle null parameters in updateStatusKK', async () => {
    const mockResponse = { data: 'null param response' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateStatusKK(null);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/update-status', null);
    expect(result).toEqual(mockResponse);
  });

  it('should handle complex parameters in getPersetujuanFSSentral', async () => {
    const mockResponse = { data: 'complex param response' };
    const complexParam = {
      id: 123,
      filters: {
        status: ['approved', 'pending'],
        date_range: {
          start: '2023-01-01',
          end: '2023-12-31'
        },
        categories: ['type1', 'type2']
      },
      pagination: {
        page: 1,
        limit: 50,
        sort: 'created_at',
        order: 'desc'
      }
    };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPersetujuanFSSentral(complexParam);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/detail-persetujuan-fs', complexParam);
    expect(result).toEqual(mockResponse);
  });

  it('should handle array status updates in updateStatusFS', async () => {
    const mockResponse = { data: 'bulk update response' };
    const bulkParam = {
      ids: [1, 2, 3, 4, 5],
      status: 'approved',
      batch_comment: 'Bulk approval',
      approved_by: 'admin@test.com',
      timestamp: new Date().toISOString()
    };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateStatusFS(bulkParam);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/update-status-fs', bulkParam);
    expect(result).toEqual(mockResponse);
  });

  it('should handle zero ID in getDetailMesinAppr', async () => {
    const mockResponse = { data: 'zero id response' };
    const param = { id_mesin: 0 };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getDetailMesinAppr(param);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/persetujuan/detail-sentral', param);
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
