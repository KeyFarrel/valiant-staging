import UserService from "@/services/user-service"; // Sesuaikan path ini
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

const mockUrl = import.meta.env.VITE_API_URL;

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();

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

  it("should call getUserData with correct GET parameters", async () => {
    const mockResponse = { data: "test user data" };
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const page = 1;
    const limit = 10;
    const search = "John";
    const result = await service.getUserData(page, limit, search);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}user`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      params: { page, limit, search },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getUserById with correct GET parameters", async () => {
    const mockResponse = { data: "test user" };
    const userId = 1;
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.getUserById(userId);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}user/${userId}`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getSentral with correct GET parameters", async () => {
    const mockResponse = { data: "test sentral" };
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.getSentral();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}filter/combo-sentral`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getRole with correct GET parameters", async () => {
    const mockResponse = { data: "test role" };
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.getRole();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}role/combo-role`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getInduk with correct GET parameters", async () => {
    const mockResponse = { data: "test induk" };
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.getInduk();

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

  it("should call getPembina with correct GET parameters", async () => {
    const mockResponse = { data: "test pembina" };
    const idPengelola = 1;
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.getPembina(idPengelola);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}filter/combo-pembina`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      params: { id_pengelola: idPengelola },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getMesin with correct GET parameters", async () => {
    const mockResponse = { data: "test mesin" };
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.getMesin();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}filter/combo-mesin`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getLevel with correct GET parameters", async () => {
    const mockResponse = { data: "test level" };
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.getLevel();

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}level`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call createUser with correct POST parameters", async () => {
    const mockResponse = { data: "user created" };
    const dataToPost = { name: "John Doe", role: "Admin" };
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.createUser(dataToPost);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "POST",
      url: `${mockUrl}user`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      data: dataToPost,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call resetPassword with correct POST parameters", async () => {
    const mockResponse = { data: "password reset" };
    const emailConfirm = "john@example.com";
    const emailReset = "reset@example.com";
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.resetPassword(emailConfirm, emailReset);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "POST",
      url: `${mockUrl}user/reset-password`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      data: {
        email_confirm: emailConfirm,
        email: emailReset,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call updateUser with correct PATCH parameters", async () => {
    const mockResponse = { data: "user updated" };
    const userId = 1;
    const dataToUpdate = { name: "John Updated" };
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.updateUser(userId, dataToUpdate);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "PATCH",
      url: `${mockUrl}user/${userId}`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      data: dataToUpdate,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should call getSentralByPengelola with correct GET parameters", async () => {
    const mockResponse = { data: "test sentral by pengelola" };
    const idPengelola = 1;
    const idPembina = 2;
    mockedAxios.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await service.getSentralByPengelola(idPengelola, idPembina);

    expect(mockedAxios).toHaveBeenCalledWith({
      method: "GET",
      url: `${mockUrl}filter/combo-sentral`,
      headers: {
        Authorization: "Bearer mockToken",
        "Content-Type": "application/json",
      },
      timeout: 120000,
      params: { id_pengelola: idPengelola, id_pembina: idPembina },
    });
    expect(result).toEqual(mockResponse);
  });
});
