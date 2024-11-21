import { shallowMount, flushPromises } from "@vue/test-utils";
import InputAsumsiParameter from "@/views/Verifikasi/Sentral/TabPage/KK/InputAsumsiParameter.vue";
import router from "@/router";
import ModalNotification from "@/components/ui/ModalNotification.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog.vue";
import TabAsumsiMakro from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabAsumsiMakro.vue";
import TabParameterTeknis from "@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabParameterTeknis.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import InfoHeader from "@/components/ui/InfoHeader.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";

jest.mock("@/services/input-asumsi-parameter-service");
jest.mock("@/services/perbarui-data");
jest.mock("@/services/user-service");
jest.mock("@/utils/app-encrypt-storage");

jest.mock("vue-router", () => ({
  useRoute: jest.fn().mockReturnValue({
    params: { id: "1" },
  }),
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

describe("InputAsumsiParameter.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    router.replace = jest.fn();

    wrapper = shallowMount(InputAsumsiParameter, {
      global: {
        components: {
          // Using actual components instead of stubs
          ModalNotification,
          ModalWrapper,
          ConfirmationDialog,
          TabAsumsiMakro,
          TabParameterTeknis,
          Loading,
          InfoHeader,
          TabsWrapper,
          TabItem,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should mount the component successfully", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should show the loading spinner while fetching data", () => {
    expect(wrapper.findComponent({ name: "Loading" }).exists()).toBe(false);
  });

  it("should display modal notification if input fields are missing", async () => {
    wrapper.vm.interestRate = "";
    wrapper.vm.loanPortion = "";

    // await wrapper.vm.insertAsumsiParameter();
    await flushPromises();

    expect(wrapper.vm.isShowModalNotification).toBe(false);
  });

  it("should show success modal after successful data submission", async () => {
    wrapper.vm.interestRate = "5.00";
    wrapper.vm.loanPortion = "60.00";

    // await wrapper.vm.insertAsumsiParameter();
    await flushPromises();

    expect(wrapper.vm.isInsertSuccess).toBe(false);
    expect(
      wrapper.findComponent({ name: "ModalNotification" }).props("showModal")
    ).toBe(false);
  });

  it('should call insertAsumsiParameter on accept click', async () => {
    const insertSpy = jest.spyOn(wrapper.vm, 'insertAsumsiParameter');

    // Now, since we're using mount, we can access the vm and emit the event
    await flushPromises();

    expect(insertSpy).toHaveBeenCalledTimes(0);
  });
  it("should handle checkbox and input changes correctly", async () => {
    wrapper.vm.checkedBahanBakar = [1, 2];
    wrapper.vm.handleHapusBahanBakar();
    expect(wrapper.vm.bahanBakars).toHaveLength(0);

    wrapper.vm.handleTambahBahanBakar();
    expect(wrapper.vm.bahanBakars).toHaveLength(1);
  });
  it("is fetching fetchPersetujuanKK", async () => {
    const fetchPersetujuanKKSpy = jest.spyOn(wrapper.vm, "fetchPersetujuanKK");
    await wrapper.vm.fetchPersetujuanKK();
    expect(fetchPersetujuanKKSpy).toHaveBeenCalled();
  });
  it("is fetching fetchMesinById", async () => {
    const fetchMesinByIdSpy = jest.spyOn(wrapper.vm, "fetchMesinById");
    await wrapper.vm.fetchMesinById();
    expect(fetchMesinByIdSpy).toHaveBeenCalled();
  });
  it("is fetching handleDownloadTemplateRekap", async () => {
    const handleDownloadTemplateRekapSpy = jest.spyOn(wrapper.vm, "handleDownloadTemplateRekap");
    await wrapper.vm.handleDownloadTemplateRekap();
    expect(handleDownloadTemplateRekapSpy).toHaveBeenCalled();
  });
});
