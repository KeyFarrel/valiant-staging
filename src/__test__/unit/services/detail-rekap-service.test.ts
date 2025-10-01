import DetailRekapService from '@/services/detail-rekap-service';
import axios from 'axios';

// Mock Axios
jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

// Mock FingerprintJS
jest.mock('@fingerprintjs/fingerprintjs', () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({
      visitorId: 'mock-fingerprint-id',
      components: {
        userAgent: { value: 'MockUserAgent/1.0' },
        language: { value: 'en-US' },
        colorDepth: { value: 24 },
        deviceMemory: { value: 8 },
        pixelRatio: { value: 1 },
        hardwareConcurrency: { value: 4 },
        screenResolution: { value: [1920, 1080] },
        availableScreenResolution: { value: [1920, 1040] },
        timezoneOffset: { value: -420 },
        timezone: { value: 'America/Los_Angeles' },
        sessionStorage: { value: true },
        localStorage: { value: true },
        indexedDB: { value: true },
        addBehavior: { value: false },
        openDatabase: { value: false },
        cpuClass: { value: 'unknown' },
        platform: { value: 'MacIntel' },
        plugins: { value: [] },
        canvas: { value: 'mock-canvas' },
        webgl: { value: 'mock-webgl' },
        webglVendorAndRenderer: { value: 'mock-webgl-vendor' },
        adBlock: { value: false },
        hasLiedLanguages: { value: false },
        hasLiedResolution: { value: false },
        hasLiedOs: { value: false },
        hasLiedBrowser: { value: false },
        touchSupport: { value: [0, false, false] },
        fonts: { value: ['Arial', 'Helvetica'] },
        audio: { value: 'mock-audio' },
        enumerateDevices: { value: ['mock-device'] },
        vendor: { value: 'Google Inc.' },
        vendorFlavors: { value: ['chrome'] },
        architecture: { value: 'amd64' },
        webGlBasics: { value: 'mock-webgl-basics' },
        cookiesEnabled: { value: true },
        colorGamut: { value: 'srgb' },
        hdr: { value: false }
      }
    })
  }),
  hashComponents: jest.fn().mockReturnValue('mock-fingerprint-id')
}));

// Mock encryption helpers
jest.mock('@/services/helper/encryption', () => ({
  encryptAES: jest.fn().mockReturnValue('encrypted-data'),
  decryptAES: jest.fn().mockReturnValue('decrypted-data')
}));

// Mock the import.meta.env.VITE_API_URL
const mockUrl = import.meta.env.VITE_API_URL;

describe('DetailRekapService', () => {
  let service: DetailRekapService;

  beforeEach(() => {
    service = new DetailRekapService();
    
    // Mock localStorage and encryptStorage for token retrieval
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'token') {
        return 'mockToken';
      }
      return null;
    });

    (localStorage.getItem as jest.Mock).mockReturnValue('mockToken');
  });

  it('should call getMesinById with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const id = 123;
    const result = await service.getMesinById(id);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}mesin-realisasi/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      responseType: undefined,
    });

    expect(result).toEqual(mockData);
  });

  it('should call getPembangkitByKode with correct parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const kode_sentral = 'ABC123';
    const result = await service.getPembangkitByKode(kode_sentral);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/by-kode`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      responseType: undefined,
      params: {
        kode_sentral,
      },
    });

    expect(result).toEqual(mockData);
  });

  it('should call getComboBahanBakar with correct GET parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const jenis_pembangkit = 'typeA';
    const result = await service.getComboBahanBakar(jenis_pembangkit);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-bahan-bakar`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      responseType: undefined,
      params: {
        jenis_pembangkit,
      },
    });

    expect(result).toEqual(mockData);
  });
  
  it('should call getAsumsiParameter with correct POST parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const tahun_realisasi = 2022;
    const uuid_mesin = 123;
    const tahun = 2022;

    const result = await service.getAsumsiParameter(tahun_realisasi, uuid_mesin, tahun);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      data: {
        tahun_realisasi,
        uuid_mesin,
        tahun,
      },
    });

    expect(result).toEqual(mockData);
  });

  it('should call getHasilSimulasi with correct POST parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const uuid_mesin = 1;
    const tahun = 2022;
    const status = 1;

    const result = await service.getHasilSimulasi(uuid_mesin, tahun, status);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/simulasi-cod`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      data: {
        uuid_mesin,
        tahun,
        status,
      },
    });

    expect(result).toEqual(mockData);
  });

  it('should call getPengelolaData with correct GET parameters', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.getPengelolaData();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-pengelola`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      responseType: undefined,
    });

    expect(result).toEqual(mockData);
  });

  it('should call getSentralById with correct GET parameters', async () => {
    const id = 1;
    const mockResponse = { data: 'sentral data' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getSentralById(id);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      responseType: undefined,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getAsumsiMakroSentral with correct POST parameters', async () => {
    const tahunRealisasi = 2023;
    const uuidSentral = 1;
    const mockResponse = { data: 'asumsi makro data' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAsumsiMakroSentral(tahunRealisasi, uuidSentral);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter-sentral`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      data: {
        tahun_realisasi: tahunRealisasi,
        uuid_sentral: uuidSentral,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknisSentral with correct POST parameters', async () => {
    const tahunRealisasi = 2023;
    const uuidSentral = 1;
    const mockResponse = { data: 'data teknis sentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknisSentral(tahunRealisasi, uuidSentral);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-sentral`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      data: {
        tahun_realisasi: tahunRealisasi,
        uuid_sentral: uuidSentral,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansialSentral with correct POST parameters', async () => {
    const tahunRealisasi = 2023;
    const uuidSentral = 1;
    const mockResponse = { data: 'data finansial sentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansialSentral(tahunRealisasi, uuidSentral);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-sentral`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      data: {
        tahun_realisasi: tahunRealisasi,
        uuid_sentral: uuidSentral,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getListTahunAsumsi with correct GET parameters', async () => {
    const mockResponse = { data: 'list tahun asumsi' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getListTahunAsumsi();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/best-performance-assets`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      responseType: undefined,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getTahunRealisasi with correct GET parameters', async () => {
    const uuidMesin = 1;
    const mockResponse = { data: 'tahun realisasi data' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTahunRealisasi(uuidMesin);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/tahun-permesin`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      responseType: undefined,
      params: {
        uuid_mesin: uuidMesin,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelMesin with correct GET parameters and responseType', async () => {
    const uuidMesin = 1;
    const tahun = 2023;
    const mockResponse = { data: new ArrayBuffer(8) }; // Contoh response arraybuffer
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadExcelMesin(uuidMesin, tahun);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/export-template-awal`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      params: {
        uuid_mesin: uuidMesin,
        tahun: tahun,
      },
      responseType: 'arraybuffer',
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknis with correct POST parameters', async () => {
    const tahun = 2023;
    const uuidMesin = 1;
    const mockResponse = { data: 'data teknis' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknis(tahun, uuidMesin);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-final`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      data: {
        tahun: tahun,
        uuid_mesin: uuidMesin,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansial with correct POST parameters', async () => {
    const tahun = 2023;
    const uuidMesin = 1;
    const mockResponse = { data: 'data finansial' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansial(tahun, uuidMesin);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-final`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      data: {
        tahun: tahun,
        uuid_mesin: uuidMesin,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getTypePeriodic with correct GET parameters', async () => {
    const kodeJenisPembangkit = 'ABC123';
    const mockResponse = { data: 'type periodic data' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTypePeriodic(kodeJenisPembangkit);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/type-periodic`,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      withCredentials: true,
      timeout: 120000,
      responseType: undefined,
      params: {
        kode_jenis_pembangkit: kodeJenisPembangkit,
      },
    });

    expect(result).toEqual(mockResponse);
  });
});
