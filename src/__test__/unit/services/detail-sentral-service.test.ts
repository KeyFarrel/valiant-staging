import DetailSentralService from '@/services/detail-sentral-service';
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

describe('DetailSentralService', () => {
  let service: DetailSentralService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;
  let mockPostFile: jest.SpyInstance;
  let mockGetFile: jest.SpyInstance;

  beforeEach(() => {
    service = new DetailSentralService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
    mockPostFile = jest.spyOn(BaseService.prototype, 'postFile');
    mockGetFile = jest.spyOn(BaseService.prototype, 'getFile');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getSentralById with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getSentralById' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getSentralById(1, 'kode_pengelola_mock');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit', {
      uuid: 1,
      kode_pengelola: 'kode_pengelola_mock'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call uploadPhoto with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for uploadPhoto' };
    const mockFile = new Blob(['test data'], { type: 'image/jpeg' });
    mockPostFile.mockResolvedValueOnce(mockResponse);

    const result = await service.uploadPhoto(mockFile);

    expect(mockPostFile).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/mutasiasset/upload-file', mockFile);
    expect(result).toEqual(mockResponse);
  });

  it('should call getPhoto with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPhoto' };
    const mockFile = 'photo.jpg';
    mockGetFile.mockResolvedValueOnce(mockResponse);

    const result = await service.getPhoto(mockFile);

    expect(mockGetFile).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/mutasiasset/download/photo.jpg', {}, 'arraybuffer');
    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinById with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinById' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesinById(1);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/mesin/1');
    expect(result).toEqual(mockResponse);
  });

  it('should call updateMesinById with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for updateMesinById' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateMesinById(1, 1000000, 10, 2023, '1.2345', '2.3456', 'mockPhoto');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/mesin/1', {
      nilai_asset_awal: 1000000,
      masa_manfaat: 10,
      tahun_nilai_perolehan: 2023,
      latitude: '1.2345',
      longitude: '2.3456',
      photo1: 'mockPhoto'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call updateSentral with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for updateSentral' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateSentral(1, 'mockPhoto');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/1', {
      photo: 'mockPhoto'
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

  // Test error handling
  it('should handle errors in getSentralById', async () => {
    const mockError = new Error('API Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getSentralById(1, 'kode_pengelola_mock')).rejects.toThrow('API Error');
  });

  it('should handle errors in uploadPhoto', async () => {
    const mockError = new Error('Upload Error');
    const mockFile = new Blob(['test data'], { type: 'image/jpeg' });
    mockPostFile.mockRejectedValueOnce(mockError);

    await expect(service.uploadPhoto(mockFile)).rejects.toThrow('Upload Error');
  });

  it('should handle errors in getPhoto', async () => {
    const mockError = new Error('Download Error');
    mockGetFile.mockRejectedValueOnce(mockError);

    await expect(service.getPhoto('photo.jpg')).rejects.toThrow('Download Error');
  });

  it('should handle errors in getMesinById', async () => {
    const mockError = new Error('Mesin Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getMesinById(1)).rejects.toThrow('Mesin Error');
  });

  it('should handle errors in updateMesinById', async () => {
    const mockError = new Error('Update Mesin Error');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.updateMesinById(1, 1000000, 10, 2023, '1.2345', '2.3456', 'mockPhoto')).rejects.toThrow('Update Mesin Error');
  });

  it('should handle errors in updateSentral', async () => {
    const mockError = new Error('Update Sentral Error');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.updateSentral(1, 'mockPhoto')).rejects.toThrow('Update Sentral Error');
  });

  it('should handle errors in getPengelolaData', async () => {
    const mockError = new Error('Pengelola Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getPengelolaData()).rejects.toThrow('Pengelola Error');
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
