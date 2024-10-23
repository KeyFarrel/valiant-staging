import axios from 'axios';
import InputAsumsiParameterService from '@/services/input-asumsi-parameter-service'; // Sesuaikan dengan path yang benar ke file InputAsumsiParameterService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('InputAsumsiParameterService', () => {
  let service: InputAsumsiParameterService;

  beforeEach(() => {
    service = new InputAsumsiParameterService();

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
      url: `${mockUrl}mesin-realisasi/1`,
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

  it('should call getAsumsiMakroData with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getAsumsiMakroData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAsumsiMakroData(2023, 1, 2022);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1, tahun: 2022 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getComboBahanBakar with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboBahanBakar' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getComboBahanBakar('jenis_pembangkit_mock');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-bahan-bakar`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { jenis_pembangkit: 'jenis_pembangkit_mock' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getStatusRealisasiById with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getStatusRealisasiById' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getStatusRealisasiById(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/status-realisasi-by-mesin`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { id_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call createAsumsi with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for createAsumsi' };
    const formAsumsi = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.createAsumsi(formAsumsi);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-create`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: formAsumsi,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateAsumsi with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateAsumsi' };
    const formAsumsi = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateAsumsi(formAsumsi);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-wacc-update`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: formAsumsi,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call createParameter with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for createParameter' };
    const formParameter = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.createParameter(formParameter);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/parameter-finansial`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: formParameter,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
