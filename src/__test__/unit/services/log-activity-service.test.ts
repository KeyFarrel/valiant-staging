import axios from 'axios';
import LogActivityService from '@/services/log-activity-service'; // Sesuaikan dengan path yang benar ke file LogActivityService

jest.mock('axios');
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe('LogActivityService', () => {
  let service: LogActivityService;

  beforeEach(() => {
    service = new LogActivityService();

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

  it('should call getLogActivity with correct POST parameters', async () => {
    const mockResponse = { data: 'mocked response for getLogActivity' };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const params = { userId: 123, activityType: 'LOGIN' };
    const result = await service.getLogActivity(params);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${mockUrl}log/all-log`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      data: params,
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse);
  });
});
