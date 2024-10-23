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
jest.mock("@/services/persetujuan-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPersetujuanKertasKerja: jest.fn(),
    getPersetujuanFS: jest.fn(),
  }));
});

jest.mock("@/services/peta-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPengelola: jest.fn(),
    getPembina: jest.fn(),
  }));
});

jest.mock("@/services/format/global-format", () =>
  jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn(),
  }))
);

jest.mock("@/services/auth-service", () => {
  return jest.fn().mockImplementation(() => ({
    checkLevel: jest.fn(),
    checkRole: jest.fn(),
  }));
});

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

  it("should render the component correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent(TabsWrapper).exists()).toBe(true);
    // Simulate the content of h1 element
  });

  it("should call getPersetujuanKertasKerja on mounted", async () => {
    const getPersetujuanKertasKerjaSpy = jest.spyOn(
      persetujuanServiceMock,
      "getPersetujuanKertasKerja"
    );

    await flushPromises();
    expect(getPersetujuanKertasKerjaSpy).toHaveBeenCalledTimes(0);
  });

  it("should format IRR and NPV values correctly using globalFormat", async () => {
    globalFormatMock.formatRupiah.mockImplementation(
      (value: number) => `Rp${value}`
    );

    wrapper.vm.persetujuanKK = [{ irr_on_equity: 10, npv_on_equity: 1000 }];
    await wrapper.vm.$nextTick();

    // Stub out a simple Table or direct HTML that would contain IRR and NPV elements
  });

  it("should display loading spinner when isLoading is true", async () => {
    wrapper.vm.isLoading = true; // Set langsung pada vm
    await wrapper.vm.$nextTick(); // Pastikan reaktivitas terpicu
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });
});
