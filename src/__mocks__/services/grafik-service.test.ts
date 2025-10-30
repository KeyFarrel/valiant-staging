import GrafikService from "@/services/grafik-service";
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

describe("GrafikService", () => {
  let grafikService: GrafikService;
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

    grafikService = new GrafikService();
  });

  describe("Card Information APIs", () => {
    const mockParam = { test: "param" };

    it("should call getPlanning with correct parameters", async () => {
      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getPlanning(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-planing", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getRealisasiProyeksi with correct parameters", async () => {
      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getRealisasiProyeksi(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-realisasi-proyeksi", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getRealisasiYoy with correct parameters", async () => {
      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getRealisasiYoy(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-realisasi-yoy", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getPlanReal with correct parameters", async () => {
      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getPlanReal(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-planning-realisasi", mockParam);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Machine APIs", () => {
    const mockParam = { test: "param" };

    it("should call getPlanningMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getPlanningMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-planing-mesin", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getRealisasiProyeksiMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getRealisasiProyeksiMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-realisasi-proyeksi-mesin", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getRealisasiYoyMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getRealisasiYoyMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-realisasi-yoy-mesin", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getPlanRealMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: [] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getPlanRealMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-planning-realisasi-mesin", mockParam);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Year Filter APIs", () => {
    const mockParam = { test: "param" };

    it("should call getYearSentral with correct parameters", async () => {
      const mockResponse = { success: true, data: [2020, 2021, 2022] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getYearSentral(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/tahun-persentral", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getYearMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: [2020, 2021, 2022] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getYearMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/tahun-permesin", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getRangeYearSentral with correct parameters", async () => {
      const mockResponse = { success: true, data: { min: 2020, max: 2023 } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getRangeYearSentral(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/range-tahun-persentral", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getRangeYearMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: { min: 2020, max: 2023 } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getRangeYearMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/range-tahun-permesin", mockParam);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Grafik Sentral APIs", () => {
    const mockParam = { test: "param" };

    it("should call getGrafikWLCALL with correct parameters", async () => {
      const mockResponse = { success: true, data: { chart: "data" } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGrafikWLCALL(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/wlc-all-sentral", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGrafikWLCALLDetail with correct parameters", async () => {
      const mockResponse = { success: true, data: { detail: "data" } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGrafikWLCALLDetail(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/wlc-all-sentral/detail", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGrafikWLCKom with correct parameters", async () => {
      const mockResponse = { success: true, data: { komponen: "data" } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGrafikWLCKom(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/wlc-komponen-sentral", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGrafikPlan with correct parameters", async () => {
      const mockResponse = { success: true, data: { planning: "data" } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGrafikPlan(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/planning-fs-sentral", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGrafikPRP with correct parameters", async () => {
      const mockResponse = { success: true, data: { prp: "data" } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGrafikPRP(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/planning-realisasi-proyeksi-sentral", mockParam);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Grafik Mesin APIs", () => {
    const mockParam = { test: "param" };

    it("should call getGrafikWLCALLMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: { chart: "data" } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGrafikWLCALLMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/wlc-all", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGrafikPlanMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: { planning: "data" } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGrafikPlanMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/planning-fs", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGrafikPRPMesin with correct parameters", async () => {
      const mockResponse = { success: true, data: { prp: "data" } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGrafikPRPMesin(mockParam);

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/planning-realisasi-proyeksi", mockParam);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Analitik POST APIs", () => {
    const mockParam = { test: "param" };

    it("should call getAnalitikCapex with correct parameters", async () => {
      const mockResponse = { success: true, data: { capex: "data" } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getAnalitikCapex(mockParam);

      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/grafik/laman/finansial/eaf", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getAnalitikOpex with correct parameters", async () => {
      const mockResponse = { success: true, data: { opex: "data" } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getAnalitikOpex(mockParam);

      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/laman/analitik/opex", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGraphicBiaya with correct parameters", async () => {
      const mockResponse = { success: true, data: { biaya: "data" } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGraphicBiaya(mockParam);

      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/grafik/laman/komponen", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGraphicRNFA with correct parameters", async () => {
      const mockResponse = { success: true, data: { rnfa: "data" } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGraphicRNFA(mockParam);

      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/dashboard/grafik/finansial-ebitda", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGraphicAnalitikEAF with correct parameters", async () => {
      const mockResponse = { success: true, data: { eaf: "data" } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGraphicAnalitikEAF(mockParam);

      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/grafik/laman/finansial/eaf", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGraphicAnalitikCF with correct parameters", async () => {
      const mockResponse = { success: true, data: { cf: "data" } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGraphicAnalitikCF(mockParam);

      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/grafik/laman/finansial/ncf", mockParam);
      expect(result).toEqual(mockResponse);
    });

    it("should call getGraphicTeknisNCF with correct parameters", async () => {
      const mockResponse = { success: true, data: { teknis: "data" } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getGraphicTeknisNCF(mockParam);

      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/grafik/laman/teknis/ncf", mockParam);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Filter Combo APIs", () => {
    it("should call getComboKategoriPembangkit without parameters", async () => {
      const mockResponse = { success: true, data: [{ id: "1", name: "PLTU" }] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getComboKategoriPembangkit();

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-jenis-kit");
      expect(result).toEqual(mockResponse);
    });

    it("should call getFilterDaya without parameters", async () => {
      const mockResponse = { success: true, data: [{ id: "1", daya: "500" }] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getFilterDaya();

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/grafik/filter/daya");
      expect(result).toEqual(mockResponse);
    });

    it("should call getTahunTerakhirRealisasiAnalitik without parameters", async () => {
      const mockResponse = { success: true, data: { tahun: 2023 } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getTahunTerakhirRealisasiAnalitik();

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-tahun-max");
      expect(result).toEqual(mockResponse);
    });

    it("should call getInitialPembangkit without parameters", async () => {
      const mockResponse = { success: true, data: [{ id: "1", name: "PLTU" }] };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await grafikService.getInitialPembangkit();

      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/filter/combo-max-jenis-pembangkit");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Error Handling", () => {
    const mockParam = { test: "param" };

    it("should handle GET request errors", async () => {
      const error = new Error("Network error");
      mockGet.mockRejectedValueOnce(error);

      await expect(grafikService.getPlanning(mockParam)).rejects.toThrow("Network error");
      expect(mockGet).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/peta/detail-planing", mockParam);
    });

    it("should handle POST request errors", async () => {
      const error = new Error("Server error");
      mockPost.mockRejectedValueOnce(error);

      await expect(grafikService.getGraphicBiaya(mockParam)).rejects.toThrow("Server error");
      expect(mockPost).toHaveBeenCalledWith("https://portalapp.iconpln.co.id:5080/valiant-be/v1/grafik/laman/komponen", mockParam);
    });
  });

  describe("Service Inheritance", () => {
    it("should extend BaseService", () => {
      expect(grafikService).toBeInstanceOf(GrafikService);
      expect(grafikService).toHaveProperty('get');
      expect(grafikService).toHaveProperty('post');
    });

    it("should have access to BaseService methods", () => {
      expect(mockGet).toBeDefined();
      expect(mockPost).toBeDefined();
    });
  });
});
