import DetailRekapService from '@/services/detail-rekap-service';
import axios from 'axios';

// Mock Axios
jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

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
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
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
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
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
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
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
    const id_mesin = 123;
    const tahun = 2022;

    const result = await service.getAsumsiParameter(tahun_realisasi, id_mesin, tahun);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      data: {
        tahun_realisasi,
        id_mesin,
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

    const id_mesin = 1;
    const tahun = 2022;
    const status = 1;

    const result = await service.getHasilSimulasi(id_mesin, tahun, status);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/simulasi-cod`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      data: {
        id_mesin,
        tahun,
        status,
      },
    });

    expect(result).toEqual(mockData);
  });

  it('should call getPengelolaData with correct POST parameters', async () => {
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
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
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
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getAsumsiMakroSentral with correct POST parameters', async () => {
    const tahunRealisasi = 2023;
    const idSentral = 1;
    const mockResponse = { data: 'asumsi makro data' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getAsumsiMakroSentral(tahunRealisasi, idSentral);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/asumsi-parameter-sentral`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      data: {
        tahun_realisasi: tahunRealisasi,
        id_sentral: idSentral,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknisSentral with correct POST parameters', async () => {
    const tahunRealisasi = 2023;
    const idSentral = 1;
    const mockResponse = { data: 'data teknis sentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknisSentral(tahunRealisasi, idSentral);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-sentral`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      data: {
        tahun_realisasi: tahunRealisasi,
        id_sentral: idSentral,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansialSentral with correct POST parameters', async () => {
    const tahunRealisasi = 2023;
    const idSentral = 1;
    const mockResponse = { data: 'data finansial sentral' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansialSentral(tahunRealisasi, idSentral);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-sentral`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      data: {
        tahun_realisasi: tahunRealisasi,
        id_sentral: idSentral,
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
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getTahunRealisasi with correct GET parameters', async () => {
    const idMesin = 1;
    const mockResponse = { data: 'tahun realisasi data' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTahunRealisasi(idMesin);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/tahun-permesin`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      params: {
        id_mesin: idMesin,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelMesin with correct GET parameters and responseType', async () => {
    const idMesin = 1;
    const tahun = 2023;
    const mockResponse = { data: new ArrayBuffer(8) }; // Contoh response arraybuffer
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadExcelMesin(idMesin, tahun);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}kertas-kerja-detail/export-template-awal`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      params: {
        id_mesin: idMesin,
        tahun: tahun,
      },
      responseType: 'arraybuffer',
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknis with correct POST parameters', async () => {
    const tahun = 2023;
    const idMesin = 1;
    const mockResponse = { data: 'data teknis' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknis(tahun, idMesin);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-teknis-final`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      data: {
        tahun: tahun,
        id_mesin: idMesin,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansial with correct POST parameters', async () => {
    const tahun = 2023;
    const idMesin = 1;
    const mockResponse = { data: 'data finansial' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansial(tahun, idMesin);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}kertas-kerja-detail/data-finansial-final`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      data: {
        tahun: tahun,
        id_mesin: idMesin,
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
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      params: {
        kode_jenis_pembangkit: kodeJenisPembangkit,
      },
    });

    expect(result).toEqual(mockResponse);
  });
});
