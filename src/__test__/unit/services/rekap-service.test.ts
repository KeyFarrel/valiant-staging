import axios from 'axios';
import RekapService from '@/services/rekap-service';
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

describe('RekapService', () => {
  let service: RekapService;

  beforeEach(() => {
    service = new RekapService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getSentralData with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getSentralData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = {
      sentral: 'Sentral1',
      pengelola: ['Pengelola1'],
      jenis_kit: ['Kit1'],
      id_daya: 100,
      kondisi_mesin: ['Good'],
      umur: ['<10'],
      page: 1,
      limit: 10,
    };
    const result = await service.getSentralData(
      params.sentral,
      params.pengelola,
      params.jenis_kit,
      params.id_daya,
      params.kondisi_mesin,
      params.umur,
      params.page,
      params.limit
    );

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/all-rekap-kertas-kerja`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: params,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call uploadEvidence with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for uploadEvidence' };
    const file = new Blob();
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.uploadEvidence(file);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}mutasiasset/upload-evidence`,
      withCredentials: true,
      headers: {
        "Content-Type": "application/octet-stream"
      },
      data: file,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call uploadTemplateAwalKK with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for uploadTemplateAwalKK' };
    const file = new Blob();
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.uploadTemplateAwalKK(file);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/import-template-awal`,
      withCredentials: true,
      headers: {
        "Content-Type": "application/octet-stream"
      },
      data: file,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadSimulasi1 with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadSimulasi1(2023, 2022, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/export-template-simulasi1`,
      withCredentials: true,
      headers: {},
      params: { tahun: 2023, tahun_realisasi: 2022, uuid_mesin: 1 },
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    expect(result).toEqual({ data: mockResponse });
  });

  it('should call getEvidencePath with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getEvidencePath' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getEvidencePath('mesin123', '2023', 'completed');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}evidence`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: { uuid: 'mesin123', tahun: '2023', status_fs: 'completed' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call updateEvidencePath with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for updateEvidencePath' };
    const params = {
      uuid: 'mesin123',
      tahun_upload: '2023',
      dokumen_evidence: 'document123',
      status_fs: 'completed',
      file_name: 'file.pdf',
    };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateEvidencePath(
      'mesin123',
      '2023',
      'document123',
      'completed',
      'file.pdf'
    );

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}evidence`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: params,
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
      timeout: 120000,
      params: undefined,
      responseType: undefined,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinByIdSentral with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinByIdSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getMesinByIdSentral('sentral123');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/all-rekap-kertas-kerja-mesin`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      data: { uuid_sentral: 'sentral123' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getNilaiSentral with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getNilaiSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getNilaiSentral(2023);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/sentral-nilai`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: { tahun: 2023 },
      responseType: undefined,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getNilaiMesin with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getNilaiMesin' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getNilaiMesin(2023);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/mesin-nilai`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mock-fingerprint-id',
      },
      params: { tahun: 2023 },
      responseType: undefined,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getComboKategoriPembangkit with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboKategoriPembangkit' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getComboKategoriPembangkit();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-jenis-kit`,
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

  it('should call getComboUmurMesin with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboUmurMesin' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getComboUmurMesin();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-umur-mesin`,
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

  it('should call getComboKondisiMesin with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboKondisiMesin' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getComboKondisiMesin();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-kondisi-mesin`,
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

  it('should call getComboIRR with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getComboIRR' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getComboIRR();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-irr`,
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

  it('should call downloadSimulasi2 with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadSimulasi2(2023, 2022, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/export-template-simulasi2`,
      withCredentials: true,
      headers: {},
      params: { tahun: 2023, tahun_realisasi: 2022, uuid_mesin: 1 },
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    expect(result).toEqual({ data: mockResponse });
  });

  it('should call downloadTemplateRekap with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadTemplateRekap(2023, 2022, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/export-template-first`,
      withCredentials: true,
      headers: {},
      params: { tahun: 2023, tahun_realisasi: 2022, uuid_mesin: 1 },
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    expect(result).toEqual({ data: mockResponse });
  });

  it('should call downloadTemplateFS with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadTemplateFS(2023, 1, 'jenis123');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/export-template-fs`,
      withCredentials: true,
      headers: {},
      params: { tahun: 2023, uuid_mesin: 1, kode_jenis_pembangkit: 'jenis123' },
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    expect(result).toEqual({ data: mockResponse });
  });

  it('should call downloadExcelKK with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadExcelKK(2023, 2022, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/export-template-awal`,
      withCredentials: true,
      headers: {},
      params: { tahun: 2023, tahun_realisasi: 2022, uuid_mesin: 1 },
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    expect(result).toEqual({ data: mockResponse });
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

  it('should call getStatusFSSentral with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getStatusFSSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getStatusFSSentral();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/status-fs-sentral`,
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

  it('should call getStatusFSMesin with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getStatusFSMesin' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getStatusFSMesin();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/status-fs`,
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

  it('should call getCheckInputAsumsiSentral with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getCheckInputAsumsiSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getCheckInputAsumsiSentral();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/all-rekap-asumsi`,
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

  it('should call getSuggestionSentral with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getSuggestionSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getSuggestionSentral();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-sentral`,
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

  it('should call uploadTemplateAwalFS with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for uploadTemplateAwalFS' };
    const file = new Blob();
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.uploadTemplateAwalFS(file);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/import-template-fs`,
      withCredentials: true,
      headers: {
        "Content-Type": "application/octet-stream"
      },
      data: file,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call uploadSimulasi1 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for uploadSimulasi1' };
    const file = new Blob();
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.uploadSimulasi1(file);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/import-template-simulasi1`,
      withCredentials: true,
      headers: {
        "Content-Type": "application/octet-stream"
      },
      data: file,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call uploadSimulasi2 with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for uploadSimulasi2' };
    const file = new Blob();
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.uploadSimulasi2(file);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/import-template-simulasi`,
      withCredentials: true,
      headers: {
        "Content-Type": "application/octet-stream"
      },
      data: file,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadEvidence with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const file = 'file123';
    const result = await service.downloadEvidence(file);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}mutasiasset/download-evidence/${file}`,
      withCredentials: true,
      headers: {},
      responseType: 'arraybuffer',
      timeout: 120000,
      params:{}
    });

    expect(result).toEqual({ data: mockResponse });
  });

  it('should call getStatusRealisasiSentral with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getStatusRealisasiSentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getStatusRealisasiSentral();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/status-realisasi-sentral`,
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

  it('should call getStatusRealisasiMesin with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getStatusRealisasiMesin' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getStatusRealisasiMesin();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}pembangkit/status-realisasi`,
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

  it('should call getCheckInputAsumsiMesin with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getCheckInputAsumsiMesin' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getCheckInputAsumsiMesin();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/all-rekap-asumsi-mesin`,
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
});
