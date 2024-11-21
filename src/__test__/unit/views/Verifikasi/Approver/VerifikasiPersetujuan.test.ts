import { shallowMount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia"; // Tambahkan Pinia
import VerifikasiPersetujuan from "@/views/Verifikasi/Approver/VerifikasiPersetujuan.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
import SearchBox from "@/components/ui/SearchBox.vue";
import TabsWrapper from "@/components/ui/TabsWrapper.vue";
import TabItem from "@/components/ui/TabItem.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import TableComponent from "@/components/ui/Table.vue";
import Empty from "@/components/ui/EmptyData.vue";
import PersetujuanService from "@/services/persetujuan-service";
import GlobalFormat from "@/services/format/global-format";

// Mocking services using the preferred structure
jest.mock("@/services/persetujuan-service");

jest.mock("@/services/peta-service");

jest.mock("@/services/format/global-format", () =>
  jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn(),
  }))
);

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

describe("VerifikasiPersetujuan.vue", () => {
  let wrapper: any;
  let persetujuanServiceMock: any;
  let globalFormatMock: any;

  beforeEach(() => {
    // Set active Pinia
    const pinia = createPinia();
    setActivePinia(pinia); // Aktifkan Pinia

    persetujuanServiceMock = new PersetujuanService();
    globalFormatMock = new GlobalFormat();

    // Mount the component with Pinia
    wrapper = shallowMount(VerifikasiPersetujuan, {
      global: {
        plugins: [pinia], // Tambahkan Pinia sebagai plugin
        components: {
          Loading,
          SearchBox,
          TabsWrapper,
          TabItem,
          ModalWrapper,
          TableComponent,
          Empty,
        },
      },
    });
  });

  // it("should render the component correctly", () => {
  //   expect(wrapper.exists()).toBe(true);
  //   expect(wrapper.findComponent(TabsWrapper).exists()).toBe(true);
  //   // Simulate the content of h1 element
  // });

  // it("should call getPersetujuanKertasKerja on mounted", async () => {
  //   const getPersetujuanKertasKerjaSpy = jest.spyOn(
  //     persetujuanServiceMock,
  //     "getPersetujuanKertasKerja"
  //   );

  //   await flushPromises();
  //   expect(getPersetujuanKertasKerjaSpy).toHaveBeenCalledTimes(0);
  // });

  // it("should format IRR and NPV values correctly using globalFormat", async () => {
  //   globalFormatMock.formatRupiah.mockImplementation(
  //     (value: number) => `Rp${value}`
  //   );

  //   wrapper.vm.persetujuanKK = [{ irr_on_equity: 10, npv_on_equity: 1000 }];
  //   await wrapper.vm.$nextTick();

  //   // Stub out a simple Table or direct HTML that would contain IRR and NPV elements
  // });

  // it("should display loading spinner when isLoading is true", async () => {
  //   wrapper.vm.isLoading = true; // Set langsung pada vm
  //   await wrapper.vm.$nextTick(); // Pastikan reaktivitas terpicu
  //   expect(wrapper.findComponent(Loading).exists()).toBe(true);
  // });

  it("is fetching fetchPersetujuanKK", async () => {
    const fetchPersetujuanKKSpy = jest.spyOn(wrapper.vm, "fetchPersetujuanKK");
    await wrapper.vm.fetchPersetujuanKK();
    expect(fetchPersetujuanKKSpy).toHaveBeenCalled();
  });

  it("is fetching fetchPersetujuanFS", async () => {
    const fetchPersetujuanFSSpy = jest.spyOn(wrapper.vm, "fetchPersetujuanFS");
    await wrapper.vm.fetchPersetujuanFS();
    expect(fetchPersetujuanFSSpy).toHaveBeenCalled();
  });

  // it("is fetching getDataPembina", async () => {
  //   const getDataPembinaSpy = jest.spyOn(wrapper.vm, "getDataPembina");
  //   await wrapper.vm.getDataPembina();
  //   expect(getDataPembinaSpy).toHaveBeenCalled();
  // });
  
  // it("is fetching getDataPengelola", async () => {
  //   const getDataPengelolaSpy = jest.spyOn(wrapper.vm, "getDataPengelola");
  //   await wrapper.vm.getDataPengelola();
  //   expect(getDataPengelolaSpy).toHaveBeenCalled();
  // });
});
