import LihatOPEXService from "@/services/lihat-opex-service";
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

describe("LihatOPEXService", () => {
  let service: LihatOPEXService;
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

    service = new LihatOPEXService();
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

  it("should call getAsumsiParameterData with correct POST parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getAsumsiParameterData" };
    mockPost.mockResolvedValueOnce(mockResponse);

    const result = await service.getAsumsiParameterData(2023, 1, 2022);

    expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/asumsi-parameter", { tahun_realisasi: 2023, uuid_mesin: 1, tahun: 2022 });
    expect(result).toEqual(mockResponse);
  });

  it("should call getAnggaranDetailCAPEX with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getAnggaranDetailCAPEX" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getAnggaranDetailCAPEX(2023, 1);

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/capex", { tahun: 2023, uuid_mesin: 1 });
    expect(result).toEqual(mockResponse);
  });

  it("should call getTotalReplacement with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getTotalReplacement" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getTotalReplacement(2023, 1);

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/capex-replacement", { tahun: 2023, uuid_mesin: 1 });
    expect(result).toEqual(mockResponse);
  });

  it("should call getOPEXKomponenB with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getOPEXKomponenB" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getOPEXKomponenB(1, 2023);

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/opex-komponen-b", { uuid_mesin: 1, tahun: 2023 });
    expect(result).toEqual(mockResponse);
  });

  it("should call getOPEXKomponenC with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getOPEXKomponenC" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getOPEXKomponenC(1, 2023);

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/opex-komponen-c", { uuid_mesin: 1, tahun: 2023 });
    expect(result).toEqual(mockResponse);
  });

  it("should call getOPEXKomponenD with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getOPEXKomponenD" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getOPEXKomponenD(1, 2023);

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/opex-komponen-d", { uuid_mesin: 1, tahun: 2023 });
    expect(result).toEqual(mockResponse);
  });

  it("should call getTahunAnggaran with correct GET parameters", async () => {
    const mockResponse = { success: true, data: "mocked response for getTahunAnggaran" };
    mockGet.mockResolvedValueOnce(mockResponse);

    const result = await service.getTahunAnggaran();

    expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/data/anggaran/tahun");
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

      await expect(service.getAsumsiParameterData(2023, 1, 2022)).rejects.toThrow("Server error");
      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/kertas-kerja-detail/asumsi-parameter", { tahun_realisasi: 2023, uuid_mesin: 1, tahun: 2022 });
    });
  });

  describe("Service Inheritance", () => {
    it("should extend BaseService", () => {
      expect(service).toBeInstanceOf(LihatOPEXService);
      expect(service).toHaveProperty('get');
      expect(service).toHaveProperty('post');
    });

    it("should have access to BaseService methods", () => {
      expect(mockGet).toBeDefined();
      expect(mockPost).toBeDefined();
    });
  });
});
