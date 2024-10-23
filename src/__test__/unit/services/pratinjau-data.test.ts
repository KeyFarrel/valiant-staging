import axios from 'axios';
import PratinjauDataService from '@/services/pratinjau-data';

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('PratinjauDataService', () => {
  let service: PratinjauDataService;

  beforeEach(() => {
    service = new PratinjauDataService();

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

  it('should call getMesinByIdData with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinByIdData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getMesinByIdData(1);

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

    const tahunRealisasi = 2023;
    const kodeMesin = 'mesin123';
    const result = await service.getAsumsiParameterData(tahunRealisasi, kodeMesin);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: tahunRealisasi, kode_mesin: kodeMesin },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
