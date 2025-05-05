import axios from 'axios';
import AnalyticService from '@/services/analytic-service';  // Sesuaikan dengan path Anda
import { encryptStoragePromise } from '@/utils/app-encrypt-storage';  // Sesuaikan path

jest.mock('axios');
jest.mock('@/utils/app-encrypt-storage');

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('AnalyticService', () => {
  let service: AnalyticService;
  const mockUrl = import.meta.env.VITE_API_URL;

  beforeEach(() => {
    // Mock localStorage and encryptStorage
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'token') {
        return 'mockToken';
      }
      return null;
    });
    (encryptStorage.getItem as jest.Mock).mockReturnValue('mockToken');

    // Initialize the service
    service = new AnalyticService();
  });

  it('should call getFinancialEBITDA with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const params = { kategori: 'some-category', periode: '2023' };
    const result = await service.getFinancialEBITDA(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}dashboard/grafik/finansial-ebitda`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      params,
    });

    expect(result).toEqual(mockData);
  });

  it('should call getFinancialROIC with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const params = { kategori: 'some-category', periode: '2023' };
    const result = await service.getFinancialROIC(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}dashboard/grafik/finansial-roic`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      params,
    });

    expect(result).toEqual(mockData);
  });

  it('should call getFinancialKomponen with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const params = {
      komponen: 'komponen-1',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      pembangkit: 'pembangkit-1',
      id_daya: 'id-123'
    };
    const result = await service.getFinancialKomponen(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}grafik/laman/komponen`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      params,
    });

    expect(result).toEqual(mockData);
  });

  it('should call getTeknisNcf with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const params = {
      komponen: 'komponen-1',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      pembangkit: 'pembangkit-1',
      id_daya: 'id-123'
    };
    const result = await service.getTeknisNcf(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}grafik/laman/teknis/ncf`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      params,
    });

    expect(result).toEqual(mockData);
  });

  it('should call getFilterPembangkit with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.getFilterPembangkit();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}grafik/filter/pembangkit`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it('should call getFilterDaya with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.getFilterDaya();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}grafik/filter/daya`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it('should call getFilterTahun with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.getFilterTahun();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}grafik/filter/tahun`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });
});
