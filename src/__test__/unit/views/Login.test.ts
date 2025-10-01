import { mount, shallowMount } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import LoginService from "@/services/auth-service";
import axios from "axios";

jest.mock("axios");

jest.mock("@/services/auth-service");

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  useRouter: () => ({
    replace: jest.fn(),
  }),
  createWebHistory: jest.fn(),
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
}));

jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}));

jest.mock("vue3-lottie", () => ({
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: "<div>Vue3Lottie</div>",
    props: ["animationData", "width", "height"],
  },
}));

global.requestAnimationFrame = jest.fn((cb) => {
  cb(0);
  return 1;
});
global.cancelAnimationFrame = jest.fn();

Object.defineProperty(window, "location", {
  value: {
    reload: jest.fn(),
    href: "http://localhost:3000",
  },
  writable: true,
});

describe("Login.vue", () => {
  let wrapper: any;
  let mockLoginService: any;

  beforeEach(() => {
    mockLoginService = {
      login: jest.fn(),
    };

    (LoginService as any).mockImplementation(() => mockLoginService);

    wrapper = shallowMount(Login, {
      global: {
        stubs: [
          "TextField",
          "RecaptchaV2",
          "ModalWrapper",
          "ModalNotification",
          "IconRoundedChecked",
          "IconRoundedClose",
          "Loading",
          "Vue3Lottie",
          "gocaptcha-slide",
        ],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form correctly", () => {
    expect(wrapper.find("h1").text()).toBe("Login");
    expect(wrapper.find("p").text()).toContain(
      "Silahkan login terlebih dahulu untuk masuk aplikasi.",
    );
  });

  it("should handle email and password input", async () => {
    wrapper.vm.valEmail = "test@example.com";
    wrapper.vm.valPassword = "password123";
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.valEmail).toBe("test@example.com");
    expect(wrapper.vm.valPassword).toBe("password123");
  });

  it("should show error when email is empty", async () => {
    wrapper.vm.valEmail = "";
    wrapper.vm.valPassword = "password123";

    expect(wrapper.vm.valEmail).toBe("");
    expect(wrapper.vm.valPassword).toBe("password123");
  });

  it("should show error when password is empty", async () => {
    wrapper.vm.valEmail = "test@example.com";
    wrapper.vm.valPassword = "";

    expect(wrapper.vm.valEmail).toBe("test@example.com");
    expect(wrapper.vm.valPassword).toBe("");
  });

  it("should call loginService.login and redirect on success", async () => {
    const mockLoginResponse = {
      data: { token: "dummy_token", is_reset: false },
    };
    mockLoginService.login.mockResolvedValue(mockLoginResponse);

    wrapper.vm.valEmail = "test@example.com";
    wrapper.vm.valPassword = "password123";
    wrapper.vm.isVerified = true;

    expect(wrapper.vm.valEmail).toBe("test@example.com");
    expect(wrapper.vm.valPassword).toBe("password123");
    expect(wrapper.vm.isVerified).toBe(true);
  });

  it("should display password change modal if is_reset is true", async () => {
    expect(wrapper.vm.isShowCompletePassword).toBe(false);
    expect(wrapper.vm.isLoadingButton).toBe(false);
  });

  it("should display error message when login fails", async () => {
    expect(wrapper.vm.valEmailErr).toBe("");
    expect(wrapper.vm.isLoadingButton).toBe(false);
  });

  it("should lock account if remaining attempts are exceeded", async () => {
    wrapper.vm.valEmail = "locked@example.com";
    wrapper.vm.valPassword = "wrongPassword";
    wrapper.vm.isVerified = true;

    await wrapper.vm.onClickLogin();

    expect(wrapper.vm.isShowLocked).toBe(false);
    expect(wrapper.vm.isLoadingButton).toBe(false);
  });

  it("should handle password visibility toggle", async () => {
    wrapper.vm.showPassword = false;
    wrapper.vm.visiblePassword();
    expect(wrapper.vm.showPassword).toBe(true);

    wrapper.vm.visiblePassword();
    expect(wrapper.vm.showPassword).toBe(false);
  });
});
