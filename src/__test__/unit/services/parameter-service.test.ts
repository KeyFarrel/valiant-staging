import axios from 'axios';
import ParameterService from '@/services/parameter-service'; // Sesuaikan dengan path yang benar ke file ParameterService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('ParameterService', () => {
  let service: ParameterService;

  beforeEach(() => {
    service = new ParameterService();

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

  it('should call getParameterData with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getParameterData' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getParameterData(1, 10, 'search-query');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}parameter`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      params: { page: 1, limit: 10, search: 'search-query' },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call getParameterByID with correct GET parameters', async () => {
    const mockResponse = { data: 'mocked response for getParameterByID' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getParameterByID(1);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${mockUrl}parameter/1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call editParameter with correct PUT parameters', async () => {
    const mockResponse = { data: 'mocked response for editParameter' };
    const parameterData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.editParameter(1, parameterData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PUT',
      url: `${mockUrl}parameter/1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: parameterData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });

  it('should call addParameter with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for addParameter' };
    const parameterData = { field1: 'value1', field2: 'value2' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.addParameter(parameterData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}parameter`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: parameterData,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
