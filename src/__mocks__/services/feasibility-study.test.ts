import axios from 'axios';
import FeasibilityStudyService from '@/services/feasibility-study';
import BaseService from '@/services/base-service';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

// Mock FingerprintJS to prevent browser API errors
jest.mock('@fingerprintjs/fingerprintjs', () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({
      components: {
        hardwareConcurrency: { value: 4 },
        deviceMemory: { value: 8 },
        platform: { value: 'MacIntel' },
        architecture: { value: 64 },
        screenResolution: { value: [1920, 1080] },
        vendor: { value: 'Google Inc.' },
        vendorFlavors: { value: ['chrome'] },
        colorDepth: { value: 24 },
        canvas: { value: 'mock-canvas' },
        webGlBasics: { value: 'mock-webgl' },
        timezone: { value: 'Asia/Jakarta' },
        touchSupport: { value: { maxTouchPoints: 0 } },
        cookiesEnabled: { value: true },
        localStorage: { value: true },
        sessionStorage: { value: true },
        colorGamut: { value: 'srgb' },
        hdr: { value: false }
      }
    })
  }),
  hashComponents: jest.fn().mockReturnValue('mock-fingerprint-id')
}));

// Mock encryption helper
jest.mock('@/services/helper/encryption', () => ({
  encryptAES: jest.fn((data) => `encrypted_${data}`)
}));

const mockUrl = import.meta.env.VITE_API_URL;

describe('FeasibilityStudyService', () => {
  let service: FeasibilityStudyService;

  beforeEach(() => {
    service = new FeasibilityStudyService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getSentralById with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getSentralById' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getSentralById(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/1`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: undefined,
      responseType: undefined,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getAsumsiFeasibilitySentral with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getAsumsiFeasibilitySentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAsumsiFeasibilitySentral(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/fs-asumsi-sentral`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_sentral: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getKalkulasiFeasibilitySentral with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getKalkulasiFeasibilitySentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getKalkulasiFeasibilitySentral(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/fs-kalkulasi-sentral`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_sentral: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getAsumsiFeasibility with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getAsumsiFeasibility' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAsumsiFeasibility(1, 2023);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/fs-asumsi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_mesin: 1, tahun_realisasi: 2023 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknis with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknis' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknis(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/fs-data-teknis`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansial with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataFinansial' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansial(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/fs-data-finansial`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getHasilSimulasi with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getHasilSimulasi' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getHasilSimulasi(1, 'status');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/simulasi-cod-fs`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_mesin: 1, status: 'status' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getKalkulasiFeasibility with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getKalkulasiFeasibility' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getKalkulasiFeasibility(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/fs-kalkulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getTypePeriodic with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getTypePeriodic' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTypePeriodic('kode-jenis');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/type-periodic`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: { kode_jenis_pembangkit: 'kode-jenis' },
      responseType: undefined,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinById with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinById' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getMesinById(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}mesin-realisasi/1`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: undefined,
      responseType: undefined,
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
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: { kode_sentral: 'kode_sentral_mock' },
      responseType: undefined,
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
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: undefined,
      responseType: undefined,
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
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: { jenis_pembangkit: 'jenis_pembangkit_mock' },
      responseType: undefined,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelFS with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });
  
    const result = await service.downloadExcelFS(2023, 2022, 1);
  
    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/export-template-fs-detail`,
      headers: {},
      params: {
        tahun: 2023,
        tahun_realisasi: 2022,
        uuid_mesin: 1,
      },
      responseType: 'arraybuffer',
      timeout: 120000,
      withCredentials: true,
    });
  
    expect(result).toEqual({ data: mockResponse });
  });
});
