import InputAsumsiParameterService from "@/services/input-asumsi-parameter-service";
import BaseService from "@/services/base-service";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import CryptoJS from "crypto-js";

// Mock dependencies
jest.mock("@/services/base-service");
jest.mock("@fingerprintjs/fingerprintjs");
jest.mock("crypto-js");

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: 'https://portalapp.iconpln.co.id:5080/valiant-be/v1/',
    VITE_ENCRYPTION_KEY: 'test-key'
  },
  writable: true
});

describe("InputAsumsiParameterService", () => {
  let service: InputAsumsiParameterService;
  let mockGet: jest.Mock;
  let mockPost: jest.Mock;
  let mockLoad: jest.Mock;
  let mockHashComponents: jest.Mock;
  let mockEncrypt: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock BaseService methods
    mockGet = jest.fn();
    mockPost = jest.fn();
    
    // Mock BaseService prototype methods
    BaseService.prototype.get = mockGet;
    BaseService.prototype.post = mockPost;

    // Mock FingerprintJS
    mockHashComponents = jest.fn();
    mockLoad = jest.fn().mockResolvedValue({
      get: jest.fn().mockResolvedValue({
        components: { canvas: { value: "test-canvas" } }
      })
    });
    (FingerprintJS.load as jest.Mock) = mockLoad;
    (FingerprintJS.hashComponents as jest.Mock) = mockHashComponents;

    // Mock CryptoJS
    mockEncrypt = jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue("encrypted-data")
    });
    (CryptoJS.AES.encrypt as jest.Mock) = mockEncrypt;

    service = new InputAsumsiParameterService();
  });

  it("should call getMesinById with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getMesinById" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getMesinById(1);

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/mesin-realisasi/1");
    expect(result).toEqual(mockResponse);
  });

  it("should call getPembangkitByKode with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getPembangkitByKode" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPembangkitByKode("kode_sentral_mock");

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/by-kode", { kode_sentral: "kode_sentral_mock" });
    expect(result).toEqual(mockResponse);
  });

  it("should call getPengelolaData with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getPengelolaData" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getPengelolaData();

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-pengelola");
    expect(result).toEqual(mockResponse);
  });

  it("should call getAsumsiMakroData with correct POST parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getAsumsiMakroData" };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getAsumsiMakroData(2023, 1, 2022);

    expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/asumsi-parameter", { tahun_realisasi: 2023, uuid_mesin: 1, tahun: 2022 });
    expect(result).toEqual(mockResponse);
  });

  it("should call getComboBahanBakar with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getComboBahanBakar" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getComboBahanBakar("jenis_pembangkit_mock");

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-bahan-bakar", { jenis_pembangkit: "jenis_pembangkit_mock" });
    expect(result).toEqual(mockResponse);
  });

  it("should call getStatusRealisasiById with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getStatusRealisasiById" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getStatusRealisasiById(1);

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/pembangkit/status-realisasi-by-mesin", { uuid_mesin: 1 });
    expect(result).toEqual(mockResponse);
  });

  it("should call createAsumsi with correct POST parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for createAsumsi" };
    const formAsumsi = { field1: "value1", field2: "value2" };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.createAsumsi(formAsumsi);

    expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/asumsi-create", formAsumsi);
    expect(result).toEqual(mockResponse);
  });

  it("should call updateAsumsi with correct POST parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for updateAsumsi" };
    const formAsumsi = { field1: "value1", field2: "value2" };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.updateAsumsi(formAsumsi);

    expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/asumsi-wacc-update", formAsumsi);
    expect(result).toEqual(mockResponse);
  });

  it("should call createParameter with correct POST parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for createParameter" };
    const formParameter = { field1: "value1", field2: "value2" };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.createParameter(formParameter);

    expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/parameter-finansial", formParameter);
    expect(result).toEqual(mockResponse);
  });

  describe("Error Handling", () => {
    it("should handle GET request errors", async () => {
      const error = new Error("Network error");
      mockGet.mockRejectedValueOnce(error);

      await expect(service.getMesinById(1)).rejects.toThrow("Network error");
      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/mesin-realisasi/1");
    });

    it("should handle POST request errors", async () => {
      const error = new Error("Server error");
      mockPost.mockRejectedValueOnce(error);
      const formAsumsi = { field1: "value1", field2: "value2" };

      await expect(service.createAsumsi(formAsumsi)).rejects.toThrow("Server error");
      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/asumsi-create", formAsumsi);
    });
  });

  describe("Service Inheritance", () => {
    it("should extend BaseService", () => {
      expect(service).toBeInstanceOf(InputAsumsiParameterService);
      expect(service).toHaveProperty('get');
      expect(service).toHaveProperty('post');
    });

    it("should have access to BaseService methods", () => {
      expect(mockGet).toBeDefined();
      expect(mockPost).toBeDefined();
    });
  });
});
