import axios from 'axios';
import AnalyticService from '@/services/analytic-service';

jest.mock('axios');
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: {
    getItem: jest.fn().mockResolvedValue('mockToken'),
  },
}));
jest.mock('@/services/helper/encryption', () => ({
  encryptAES: jest.fn().mockResolvedValue('encrypted'),
}));
jest.mock('@fingerprintjs/fingerprintjs', () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({
      components: {
        hardwareConcurrency: { value: 4 },
        deviceMemory: { value: 8 },
        platform: { value: "MacIntel" },
        architecture: { value: 64 },
        screenResolution: { value: [1920, 1080] },
        vendor: { value: "Google Inc." },
        vendorFlavors: { value: ["chrome"] },
        colorDepth: { value: 24 },
        canvas: { value: "canvas" },
        webGlBasics: { value: "webgl" },
        timezone: { value: "Asia/Jakarta" },
        touchSupport: { value: { maxTouchPoints: 0 } },
        cookiesEnabled: { value: true },
        localStorage: { value: true },
        sessionStorage: { value: true },
        colorGamut: { value: "srgb" },
        hdr: { value: false },
      },
    }),
  }),
  hashComponents: jest.fn().mockReturnValue("mockFingerprint"),
}));

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

describe('AnalyticService', () => {
  let service: AnalyticService;
  const mockUrl = import.meta.env.VITE_API_URL;

  beforeEach(() => {
    // Mock localStorage
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'token') {
        return 'mockToken';
      }
      return null;
    });

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
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      params,
      withCredentials: true,
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
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      params,
      withCredentials: true,
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
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      params,
      withCredentials: true,
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
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      params,
      withCredentials: true,
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
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      withCredentials: true,
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
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      withCredentials: true,
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
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      withCredentials: true,
    });

    expect(result).toEqual(mockData);
  });
});
