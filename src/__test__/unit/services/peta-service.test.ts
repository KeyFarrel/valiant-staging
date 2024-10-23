import axios from 'axios';
import PetaService from '@/services/peta-service'; // Sesuaikan dengan path yang benar ke file PetaService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('PetaService', () => {
  let service: PetaService;

  beforeEach(() => {
    service = new PetaService();

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

  it('should call getPetaSentral with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getPetaSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = { region: 'Jakarta' };
    const result = await service.getPetaSentral(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}peta/all-sentral`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: params,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getBestPerformance with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getBestPerformance' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = { year: 2023 };
    const result = await service.getBestPerformance(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}peta/best-asset`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getYearListBPA with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getYearListBPA' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getYearListBPA();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/best-performance-assets`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getPembina with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getPembina' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = { region: 'East Java' };
    const result = await service.getPembina(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-pembina`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getPengelola with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getPengelola' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPengelola();

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

  it('should call getJenisKit with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getJenisKit' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = { type: 'kitType' };
    const result = await service.getJenisKit(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-jenis-kit`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getUmurMesin with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getUmurMesin' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = { year: 10 };
    const result = await service.getUmurMesin(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-umur-mesin`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getSentralByKode with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getSentralByKode' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const id = 'sentral123';
    const result = await service.getSentralByKode(id);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}peta/detail-sentral?kode_sentral=${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinByKode with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinByKode' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const id = 'mesin123';
    const result = await service.getMesinByKode(id);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}peta/detail-mesin?kode_sentral=${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
