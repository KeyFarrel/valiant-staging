import axios from "axios";
import BaseService from "@/services/base-service";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

// Mock encryption helper
jest.mock("@/services/helper/encryption", () => ({
  encryptAES: jest.fn().mockReturnValue("encrypted-data"),
}));

// Mock FingerprintJS
jest.mock("@fingerprintjs/fingerprintjs", () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({
      components: {
        hardwareConcurrency: { value: 4 },
        deviceMemory: { value: 8 },
        platform: { value: "MacIntel" },
        architecture: { value: 64 },
        screenResolution: { value: [1920, 1080] },
        vendor: { value: "Google Inc." },
        vendorFlavors: { value: ["chrome"] },
        colorDepth: { value: 24 },
        canvas: { value: "canvas" },
        webGlBasics: { value: "webgl" },
        timezone: { value: "Asia/Jakarta" },
        touchSupport: { value: { maxTouchPoints: 0 } },
        cookiesEnabled: { value: true },
        localStorage: { value: true },
        sessionStorage: { value: true },
        colorGamut: { value: "srgb" },
        hdr: { value: false },
      },
    }),
  }),
  hashComponents: jest.fn().mockReturnValue("mockFingerprint"),
}));

// Mock import.meta.env
Object.defineProperty(globalThis, 'importMeta', {
  value: {
    env: {
      MODE: 'development'
    }
  },
  writable: true
});

describe("BaseService", () => {
  let service: BaseService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new BaseService();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test GET method
  it('should call axios with correct GET method', async () => {
    const mockResponse = { data: { data: 'test' } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.get('/test', { key: 'value' }, 'json');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test',
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      withCredentials: true,
      params: { key: 'value' },
      responseType: 'json',
    });

    expect(consoleSpy).toHaveBeenCalledWith('Response Method Get:', mockResponse);
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle GET method without parameters', async () => {
    const mockResponse = { data: { message: 'success' } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.get('/test');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test',
      headers: {
        'Content-Type': 'application/json',
        'X-Fingerprint-ID': 'mockFingerprint',
      },
      timeout: 120000,
      withCredentials: true,
      params: undefined,
      responseType: undefined,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should handle GET method errors', async () => {
    const mockError = new Error('GET request failed');
    mockedAxios.mockRejectedValueOnce(mockError);

    await expect(service.get('/test')).rejects.toThrow('GET request failed');
  });

  // Test POST method
  it("should call axios with correct POST method", async () => {
    const mockResponse = { data: { data: "test" } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.post("/test", { key: "value" });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "POST",
      url: "/test",
      withCredentials: true,
      data: { key: "value" }, // In development mode, data is not encrypted
      headers: {
        "Content-Type": "application/json",
        "X-Fingerprint-ID": "mockFingerprint",
      },
      timeout: 120000,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Response Method Post:', mockResponse);
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle POST method without payload", async () => {
    const mockResponse = { data: { message: "created" } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.post("/test");

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "POST",
      url: "/test",
      withCredentials: true,
      data: undefined,
      headers: {
        "Content-Type": "application/json",
        "X-Fingerprint-ID": "mockFingerprint",
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it("should handle POST method errors", async () => {
    const mockError = new Error('POST request failed');
    mockedAxios.mockRejectedValueOnce(mockError);

    await expect(service.post("/test", { key: "value" })).rejects.toThrow('POST request failed');
  });

  // Test PUT method
  it("should call axios with correct PUT method", async () => {
    const mockResponse = { data: { data: "test" } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.put("/test", { key: "value" });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "PUT",
      url: "/test",
      data: { key: "value" },
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000,
      withCredentials: true,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it("should handle PUT method errors", async () => {
    const mockError = new Error('PUT request failed');
    mockedAxios.mockRejectedValueOnce(mockError);

    await expect(service.put("/test", { key: "value" })).rejects.toThrow('PUT request failed');
  });

  // Test PATCH method (uses encryption)
  it("should call axios with correct PATCH method", async () => {
    const mockResponse = { data: { data: "test" } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.patch("/test", { key: "value" });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "PATCH",
      url: "/test",
      data: "encrypted-data", // PATCH method encrypts data
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000,
      withCredentials: true,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it("should handle PATCH method errors", async () => {
    const mockError = new Error('PATCH request failed');
    mockedAxios.mockRejectedValueOnce(mockError);

    await expect(service.patch("/test", { key: "value" })).rejects.toThrow('PATCH request failed');
  });

  // Test DELETE method
  it("should call axios with correct DELETE method", async () => {
    const mockResponse = { data: { data: "test" } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.delete("/test");

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "DELETE",
      url: "/test",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000,
      withCredentials: true,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it("should handle DELETE method errors", async () => {
    const mockError = new Error('DELETE request failed');
    mockedAxios.mockRejectedValueOnce(mockError);

    await expect(service.delete("/test")).rejects.toThrow('DELETE request failed');
  });

  // Test FormData methods
  it('should call axios with correct POST FormData method', async () => {
    const mockResponse = { data: { data: 'test' } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const formData = new FormData();
    formData.append('file', 'test-file');

    const result = await service.postFormData('/test', formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: '/test',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
      withCredentials: true,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should call axios with correct PUT FormData method', async () => {
    const mockResponse = { data: { data: 'test' } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const formData = new FormData();
    formData.append('file', 'test-file');

    const result = await service.putFormData('/test', formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/test',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
      withCredentials: true,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should handle FormData method errors', async () => {
    const mockError = new Error('FormData upload failed');
    mockedAxios.mockRejectedValueOnce(mockError);

    const formData = new FormData();
    await expect(service.postFormData('/test', formData)).rejects.toThrow('FormData upload failed');
  });

  // Test File methods
  it('should call axios with correct POST File method', async () => {
    const mockResponse = { data: { data: 'test' } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.postFile('/test', { key: 'value' });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: '/test',
      data: { key: 'value' },
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      timeout: 120000,
      withCredentials: true,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should call axios with correct PUT File method', async () => {
    const mockResponse = { data: { data: 'test' } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.putFile('/test', { key: 'value' });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/test',
      data: { key: 'value' },
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      timeout: 120000,
      withCredentials: true,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should handle File method errors', async () => {
    const mockError = new Error('File upload failed');
    mockedAxios.mockRejectedValueOnce(mockError);

    await expect(service.postFile('/test', { key: 'value' })).rejects.toThrow('File upload failed');
  });

  // Test getFile method
  it('should call axios with correct getFile method', async () => {
    const mockResponse = { data: 'file-content' };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.getFile('/test', { key: 'value' }, 'blob');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test',
      headers: {},
      timeout: 120000,
      withCredentials: true,
      params: { key: 'value' },
      responseType: 'blob',
    });

    expect(result).toEqual(mockResponse);
  });

  // Test api method
  it('should call axios with api method', async () => {
    const mockResponse = { data: { result: 'test' } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    const result = await service.api('POST', '/test', { key: 'value' }, 'application/xml');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: '/test',
      data: { key: 'value' },
      headers: {
        'Content-Type': 'application/xml',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should use default content type in api method', async () => {
    const mockResponse = { data: { result: 'test' } };
    mockedAxios.mockResolvedValueOnce(mockResponse);

    await service.api('GET', '/test');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test',
      data: undefined,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 120000,
    });
  });
});
