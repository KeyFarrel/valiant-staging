import axios from 'axios';
import PerbaruiDataService from '@/services/perbarui-data';
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

describe('PerbaruiDataService', () => {
  let service: PerbaruiDataService;

  beforeEach(() => {
    service = new PerbaruiDataService();
    jest.clearAllMocks();
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

  it('should call getCheckIntegrasi with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getCheckIntegrasi' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getCheckIntegrasi(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/data-integrasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: { tahun: 2023, uuid_mesin: 1 },
      responseType: undefined,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getAsumsiParameterData with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getAsumsiParameterData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAsumsiParameterData(2023, 1, 2022);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun_realisasi: 2023, uuid_mesin: 1, tahun: 2022 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknisData with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknisData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknisData(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknisByPeriode with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknisByPeriode' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknisByPeriode(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-periode`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun_realisasi: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansialDetail with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataFinansialDetail' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansialDetail(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-detail`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getComboTypePeriodicData with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboTypePeriodicData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getComboTypePeriodicData('jenis_pembangkit_mock');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-type-periodic`,
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

  it('should call createAsumsiMakroPermanent with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for createAsumsiMakroPermanent' };
    const formData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.createAsumsiMakroPermanent(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-create`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateAsumsiMakroPermanent with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateAsumsiMakroPermanent' };
    const formData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateAsumsiMakroPermanent(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-wacc-update`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknisByPeriodeSimulasi1 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknisByPeriodeSimulasi1' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknisByPeriodeSimulasi1(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-periode-simulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun_realisasi: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknisByPeriodeSimulasi2 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknisByPeriodeSimulasi2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknisByPeriodeSimulasi2(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-periode-simulasi2`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun_realisasi: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansialDetailSimulasi1 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataFinansialDetailSimulasi1' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansialDetailSimulasi1(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-detail-simulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansialDetailSimulasi2 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataFinansialDetailSimulasi2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansialDetailSimulasi2(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-detail-simulasi2`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getAsumsiParameterSimulasi with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getAsumsiParameterSimulasi' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAsumsiParameterSimulasi(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter-simulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun_realisasi: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknisSimulasi1 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknisSimulasi1' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknisSimulasi1(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknisSimulasi2 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknisSimulasi2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknisSimulasi2(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-simulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansialSimulasi1 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataFinansialSimulasi1' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansialSimulasi1(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansialSimulasi2 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataFinansialSimulasi2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansialSimulasi2(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-simulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getHasilSimulasi with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getHasilSimulasi' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getHasilSimulasi(1, 2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/simulasi-cod`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_mesin: 1, tahun: 2023, status: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadSimulasi1Excel with correct POST parameters', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadSimulasi1Excel(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/export-template-simulasi1`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun_realisasi: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadSimulasi2Excel with correct POST parameters', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadSimulasi2Excel(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/export-template-simulasi2`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { tahun_realisasi: 2023, uuid_mesin: 1 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateParameterTeknisPermanent with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateParameterTeknisPermanent' };
    const formData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateParameterTeknisPermanent(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/parameter-finansial`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateParameterTeknisSimulasi with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateParameterTeknisSimulasi' };
    const formData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateParameterTeknisSimulasi(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/parameter-finansial-simulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateDataTeknisPermanent with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateDataTeknisPermanent' };
    const formData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateDataTeknisPermanent(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-create`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateDataTeknisSimulasi with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateDataTeknisSimulasi' };
    const formData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateDataTeknisSimulasi(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-create-simulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateDataFinansialPermanent with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateDataFinansialPermanent' };
    const formData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateDataFinansialPermanent(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-create`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateDataFinansialSimulasi with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateDataFinansialSimulasi' };
    const formData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateDataFinansialSimulasi(formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-create-simulasi`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: formData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getTypePeriodic with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getTypePeriodic' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTypePeriodic('kode_jenis_pembangkit_mock');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/type-periodic`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: { kode_jenis_pembangkit: 'kode_jenis_pembangkit_mock' },
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
});
