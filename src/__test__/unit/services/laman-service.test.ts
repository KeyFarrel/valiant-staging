import axios from 'axios';
import LamanService from '@/services/laman-service'; // Sesuaikan dengan path yang benar ke file LamanService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('LamanService', () => {
  let service: LamanService;

  beforeEach(() => {
    service = new LamanService();

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

  it('should call getTotalDaya with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getTotalDaya' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTotalDaya();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/total-daya`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getSebaranUnit with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getSebaranUnit' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getSebaranUnit();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/sebaran-unit-mesin`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinBaru with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinBaru' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getMesinBaru(1, 10, 'search-query');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/mesin-baru`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { page: 1, limit: 10, search: 'search-query' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinBelumInput with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinBelumInput' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getMesinBelumInput(1, 10, ['pengelola1'], 'search-query');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}laman/mesin-belum-terinput`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { page: 1, limit: 10, kode_pengelola: ['pengelola1'], search: 'search-query' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getKategoriPembangkit with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getKategoriPembangkit' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getKategoriPembangkit();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/kategori-pembangkit`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
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

  it('should call getDataAnggaran with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataAnggaran' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataAnggaran('search-query', 2022, 2021);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/data/anggaran`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { search: 'search-query', tahun_sampai: 2022, tahun_dari: 2021 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getPeriodeTahun with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getPeriodeTahun' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPeriodeTahun();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-tahun`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelCAPEXOPEX with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadExcelCAPEXOPEX(2021, 2022, 'search-query', 'type1');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/capex-opex/export-excel`,
      headers: {
        Authorization: 'Bearer mockToken',
      },
      params: { tahun_dari: 2021, tahun_sampai: 2022, search: 'search-query', type: 'type1' },
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    expect(result).toEqual({ data: mockResponse });
  });

  it('should call getDataFinansial with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataFinansial' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataFinansial('search-query', 2022, 1, 10);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/data/finansial?tahun=2022`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { search: 'search-query', page: 1, limit: 10 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelFinansial with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadExcelFinansial(2022, 'search-query');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/finansial/export-excel`,
      headers: {
        Authorization: 'Bearer mockToken',
      },
      params: { tahun: 2022, search: 'search-query' },
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    expect(result).toEqual({ data: mockResponse });
  });

  it('should call getDataTeknis with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknis' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDataTeknis('search-query', 1, 10, 2021, 2022);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/data/teknis`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { search: 'search-query', page: 1, limit: 10, tahun_dari: 2021, tahun_sampai: 2022 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelTeknis with correct GET parameters and responseType', async () => {
    const mockResponse = new ArrayBuffer(8);
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.downloadExcelTeknis(2021, 2022, 'search-query');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/teknis/export-excel`,
      headers: {
        Authorization: 'Bearer mockToken',
      },
      params: { tahun_dari: 2021, tahun_sampai: 2022, search: 'search-query' },
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    expect(result).toEqual({ data: mockResponse });
  });

  it('should call getInfoSFC with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getInfoSFC' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getInfoSFC();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}laman/data/teknis/info-sfc`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getChartDaya with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getChartDaya' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getChartDaya();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}dashboard/grafik/perbandingan-daya`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getTahunSelected with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getTahunSelected' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getTahunSelected();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-tahun-max`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getListTahun with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getListTahun' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getListTahun();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-tahun-data`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getChartKategori with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getChartKategori' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getChartKategori('kategori1', 100);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}dashboard/grafik/sebaran-unit`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { kategori: 'kategori1', id_daya: 100 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getCAPEXEAF with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getCAPEXEAF' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getCAPEXEAF('kode_jenis_kit_mock', 2023);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}grafik/laman/finansial/eaf`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { kode_jenis_kit: 'kode_jenis_kit_mock', tahun_realisasi: 2023 },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getListTahunAnalitik with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getListTahunAnalitik' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getListTahunAnalitik();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/combo-analitik`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
