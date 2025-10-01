import { shallowMount } from "@vue/test-utils";
import VerifikasiSSO from "@/views/VerifikasiSSO.vue";
import ModalNotification from "@/components/ui/ModalNotification.vue";
import LoginService from "@/services/auth-service";
import router from "@/router";
import { useRoute } from "vue-router";

jest.mock("@/store/storeSession", () => ({
  useSessionStore: jest.fn(() => ({
    invalidateSession: jest.fn(),
    $state: {
      userSession: null,
    },
  })),
}));

const mockVerifikasiSSO = jest.fn();
jest.mock("@/services/auth-service", () => {
  return jest.fn().mockImplementation(() => ({
    verifikasiSSO: mockVerifikasiSSO,
  }));
});

jest.mock("@/utils/app-encrypt-storage", () => ({
  encryptStoragePromise: Promise.resolve({
    setItem: jest.fn(),
    getItem: jest.fn(),
    clear: jest.fn(),
  }),
}));

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
}));

jest.mock("@/router", () => ({
  push: jest.fn(),
}));

jest.mock("crypto-js", () => ({
  HmacSHA512: jest.fn(() => ({
    toString: jest.fn(() => "mocked-hash"),
  })),
}));

Object.defineProperty(window, "userHashSecretKey", {
  value: jest.fn(() => "secret-key"),
  writable: true,
});

const mockLocalStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(import.meta, "env", {
  value: {
    MODE: "development",
  },
  writable: true,
});

describe("VerifikasiSSO.vue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.clear.mockClear();

    (useRoute as jest.Mock).mockReturnValue({
      query: { code: "test-sso-code" },
      params: {},
      path: "/verifikasi-sso",
      fullPath: "/verifikasi-sso?code=test-sso-code",
      name: "VerifikasiSSO",
      meta: {},
      matched: [],
      hash: "",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component with correct template structure", () => {
    const wrapper = shallowMount(VerifikasiSSO, {
      global: {
        stubs: {
          ModalNotification: true,
        },
      },
    });

    expect(
      wrapper.find(".bg-white.text-primaryTextColor.min-h-dvh").exists(),
    ).toBe(true);
    expect(wrapper.findComponent(ModalNotification).exists()).toBe(true);
  });

  it("should call verifikasiSSO on component mount", async () => {
    mockVerifikasiSSO.mockResolvedValueOnce({
      success: true,
      data: {
        nama_pegawai: "John Doe",
        uuid_sentral: "123",
      },
    });

    shallowMount(VerifikasiSSO, {
      global: {
        stubs: {
          ModalNotification: true,
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockVerifikasiSSO).toHaveBeenCalledWith("test-sso-code");
  });

  it("should handle successful SSO verification", async () => {
    mockVerifikasiSSO.mockResolvedValueOnce({
      success: true,
      data: {
        nama_pegawai: "John Doe",
        uuid_sentral: "123",
      },
    });

    const wrapper = shallowMount(VerifikasiSSO, {
      global: {
        stubs: {
          ModalNotification: true,
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(mockVerifikasiSSO).toHaveBeenCalledWith("test-sso-code");
    expect(jest.mocked(router.push)).toHaveBeenCalledWith("/peta");
  });

  it("should handle SSO verification failure", async () => {
    mockVerifikasiSSO.mockResolvedValueOnce({
      success: false,
    });

    const wrapper = shallowMount(VerifikasiSSO, {
      global: {
        stubs: {
          ModalNotification: true,
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const modalNotification = wrapper.findComponent(ModalNotification);
    expect(modalNotification.props("showModal")).toBe(true);
    expect(modalNotification.props("title")).toBe("Verifikasi SSO Gagal");
    expect(modalNotification.props("subtitle")).toBe(
      "User anda tidak terdaftar pada aplikasi valiant",
    );
  });

  it("should handle SSO verification error", async () => {
    mockVerifikasiSSO.mockRejectedValueOnce(new Error("Network error"));

    const wrapper = shallowMount(VerifikasiSSO, {
      global: {
        stubs: {
          ModalNotification: true,
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const modalNotification = wrapper.findComponent(ModalNotification);
    expect(modalNotification.props("showModal")).toBe(true);
  });

  it("should handle empty uuid_sentral correctly", async () => {
    mockVerifikasiSSO.mockResolvedValueOnce({
      success: true,
      data: {
        nama_pegawai: "Jane Doe",
        uuid_sentral: "",
      },
    });

    shallowMount(VerifikasiSSO, {
      global: {
        stubs: {
          ModalNotification: true,
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(mockVerifikasiSSO).toHaveBeenCalledWith("test-sso-code");
    expect(jest.mocked(router.push)).toHaveBeenCalledWith("/peta");
  });

  it("should handle zero uuid_sentral correctly", async () => {
    mockVerifikasiSSO.mockResolvedValueOnce({
      success: true,
      data: {
        nama_pegawai: "Jane Doe",
        uuid_sentral: "0",
      },
    });

    shallowMount(VerifikasiSSO, {
      global: {
        stubs: {
          ModalNotification: true,
        },
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(mockVerifikasiSSO).toHaveBeenCalledWith("test-sso-code");
    expect(jest.mocked(router.push)).toHaveBeenCalledWith("/peta");
  });
});
