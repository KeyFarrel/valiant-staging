import axios from 'axios';
import LihatCAPEXService from '@/services/lihat-capex-service'; // Sesuaikan dengan path yang benar ke file LihatCAPEXService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('LihatCAPEXService', () => {
  let service: LihatCAPEXService;

  beforeEach(() => {
    service = new LihatCAPEXService();

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

  it('should call getPembangkitByKode with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getPembangkitByKode' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPembangkitByKode('kode_sentral_mock');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/by-kode`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { kode_sentral: 'kode_sentral_mock' },
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

  it('should call getAsumsiParameterData with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getAsumsiParameterData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAsumsiParameterData(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getAnggaranDetailCAPEX with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getAnggaranDetailCAPEX' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAnggaranDetailCAPEX(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/data/anggaran/capex`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { tahun: 2023, id_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getTotalReplacement with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getTotalReplacement' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTotalReplacement(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/data/anggaran/capex-replacement`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { tahun: 2023, id_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getTahunAnggaran with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getTahunAnggaran' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTahunAnggaran();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/data/anggaran/tahun`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
