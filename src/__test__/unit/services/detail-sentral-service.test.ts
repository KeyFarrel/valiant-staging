import axios from 'axios';
import DetailSentralService from '@/services/detail-sentral-service'; // Sesuaikan dengan path yang benar ke file DetailSentralService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('DetailSentralService', () => {
  let service: DetailSentralService;

  beforeEach(() => {
    service = new DetailSentralService();

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

  it('should call getSentralById with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getSentralById' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getSentralById(1, 'kode_pengelola_mock');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { id_sentral: 1, kode_pengelola: 'kode_pengelola_mock' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call uploadPhoto with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for uploadPhoto' };
    const mockFile = new Blob(['test data'], { type: 'image/jpeg' });
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.uploadPhoto(mockFile);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}mutasiasset/s3-amazon-upload-file`,
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: 'Bearer mockToken',
      },
      data: mockFile,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getPhoto with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getPhoto' };
    const mockFile = 'photo.jpg';
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPhoto(mockFile);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}mutasiasset/s3-amazon-download/${mockFile}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      responseType: 'arraybuffer',
      timeout: 120000,
      params:{}
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinById with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinById' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getMesinById(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}mesin/1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateMesinById with correct PATCH parameters', async () => {
    const mockResponse = { data: 'mocked response for updateMesinById' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateMesinById(1, 1000000, 10, 2023, '1.2345', '2.3456', 'mockPhoto');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `${mockUrl}mesin/1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: {
        nilai_asset_awal: 1000000,
        masa_manfaat: 10,
        tahun_nilai_perolehan: 2023,
        latitude: '1.2345',
        longitude: '2.3456',
        photo1: 'mockPhoto',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateSentral with correct PATCH parameters', async () => {
    const mockResponse = { data: 'mocked response for updateSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateSentral(1, 'mockPhoto');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `${mockUrl}pembangkit/1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { photo: 'mockPhoto' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getPengelolaData with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getPengelolaData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPengelolaData();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-pengelola`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
