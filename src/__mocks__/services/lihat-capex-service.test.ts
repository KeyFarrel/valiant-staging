import LihatCAPEXService from '@/services/lihat-capex-service';
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

describe('LihatCAPEXService', () => {
  let service: LihatCAPEXService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    service = new LihatCAPEXService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getMesinById with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinById' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesinById('uuid-123');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/mesin/uuid-123');
    expect(result).toEqual(mockResponse);
  });

  it('should call getPembangkitByKode with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPembangkitByKode' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPembangkitByKode('SENTRAL001');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/by-kode', {
      kode_sentral: 'SENTRAL001'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getPengelolaData with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPengelolaData' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPengelolaData();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pengelola');
    expect(result).toEqual(mockResponse);
  });

  it('should call getAsumsiParameterData with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getAsumsiParameterData' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getAsumsiParameterData(2023, 'uuid-mesin-123');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/asumsi-parameter', {
      tahun_realisasi: 2023,
      uuid_mesin: 'uuid-mesin-123'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getAnggaranDetailCAPEX with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getAnggaranDetailCAPEX' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getAnggaranDetailCAPEX(2023, 'uuid-mesin-123');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/capex', {
      tahun: 2023,
      uuid_mesin: 'uuid-mesin-123'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getTotalReplacement with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getTotalReplacement' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getTotalReplacement(2023, 'uuid-mesin-123');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/capex-replacement', {
      tahun: 2023,
      uuid_mesin: 'uuid-mesin-123'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getTahunAnggaran with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getTahunAnggaran' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getTahunAnggaran();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/tahun');
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getMesinById', async () => {
    const mockError = new Error('Mesin Not Found');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getMesinById('invalid-uuid')).rejects.toThrow('Mesin Not Found');
  });

  it('should handle errors in getPembangkitByKode', async () => {
    const mockError = new Error('Pembangkit Not Found');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getPembangkitByKode('INVALID_CODE')).rejects.toThrow('Pembangkit Not Found');
  });

  it('should handle errors in getAsumsiParameterData', async () => {
    const mockError = new Error('Asumsi Parameter Error');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.getAsumsiParameterData(2023, 'uuid-123')).rejects.toThrow('Asumsi Parameter Error');
  });

  it('should handle errors in getAnggaranDetailCAPEX', async () => {
    const mockError = new Error('Anggaran Detail CAPEX Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getAnggaranDetailCAPEX(2023, 'uuid-123')).rejects.toThrow('Anggaran Detail CAPEX Error');
  });

  it('should handle errors in getTotalReplacement', async () => {
    const mockError = new Error('Total Replacement Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getTotalReplacement(2023, 'uuid-123')).rejects.toThrow('Total Replacement Error');
  });

  it('should handle errors in getTahunAnggaran', async () => {
    const mockError = new Error('Tahun Anggaran Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getTahunAnggaran()).rejects.toThrow('Tahun Anggaran Error');
  });

  // Test parameter edge cases
  it('should handle numeric ID in getMesinById', async () => {
    const mockResponse = { data: 'mocked response for numeric ID' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesinById(12345);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/mesin/12345');
    expect(result).toEqual(mockResponse);
  });

  it('should handle null parameters in getAsumsiParameterData', async () => {
    const mockResponse = { data: 'mocked response for null params' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getAsumsiParameterData(null, null);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/asumsi-parameter', {
      tahun_realisasi: null,
      uuid_mesin: null
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle different year formats in getAnggaranDetailCAPEX', async () => {
    const mockResponse = { data: 'mocked response for different year formats' };
    mockGet.mockResolvedValueOnce(mockResponse);

    // Test with string year
    const result = await service.getAnggaranDetailCAPEX('2023', 'uuid-123');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/capex', {
      tahun: '2023',
      uuid_mesin: 'uuid-123'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty string parameters', async () => {
    const mockResponse = { data: 'mocked response for empty strings' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPembangkitByKode('');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/by-kode', {
      kode_sentral: ''
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle future years in getTotalReplacement', async () => {
    const mockResponse = { data: 'mocked response for future year' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const futureYear = 2030;
    const result = await service.getTotalReplacement(futureYear, 'uuid-123');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/capex-replacement', {
      tahun: futureYear,
      uuid_mesin: 'uuid-123'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle special characters in kode_sentral', async () => {
    const mockResponse = { data: 'mocked response for special chars' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const specialCode = 'SENTRAL-001_TEST@2023';
    const result = await service.getPembangkitByKode(specialCode);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/by-kode', {
      kode_sentral: specialCode
    });
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
