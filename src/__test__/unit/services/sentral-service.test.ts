import axios from 'axios';
import SentralService from '@/services/sentral-service'; // Sesuaikan dengan path yang benar ke file SentralService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('SentralService', () => {
  let service: SentralService;

  beforeEach(() => {
    service = new SentralService();

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

  it('should call getSentralData with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getSentralData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = {
      pengelola: 'Pengelola1',
      page: 1,
      limit: 10,
      search: 'SearchTerm',
    };

    const result = await service.getSentralData(params.pengelola, params.page, params.limit, params.search);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}pembangkit/all-no-pembina`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: params,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getComboJenisKitData with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboJenisKitData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getComboJenisKitData();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-jenis-kit`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getComboBahanBakarData with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboBahanBakarData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = { jenis_pembangkit: 'jenisA' };

    const result = await service.getComboBahanBakarData(params.jenis_pembangkit);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-bahan-bakar`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params,
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

  it('should call getNilaiSentral with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getNilaiSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getNilaiSentral();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/sentral-nilai`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getNilaiMesin with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getNilaiMesin' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getNilaiMesin();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/mesin-nilai`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getSuggestionSentral with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getSuggestionSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getSuggestionSentral();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-sentral`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
