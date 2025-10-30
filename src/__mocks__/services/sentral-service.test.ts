import SentralService from '@/services/sentral-service';
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

describe('SentralService', () => {
  let service: SentralService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    service = new SentralService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getSentralData with all parameters', async () => {
    const mockResponse = { data: 'mocked response for getSentralData' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentralData('PENGELOLA001', 1, 10, 'SearchTerm');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/all-no-pembina', {
      pengelola: 'PENGELOLA001',
      page: 1,
      limit: 10,
      search: 'SearchTerm'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getSentralData without search parameter', async () => {
    const mockResponse = { data: 'mocked response for getSentralData no search' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentralData('PENGELOLA001', 1, 10);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/all-no-pembina', {
      pengelola: 'PENGELOLA001',
      page: 1,
      limit: 10,
      search: undefined
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getComboJenisKitData with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboJenisKitData' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getComboJenisKitData();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-jenis-kit');
    expect(result).toEqual(mockResponse);
  });

  it('should call getComboBahanBakarData with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboBahanBakarData' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getComboBahanBakarData('PLTU');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-bahan-bakar', {
      jenis_pembangkit: 'PLTU'
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

  it('should call getNilaiSentral with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getNilaiSentral' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getNilaiSentral();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/sentral-nilai');
    expect(result).toEqual(mockResponse);
  });

  it('should call getNilaiMesin with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getNilaiMesin' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getNilaiMesin();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/mesin-nilai');
    expect(result).toEqual(mockResponse);
  });

  it('should call getSuggestionSentral with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getSuggestionSentral' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getSuggestionSentral();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-sentral');
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getSentralData', async () => {
    const mockError = new Error('Sentral Data Error');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.getSentralData('PENGELOLA001', 1, 10, 'search')).rejects.toThrow('Sentral Data Error');
  });

  it('should handle errors in getComboJenisKitData', async () => {
    const mockError = new Error('Jenis Kit Data Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getComboJenisKitData()).rejects.toThrow('Jenis Kit Data Error');
  });

  it('should handle errors in getComboBahanBakarData', async () => {
    const mockError = new Error('Bahan Bakar Data Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getComboBahanBakarData('PLTU')).rejects.toThrow('Bahan Bakar Data Error');
  });

  it('should handle errors in getPengelolaData', async () => {
    const mockError = new Error('Pengelola Data Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getPengelolaData()).rejects.toThrow('Pengelola Data Error');
  });

  it('should handle errors in getNilaiSentral', async () => {
    const mockError = new Error('Nilai Sentral Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getNilaiSentral()).rejects.toThrow('Nilai Sentral Error');
  });

  it('should handle errors in getNilaiMesin', async () => {
    const mockError = new Error('Nilai Mesin Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getNilaiMesin()).rejects.toThrow('Nilai Mesin Error');
  });

  it('should handle errors in getSuggestionSentral', async () => {
    const mockError = new Error('Suggestion Sentral Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getSuggestionSentral()).rejects.toThrow('Suggestion Sentral Error');
  });

  // Test parameter edge cases
  it('should handle null parameters in getSentralData', async () => {
    const mockResponse = { data: 'mocked response for null params' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentralData(null, null, null, null);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/all-no-pembina', {
      pengelola: null,
      page: null,
      limit: null,
      search: null
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle different jenis_pembangkit types', async () => {
    // Test with different power plant types
    const powerPlantTypes = ['PLTU', 'PLTA', 'PLTG', 'PLTS', 'PLTB'];
    
    for (const type of powerPlantTypes) {
      const mockResponse = { data: `mocked response for ${type}` };
      mockGet.mockResolvedValueOnce(mockResponse);
      
      const result = await service.getComboBahanBakarData(type);
      expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-bahan-bakar', {
        jenis_pembangkit: type
      });
      expect(result).toEqual(mockResponse);
    }
  });

  it('should handle numeric parameters in getSentralData', async () => {
    const mockResponse = { data: 'mocked response for numeric params' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentralData(123, 'string_page', true, 456);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/all-no-pembina', {
      pengelola: 123,
      page: 'string_page',
      limit: true,
      search: 456
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle undefined jenis_pembangkit in getComboBahanBakarData', async () => {
    const mockResponse = { data: 'mocked response for undefined jenis_pembangkit' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getComboBahanBakarData(undefined);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-bahan-bakar', {
      jenis_pembangkit: undefined
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty string parameters', async () => {
    const mockResponse = { data: 'mocked response for empty strings' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentralData('', 0, 0, '');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/all-no-pembina', {
      pengelola: '',
      page: 0,
      limit: 0,
      search: ''
    });
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
