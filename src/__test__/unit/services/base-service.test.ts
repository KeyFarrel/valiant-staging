import axios from "axios";
import BaseService from "@/services/base-service";

jest.mock("axios");
jest.mock("@/store", () => ({
  store: {
    getState: jest.fn(() => ({ token: "mockToken" })),
  },
}));
jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: {
    getItem: jest.fn().mockResolvedValue("mockToken"),
  },
}));
jest.mock("@/services/helper/encryption", () => ({
  encryptAES: jest.fn().mockResolvedValue("encrypted"),
}));
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

const mockedAxios = axios as jest.MockedFunction<typeof axios>;

globalThis.importMetaEnv = {
  MODE: "development",
};

describe("BaseService", () => {
  const service: BaseService = new BaseService();

  beforeEach(() => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") {
        return "mockToken";
      }
      return null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call axios with correct GET method', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.get('/test', { key: 'value' }, 'json');

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
      params: { key: 'value' },
      responseType: 'json',
    });

    expect(result).toEqual(mockData);
  });

  it("should call axios with correct POST method", async () => {
    const mockData = { data: "test" };

    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.post("/test", { key: "value" });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "POST",
      url: "/test",
      data: { key: "value" },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer mockToken",
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it("should call axios with correct PUT method", async () => {
    const mockData = { data: "test" };

    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.put("/test", { key: "value" });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "PUT",
      url: "/test",
      data: { key: "value" },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer mockToken",
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it("should call axios with correct PATCH method", async () => {
    const mockData = { data: "test" };

    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.patch("/test", { key: "value" });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "PATCH",
      url: "/test",
      data: { key: "value" },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer mockToken",
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it("should call axios with correct DELETE method", async () => {
    const mockData = { data: "test" };

    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.delete("/test");

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "DELETE",
      url: "/test",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer mockToken",
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it('should call axios with correct POST FormData method', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const formData = new FormData();
    formData.append('file', 'test-file');

    const result = await service.postFormData('/test', formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: '/test',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it('should call axios with correct PUT FormData method', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const formData = new FormData();
    formData.append('file', 'test-file');

    const result = await service.putFormData('/test', formData);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/test',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it('should call axios with correct POST File method', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.postFile('/test', { key: 'value' });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'POST',
      url: '/test',
      data: { key: 'value' },
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });

  it('should call axios with correct PUT File method', async () => {
    const mockData = { data: 'test' };
    mockedAxios.mockResolvedValueOnce({
      data: mockData,
    });

    const result = await service.putFile('/test', { key: 'value' });

    expect(mockedAxios).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/test',
      data: { key: 'value' },
      headers: {
        'Content-Type': 'application/octet-stream',
        Authorization: 'Bearer mockToken',
      },
      timeout: 120000,
    });

    expect(result).toEqual(mockData);
  });
});
