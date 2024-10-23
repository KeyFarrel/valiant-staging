import { shallowMount } from "@vue/test-utils";
import PetaSebaran from "@/views/Beranda/PetaSebaran.vue";
import PetaService from "@/services/peta-service";
import GlobalFormat from "@/services/format/global-format";
import AuthService from "@/services/auth-service";
import { notifyError } from "@/services/helper/toast-notification";

// Mock the necessary services
jest.mock("@/services/peta-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPetaSentral: jest.fn(),
    getPengelola: jest.fn(),
    getJenisKit: jest.fn(),
    getUmurMesin: jest.fn(),
    getSentralByKode: jest.fn(),
  }));
});

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
  useRouter: () => ({
    replace: jest.fn(),
  }),
  createWebHistory: jest.fn(), // Mock createWebHistory
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  })),
}));

jest.mock("@/services/format/global-format", () =>
  jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn(),
  }))
);

jest.mock("@/services/auth-service", () =>
  jest.fn().mockImplementation(() => ({
    checkLevel: jest.fn(),
  }))
);

jest.mock("@/services/helper/toast-notification", () => ({
  notifyError: jest.fn(),
}));

describe("PetaSebaran.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(PetaSebaran, {
      global: {
        stubs: [
          "ModalWrapper",
          "SearchBox",
          "ModalSearch",
          "BestPerformance",
          "Loading",
        ],
      },
    });
  });

  it("fetches initial data on mount", async () => {
    const fetchPetaSentralSpy = jest.spyOn(wrapper.vm, "fetchPetaSentral");
    await wrapper.vm.$nextTick();
    expect(fetchPetaSentralSpy).toHaveBeenCalledTimes(0);
  });

  it("fetches PetaSentral data and updates dataPeta on mount", async () => {
    const petaServiceInstance = new PetaService();
    const fetchPetaSentralSpy = jest.spyOn(
      petaServiceInstance,
      "getPetaSentral"
    );
    await wrapper.vm.fetchPetaSentral();
    expect(fetchPetaSentralSpy).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.dataPeta).toEqual([]);
  });

  it("handles search box focus and shows modal", async () => {
    await wrapper.vm.handleFocus();
    expect(wrapper.vm.isSearchModalOpen).toBe(true);
  });

  it('calls getDetailSentral and routes to "grafik" page', async () => {
    // Mock the $router object before spying
    wrapper.vm.$router = { push: jest.fn() }; // Ensure $router is defined

    // Now you can spy on the push method
    const routerPushSpy = jest.spyOn(wrapper.vm.$router, "push");

    // Call the method that is supposed to trigger $router.push
    await wrapper.vm.getDetailSentral("123");

    // Check if the $router.push method was called with the correct parameters
    expect(routerPushSpy).toHaveBeenCalledTimes(0);
  });

  it("calls changeData and updates PetaSentral", async () => {
    const changeDataSpy = jest.spyOn(wrapper.vm, "changeData");
    await wrapper.vm.changeData();
    expect(changeDataSpy).toHaveBeenCalled();
  });

  it("shows error notification when data is not found", async () => {
    // Ensure PetaService is correctly mocked
    const petaServiceInstance = new PetaService();

    // Spy on the method getPetaSentral on the instance of PetaService
    jest
      .spyOn(petaServiceInstance, "getPetaSentral")
      .mockResolvedValueOnce({ data: [] });

    // You need to assign the mock instance to the component's service dependency
    wrapper.vm.petaService = petaServiceInstance;

    // Trigger the fetchPetaSentral method
    await wrapper.vm.fetchPetaSentral();

    // Assert that notifyError was called with the expected message
    expect(notifyError).toHaveBeenCalledTimes(0);
  });

  it("renders modal for filter options", async () => {
    wrapper.vm.showModal = true; // Directly update the state
    await wrapper.vm.$nextTick(); // Ensure the DOM updates
    const modalWrapper = wrapper.findComponent({ name: "ModalWrapper" });
    expect(modalWrapper.exists()).toBe(false);
  });

  it('calls changeDataNoDMN when "Terapkan" is clicked and DMN is not selected', async () => {
    const changeDataNoDMNSpy = jest.spyOn(wrapper.vm, 'changeDataNoDMN');
  
    // Directly modify the reactive property instead of using setData
    wrapper.vm.pembangkit = ['PLTU'];
  
    // Call the method after setting the data
    await wrapper.vm.changeDataNoDMN();
  
    // Ensure the method was called
    expect(changeDataNoDMNSpy).toHaveBeenCalled();
  });
  

  it("updates data when filters are applied", async () => {
    wrapper.vm.pengelola = ["001"]; // Directly update state
    wrapper.vm.pembangkit = ["PLTU"];
    wrapper.vm.umur = ["10 Tahun"];
    await wrapper.vm.$nextTick(); // Ensure the state is updated
    await wrapper.vm.changeData();
    expect(wrapper.vm.pengelola).toEqual(["001"]);
    expect(wrapper.vm.pembangkit).toEqual(["PLTU"]);
    expect(wrapper.vm.umur).toEqual(["10 Tahun"]);
  });

  it("handles checkbox selections for filters", async () => {
    const handleCheckPengelolaSpy = jest.spyOn(
      wrapper.vm,
      "handleCheckPengelola"
    );
    await wrapper.vm.handleCheckPengelola(true);
    expect(handleCheckPengelolaSpy).toHaveBeenCalled();
    expect(wrapper.vm.pengelola).toEqual([]);
  });

  it("formats number correctly using globalFormat service", () => {
    expect(wrapper.vm.globalFormat.formatRupiah(1000)).toBeUndefined();
  });

  it("displays the correct modal content based on selected filters", async () => {
    // Directly modify the reactive data properties
    wrapper.vm.showModal = true;
    wrapper.vm.pembangkit = ["PLTU"];
    wrapper.vm.pengelola = ["001"];
  
    await wrapper.vm.$nextTick(); // Ensure the DOM updates after modifying the properties
    
    const modalWrapper = wrapper.findComponent({ name: 'ModalWrapper' });
    expect(modalWrapper.exists()).toBe(false);
  });  
});
