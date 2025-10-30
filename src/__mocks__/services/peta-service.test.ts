import PetaService from '@/services/peta-service';
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

describe('PetaService', () => {
  let service: PetaService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    service = new PetaService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getPetaSentral with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPetaSentral' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const params = { region: 'Jakarta', pengelola: 'PLN', filter: 'active' };
    const result = await service.getPetaSentral(params);

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/all-sentral', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getBestPerformance with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getBestPerformance' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const params = { year: 2023, region: 'Jakarta' };
    const result = await service.getBestPerformance(params);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/best-asset', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getYearListBPA with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getYearListBPA' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getYearListBPA();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/best-performance-assets');
    expect(result).toEqual(mockResponse);
  });

  it('should call getPembina with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPembina' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const params = { region: 'East Java', status: 'active' };
    const result = await service.getPembina(params);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pembina', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getPengelola with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPengelola' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPengelola();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pengelola');
    expect(result).toEqual(mockResponse);
  });

  it('should call getJenisKit with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getJenisKit' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const params = { type: 'kitType', category: 'industrial' };
    const result = await service.getJenisKit(params);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-jenis-kit', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getUmurMesin with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getUmurMesin' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const params = { year: 10, status: 'operational' };
    const result = await service.getUmurMesin(params);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-umur-mesin', params);
    expect(result).toEqual(mockResponse);
  });

  it('should call getSentralByKode with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getSentralByKode' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const id = 'sentral123';
    const result = await service.getSentralByKode(id);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-sentral?kode_sentral=sentral123');
    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinByKode with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinByKode' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const id = 'mesin123';
    const result = await service.getMesinByKode(id);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-mesin?kode_sentral=mesin123');
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getPetaSentral', async () => {
    const mockError = new Error('Peta Sentral API Error');
    mockPost.mockRejectedValueOnce(mockError);

    const params = { region: 'Jakarta' };
    await expect(service.getPetaSentral(params)).rejects.toThrow('Peta Sentral API Error');
  });

  it('should handle errors in getBestPerformance', async () => {
    const mockError = new Error('Best Performance API Error');
    mockGet.mockRejectedValueOnce(mockError);

    const params = { year: 2023 };
    await expect(service.getBestPerformance(params)).rejects.toThrow('Best Performance API Error');
  });

  it('should handle errors in getYearListBPA', async () => {
    const mockError = new Error('Year List BPA Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getYearListBPA()).rejects.toThrow('Year List BPA Error');
  });

  it('should handle errors in getPembina', async () => {
    const mockError = new Error('Pembina Error');
    mockGet.mockRejectedValueOnce(mockError);

    const params = { region: 'East Java' };
    await expect(service.getPembina(params)).rejects.toThrow('Pembina Error');
  });

  it('should handle errors in getPengelola', async () => {
    const mockError = new Error('Pengelola Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getPengelola()).rejects.toThrow('Pengelola Error');
  });

  it('should handle errors in getJenisKit', async () => {
    const mockError = new Error('Jenis Kit Error');
    mockGet.mockRejectedValueOnce(mockError);

    const params = { type: 'kitType' };
    await expect(service.getJenisKit(params)).rejects.toThrow('Jenis Kit Error');
  });

  it('should handle errors in getUmurMesin', async () => {
    const mockError = new Error('Umur Mesin Error');
    mockGet.mockRejectedValueOnce(mockError);

    const params = { year: 10 };
    await expect(service.getUmurMesin(params)).rejects.toThrow('Umur Mesin Error');
  });

  it('should handle errors in getSentralByKode', async () => {
    const mockError = new Error('Sentral By Kode Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getSentralByKode('sentral123')).rejects.toThrow('Sentral By Kode Error');
  });

  it('should handle errors in getMesinByKode', async () => {
    const mockError = new Error('Mesin By Kode Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getMesinByKode('mesin123')).rejects.toThrow('Mesin By Kode Error');
  });

  // Test parameter edge cases
  it('should handle empty parameters in getPetaSentral', async () => {
    const mockResponse = { data: 'mocked response for empty params' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getPetaSentral({});

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/all-sentral', {});
    expect(result).toEqual(mockResponse);
  });

  it('should handle null parameters in getBestPerformance', async () => {
    const mockResponse = { data: 'mocked response for null params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getBestPerformance(null);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/best-asset', null);
    expect(result).toEqual(mockResponse);
  });

  it('should handle undefined parameters in getPembina', async () => {
    const mockResponse = { data: 'mocked response for undefined params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPembina(undefined);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pembina', undefined);
    expect(result).toEqual(mockResponse);
  });

  it('should handle numeric and string IDs in getSentralByKode', async () => {
    const mockResponse = { data: 'mocked response for numeric ID' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentralByKode(12345);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-sentral?kode_sentral=12345');
    expect(result).toEqual(mockResponse);
  });

  it('should handle special characters in getMesinByKode', async () => {
    const mockResponse = { data: 'mocked response for special chars' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const specialId = 'mesin-123_test@domain';
    const result = await service.getMesinByKode(specialId);

    expect(mockGet).toHaveBeenCalledWith(`https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-mesin?kode_sentral=${specialId}`);
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
