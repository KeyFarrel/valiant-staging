import PersetujuanService from "@/services/persetujuan-service"; // Sesuaikan path ini
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = "https://portalapp.iconpln.co.id:5080/valiant-be/v1/";

describe("PersetujuanService", () => {
  let service: PersetujuanService;

  beforeEach(() => {
    service = new PersetujuanService();

    // Mock localStorage for token retrieval
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") {
        return "mockToken";
      }
      return null;
    });

    (localStorage.getItem as jest.Mock).mockReturnValue("mockToken");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getPersetujuanKertasKerja with correct POST parameters", async () => {
    const mockResponse = { data: "test persetujuan KK" };
    const param = { status: "approved" };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPersetujuanKertasKerja(param);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "POST",
      url: `${mockUrl}persetujuan/all-persetujuan`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      data: param,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getPersetujuanFS with correct POST parameters", async () => {
    const mockResponse = { data: "test persetujuan FS" };
    const param = { status: "pending" };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPersetujuanFS(param);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "POST",
      url: `${mockUrl}persetujuan/all-persetujuan-fs`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      data: param,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call updateStatusKK with correct PATCH parameters", async () => {
    const mockResponse = { data: "status updated for KK" };
    const param = { id: 1, status: "approved" };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateStatusKK(param);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "PATCH",
      url: `${mockUrl}persetujuan/update-status`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      data: param,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call updateStatusFS with correct PATCH parameters", async () => {
    const mockResponse = { data: "status updated for FS" };
    const param = { id: 2, status: "rejected" };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.updateStatusFS(param);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "PATCH",
      url: `${mockUrl}persetujuan/update-status-fs`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      data: param,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getPersetujuanKKSentral with correct GET parameters", async () => {
    const mockResponse = { data: "detail KK sentral" };
    const param = { id: 1 };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPersetujuanKKSentral(param);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}persetujuan/detail-persetujuan`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      params: param,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getPersetujuanFSSentral with correct GET parameters", async () => {
    const mockResponse = { data: "detail FS sentral" };
    const param = { id: 2 };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPersetujuanFSSentral(param);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}persetujuan/detail-persetujuan-fs`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      params: param,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getDetailMesinAppr with correct GET parameters", async () => {
    const mockResponse = { data: "detail mesin approved" };
    const param = { id_mesin: 3 };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getDetailMesinAppr(param);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}persetujuan/detail-sentral`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      params: param,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getPengelolaData with correct GET parameters", async () => {
    const mockResponse = { data: "pengelola data" };
    mockedAxios.mockResolvedValueOnce({ data: mockResponse });

    const result = await service.getPengelolaData();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}filter/combo-pengelola`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
    });
    expect(result).toEqual(mockResponse);
  });
});
