import axios from 'axios';
import PerbaruiDataService from '@/services/perbarui-data';

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('PerbaruiDataService', () => {
  let service: PerbaruiDataService;

  beforeEach(() => {
    service = new PerbaruiDataService();

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

  it('should call getCheckIntegrasi with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getCheckIntegrasi' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getCheckIntegrasi(2023, 1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}filter/data-integrasi`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1, tahun: 2022 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { jenis_pembangkit: 'jenis_pembangkit_mock' },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { id_mesin: 1, tahun: 2023, status: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: { tahun_realisasi: 2023, id_mesin: 1 },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { kode_jenis_pembangkit: 'kode_jenis_pembangkit_mock' },
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
});
