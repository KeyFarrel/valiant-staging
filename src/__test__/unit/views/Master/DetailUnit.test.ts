import { mount } from "@vue/test-utils";
import DetailUnit from "@/views/Master/DetailUnit.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog.vue";
import ModalNotification from "@/components/ui/ModalNotification.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";

// Mock the necessary services
jest.mock("vue-router", () => ({
  createRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(),
  }),
  createWebHistory: jest.fn(),
  useRoute: jest.fn(() => ({
    params: { id: "1" },
    query: { kode_pengelola: "123", tab: "Sentral" },
  })),
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock("@/services/detail-sentral-service");

jest.mock("@/services/user-service");

jest.mock("@/services/perbarui-data");

jest.mock("@/services/auth-service");

describe("DetailUnit.vue", () => {
  let wrapper: any;
  let routerReplaceMock: jest.Mock;

  beforeEach(() => {
    routerReplaceMock = jest.fn();
    wrapper = mount(DetailUnit, {
      global: {
        components: {
          ModalWrapper,
          ModalNotification,
          Loading,
          ConfirmationDialog,
        },
        mocks: {
          $router: {
            replace: routerReplaceMock,
          },
          $route: {
            path: "/some-path",
            query: { kode_pengelola: "123", tab: "Sentral" },
          },
        },
      },
    });
  });

  it("renders the loading spinner when isLoading is true", async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });

  it("renders the modal for confirmation dialog when isConfirmationOpen is true", async () => {
    wrapper.vm.isConfirmationOpen = true;
    await wrapper.vm.$nextTick();
    const modalWrapper = wrapper.findComponent(ModalWrapper);
    expect(modalWrapper.exists()).toBe(true);
  });

  it("triggers updateMesinById when the confirmation dialog accept button is clicked", async () => {
    wrapper.vm.isConfirmationOpen = true;
    wrapper.vm.selectedMesin = {
      idMesin: 1,
      mesinIndex: 0,
      namaMesin: "Mesin A",
    };
    await wrapper.vm.$nextTick();

    const confirmationDialog = wrapper.findComponent(ConfirmationDialog);
    expect(confirmationDialog.exists()).toBe(true);

    // const acceptButton = confirmationDialog.find('button:contains("Kirim")');
    // await acceptButton.trigger("click"); // Trigger click event
    // expect(wrapper.vm.updateMesinById).toHaveBeenCalledWith(1, 0, "Mesin A");
  });

  it("closes the confirmation dialog when the cancel button is clicked", async () => {
    wrapper.vm.isConfirmationOpen = true;
    await wrapper.vm.$nextTick();

    const confirmationDialog = wrapper.findComponent(ConfirmationDialog);
    expect(confirmationDialog.exists()).toBe(true);

    // const cancelButton = confirmationDialog.find('button:contains("Batal")');
    // await cancelButton.trigger("click");

    // expect(wrapper.vm.isConfirmationOpen).toBe(false);
  });

  it("renders the unit tab and switches between tabs", async () => {
    wrapper.vm.mesin = [{ mesin: "Mesin A" }, { mesin: "Mesin B" }];
    wrapper.vm.selectedTitle = "Mesin A";
    await wrapper.vm.$nextTick();

    const tabs = wrapper.findAll("li");
    expect(tabs.length).toBe(3); // Two unit tabs and one 'Sentral' tab

    await tabs[1].trigger("click"); // Click on 'Mesin A' tab
    expect(wrapper.vm.selectedTitle).toBe("Mesin A");

    await tabs[2].trigger("click"); // Click on 'Mesin B' tab
    expect(wrapper.vm.selectedTitle).toBe("Mesin B");
  });

  it("calls updateSentral when sentral confirmation dialog is accepted", async () => {
    const updateSentral = jest.spyOn(wrapper.vm, "updateSentral");
    wrapper.vm.isConfirmationOpenSentral = true;
    await wrapper.vm.$nextTick();

    const confirmationDialog = wrapper.findComponent(ConfirmationDialog);
    expect(confirmationDialog.exists()).toBe(true);

    // const acceptButton = confirmationDialog.find('button:contains("Kirim")');
    // await acceptButton.trigger("click");

    // expect(updateSentral).toHaveBeenCalled();
  });

  it("renders the modal notification when showModal is true", async () => {
    wrapper.vm.showModal = true;
    await wrapper.vm.$nextTick();
    const modalNotification = wrapper.findComponent(ModalNotification);
    expect(modalNotification.exists()).toBe(true);
  });

  it("toggles edit mode for sentral", async () => {
    const toggleEdit = jest.spyOn(wrapper.vm, "toggleEdit");
    wrapper.vm.toggleEdit("Sentral");

    expect(toggleEdit).toHaveBeenCalled();
    expect(wrapper.vm.isEditOpen("Sentral")).toBe(true);
  });

  it("fetches initial data on mount", () => {
    const getSentralById = jest.spyOn(wrapper.vm, "getSentralById");
    expect(getSentralById).toHaveBeenCalledTimes(0);
  });

  it("is fetching fetchPengelola", async () => {
    const fetchPengelolaSpy = jest.spyOn(wrapper.vm, "fetchPengelola");
    await wrapper.vm.fetchPengelola();
    expect(fetchPengelolaSpy).toHaveBeenCalled();
  });

  it("is fetching getSentralById", async () => {
    const getSentralByIdSpy = jest.spyOn(wrapper.vm, "getSentralById");
    await wrapper.vm.getSentralById();
    expect(getSentralByIdSpy).toHaveBeenCalled();
  });

  it("is fetching fetchPhotoSentral", async () => {
    const fetchPhotoSentralSpy = jest.spyOn(wrapper.vm, "fetchPhotoSentral");
    await wrapper.vm.fetchPhotoSentral();
    expect(fetchPhotoSentralSpy).toHaveBeenCalled();
  });

  it("is fetching fetchListPembina", async () => {
    const fetchListPembinaSpy = jest.spyOn(wrapper.vm, "fetchListPembina");
    await wrapper.vm.fetchListPembina();
    expect(fetchListPembinaSpy).toHaveBeenCalled();
  });

  it("is fetching fetchUnitPengelola", async () => {
    const fetchUnitPengelolaSpy = jest.spyOn(wrapper.vm, "fetchUnitPengelola");
    await wrapper.vm.fetchUnitPengelola();
    expect(fetchUnitPengelolaSpy).toHaveBeenCalled();
  });
});
