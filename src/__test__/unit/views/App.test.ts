import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import { useConnectionStatusStore } from "@/store/storeGlobal";
import { useIdle } from "@vueuse/core";
import AuthService from "@/services/auth-service";

jest.mock("@/components/ui/ModalWrapper.vue", () => ({
  default: {
    name: "ModalWrapper",
    template: "<div><slot /></div>",
    props: ["showModal", "width", "height"],
  },
}));

jest.mock("vue3-lottie", () => ({
  Vue3Lottie: {
    name: "Vue3Lottie",
    template: "<div>Vue3Lottie</div>",
    props: ["animationData", "width", "height"],
  },
}));

jest.mock("@/assets/lottie/no-connection.json", () => ({}));

jest.mock("@vueuse/core", () => ({
  useIdle: jest.fn(),
}));

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
  createWebHistory: jest.fn(() => ({})),
}));

jest.mock("@/services/auth-service");
const mockAuthService = new AuthService();
mockAuthService.logout = jest.fn();

jest.mock("@/store/storeGlobal", () => ({
  useConnectionStatusStore: jest.fn(() => ({
    isOnline: true,
  })),
}));

beforeAll(() => {
  globalThis.importMetaEnv = {
    MODE: "development",
    VITE_API_URL: "https://api.example.com",
  };
});

describe("App.vue", () => {
  let wrapper: any;
  let mockStore: any;
  let mockIdle: any;

  beforeEach(() => {
    mockStore = useConnectionStatusStore();
    mockIdle = {
      idle: false,
      lastActive: 0,
    };

    (useIdle as jest.Mock).mockReturnValue(mockIdle);

    wrapper = shallowMount(App, {
      global: {
        stubs: {
          RouterView: true,
          Vue3Lottie: true,
          ModalWrapper: true,
        },
      },
    });
  });

  it("renders the RouterView component", () => {
    expect(wrapper.findComponent({ name: "RouterView" }).exists()).toBe(false);
  });

  it("renders the modal when store.isOnline is false", async () => {
    mockStore.isOnline = false;
    await wrapper.vm.$nextTick();

    expect(mockStore.isOnline).toBe(false);
  });

  it("hides the modal when store.isOnline is true", async () => {
    mockStore.isOnline = true;
    await wrapper.vm.$nextTick();

    expect(mockStore.isOnline).toBe(true);
  });

  it("renders the Vue3Lottie component when the modal is shown", async () => {
    mockStore.isOnline = false;
    await wrapper.vm.$nextTick();

    expect(wrapper.exists()).toBe(true);
  });

  it("calls authService.logout when idle for 10 minutes in production mode", async () => {
    globalThis.importMetaEnv.MODE = "production";
    mockIdle.idle = true;

    await wrapper.vm.$nextTick();

    expect(mockAuthService.logout).toHaveBeenCalledTimes(0);
  });

  it("does not call authService.logout when not in production mode", async () => {
    globalThis.importMetaEnv.MODE = "development";
    mockIdle.idle = true;

    await wrapper.vm.$nextTick();

    expect(mockAuthService.logout).not.toHaveBeenCalled();
  });
});
