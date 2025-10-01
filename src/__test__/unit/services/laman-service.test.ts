import LamanService from '@/services/laman-service';
import BaseService from '@/services/base-service';

// Mock FingerprintJS
jest.mock('@fingerprintjs/fingerprintjs', () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({
      visitorId: 'mocked-visitor-id'
    })
  })
}));

// Mock CryptoJS
jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('encrypted-data')
    })
  },
  enc: {
    Utf8: {}
  }
}));

describe('LamanService', () => {
  let service: LamanService;
  let mockGet: jest.SpyInstance;
  let mockPost: jest.SpyInstance;
  let mockGetFile: jest.SpyInstance;

  beforeEach(() => {
    service = new LamanService();
    
    // Mock BaseService methods
    mockGet = jest.spyOn(BaseService.prototype, 'get');
    mockPost = jest.spyOn(BaseService.prototype, 'post');
    mockGetFile = jest.spyOn(BaseService.prototype, 'getFile');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getTotalDaya with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getTotalDaya' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getTotalDaya();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/total-daya');
    expect(result).toEqual(mockResponse);
  });

  it('should call getSebaranUnit with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getSebaranUnit' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getSebaranUnit();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/sebaran-unit-mesin');
    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinBaru with all parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinBaru' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesinBaru(1, 10, 'search-query');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/mesin-baru', {
      page: 1,
      limit: 10,
      search: 'search-query'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinBaru without parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinBaru no params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesinBaru();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/mesin-baru', {
      page: undefined,
      limit: undefined,
      search: undefined
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getMesinBelumInput with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getMesinBelumInput' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesinBelumInput(1, 10, ['pengelola1', 'pengelola2'], 'search-query');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/mesin-belum-terinput', {
      page: 1,
      limit: 10,
      kode_pengelola: ['pengelola1', 'pengelola2'],
      search: 'search-query'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getKategoriPembangkit with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getKategoriPembangkit' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getKategoriPembangkit();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/kategori-pembangkit');
    expect(result).toEqual(mockResponse);
  });

  it('should call getPengelolaData with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPengelolaData' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPengelolaData();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pengelola');
    expect(result).toEqual(mockResponse);
  });

  it('should call getDataAnggaran with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataAnggaran' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getDataAnggaran('search-query', 2022, 2021);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran', {
      search: 'search-query',
      tahun_sampai: 2022,
      tahun_dari: 2021
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getPeriodeTahun with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getPeriodeTahun' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPeriodeTahun();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-tahun');
    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelCAPEXOPEX with correct parameters', async () => {
    const mockResponse = { data: new ArrayBuffer(8) };
    mockGetFile.mockResolvedValueOnce(mockResponse);

    const result = await service.downloadExcelCAPEXOPEX(2021, 2022, 'search-query', 'type1');

    expect(mockGetFile).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/capex-opex/export-excel', {
      tahun_dari: 2021,
      tahun_sampai: 2022,
      search: 'search-query',
      type: 'type1'
    }, 'arraybuffer');
    expect(result).toEqual(mockResponse);
  });

  it('should call getDataFinansial with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataFinansial' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getDataFinansial('search-query', 2022, 1, 10);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/finansial?tahun=2022', {
      search: 'search-query',
      page: 1,
      limit: 10
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelFinansial with correct parameters', async () => {
    const mockResponse = { data: new ArrayBuffer(8) };
    mockGetFile.mockResolvedValueOnce(mockResponse);

    const result = await service.downloadExcelFinansial(2022, 'search-query');

    expect(mockGetFile).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/finansial/export-excel', {
      tahun: 2022,
      search: 'search-query'
    }, 'arraybuffer');
    expect(result).toEqual(mockResponse);
  });

  it('should call getDataTeknis with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getDataTeknis' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getDataTeknis('search-query', 1, 10, 2021, 2022);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/teknis', {
      search: 'search-query',
      page: 1,
      limit: 10,
      tahun_dari: 2021,
      tahun_sampai: 2022
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call downloadExcelTeknis with correct parameters', async () => {
    const mockResponse = { data: new ArrayBuffer(8) };
    mockGetFile.mockResolvedValueOnce(mockResponse);

    const result = await service.downloadExcelTeknis(2021, 2022, 'search-query');

    expect(mockGetFile).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/teknis/export-excel', {
      tahun_dari: 2021,
      tahun_sampai: 2022,
      search: 'search-query'
    }, 'arraybuffer');
    expect(result).toEqual(mockResponse);
  });

  it('should call getInfoSFC with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getInfoSFC' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getInfoSFC();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/teknis/info-sfc');
    expect(result).toEqual(mockResponse);
  });

  it('should call getChartDaya with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getChartDaya' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getChartDaya();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/perbandingan-daya');
    expect(result).toEqual(mockResponse);
  });

  it('should call getTahunSelected with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getTahunSelected' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getTahunSelected();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-tahun-max');
    expect(result).toEqual(mockResponse);
  });

  it('should call getListTahun with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getListTahun' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getListTahun();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-tahun-data');
    expect(result).toEqual(mockResponse);
  });

  it('should call getChartKategori with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getChartKategori' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getChartKategori('kategori1', 100);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/sebaran-unit', {
      kategori: 'kategori1',
      id_daya: 100
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getCAPEXEAF with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getCAPEXEAF' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getCAPEXEAF('kode_jenis_kit_mock', 2023);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/grafik/laman/finansial/eaf', {
      kode_jenis_kit: 'kode_jenis_kit_mock',
      tahun_realisasi: 2023
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call getListTahunAnalitik with correct parameters', async () => {
    const mockResponse = { data: 'mocked response for getListTahunAnalitik' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getListTahunAnalitik();

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-analitik');
    expect(result).toEqual(mockResponse);
  });

  // Test error handling
  it('should handle errors in getTotalDaya', async () => {
    const mockError = new Error('Total Daya Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getTotalDaya()).rejects.toThrow('Total Daya Error');
  });

  it('should handle errors in getMesinBelumInput', async () => {
    const mockError = new Error('Mesin Belum Input Error');
    mockPost.mockRejectedValueOnce(mockError);

    await expect(service.getMesinBelumInput(1, 10, ['pengelola1'], 'search')).rejects.toThrow('Mesin Belum Input Error');
  });

  it('should handle errors in downloadExcelCAPEXOPEX', async () => {
    const mockError = new Error('Download Excel CAPEX OPEX Error');
    mockGetFile.mockRejectedValueOnce(mockError);

    await expect(service.downloadExcelCAPEXOPEX(2021, 2022, 'search', 'type')).rejects.toThrow('Download Excel CAPEX OPEX Error');
  });

  it('should handle errors in getDataFinansial', async () => {
    const mockError = new Error('Data Finansial Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getDataFinansial('search', 2022, 1, 10)).rejects.toThrow('Data Finansial Error');
  });

  it('should handle errors in downloadExcelFinansial', async () => {
    const mockError = new Error('Download Excel Finansial Error');
    mockGetFile.mockRejectedValueOnce(mockError);

    await expect(service.downloadExcelFinansial(2022, 'search')).rejects.toThrow('Download Excel Finansial Error');
  });

  it('should handle errors in getDataTeknis', async () => {
    const mockError = new Error('Data Teknis Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getDataTeknis('search', 1, 10, 2021, 2022)).rejects.toThrow('Data Teknis Error');
  });

  it('should handle errors in downloadExcelTeknis', async () => {
    const mockError = new Error('Download Excel Teknis Error');
    mockGetFile.mockRejectedValueOnce(mockError);

    await expect(service.downloadExcelTeknis(2021, 2022, 'search')).rejects.toThrow('Download Excel Teknis Error');
  });

  it('should handle errors in getCAPEXEAF', async () => {
    const mockError = new Error('CAPEX EAF Error');
    mockGet.mockRejectedValueOnce(mockError);

    await expect(service.getCAPEXEAF('kit_code', 2023)).rejects.toThrow('CAPEX EAF Error');
  });

  // Test parameter edge cases
  it('should handle null parameters in getDataAnggaran', async () => {
    const mockResponse = { data: 'mocked response for null params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getDataAnggaran(null, null, null);

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran', {
      search: null,
      tahun_sampai: null,
      tahun_dari: null
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle empty array in getMesinBelumInput', async () => {
    const mockResponse = { data: 'mocked response for empty array' };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesinBelumInput(1, 10, [], '');

    expect(mockPost).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/mesin-belum-terinput', {
      page: 1,
      limit: 10,
      kode_pengelola: [],
      search: ''
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle numeric parameters in getChartKategori', async () => {
    const mockResponse = { data: 'mocked response for numeric params' };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getChartKategori(123, 'string_daya');

    expect(mockGet).toHaveBeenCalledWith('https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/sebaran-unit', {
      kategori: 123,
      id_daya: 'string_daya'
    });
    expect(result).toEqual(mockResponse);
  });

  // Test service inheritance
  it('should extend BaseService', () => {
    expect(service).toBeInstanceOf(BaseService);
  });
});
