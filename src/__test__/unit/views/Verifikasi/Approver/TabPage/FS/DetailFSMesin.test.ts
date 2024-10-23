import { shallowMount, flushPromises } from "@vue/test-utils";
import DetailFSMesin from "@/views/Verifikasi/Approver/TabPage/FS/DetailFSMesin.vue";
import ModalWrapper from "@/components/ui/ModalWrapper.vue";
import { Vue3Lottie } from "vue3-lottie";
import { useRoute } from "vue-router"; // Import useRoute to mock it

// Mock useRoute
jest.mock("vue-router", () => ({
  useRoute: jest.fn(), // Add this to mock useRoute
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(), // Add this mock to handle beforeEach
  })),
  createWebHistory: jest.fn(() => ({})), // Mock createWebHistory
}));

jest.mock("@/services/feasibility-study", () => {
  return jest.fn().mockImplementation(() => ({
    getMesinById: jest.fn(),
    getAsumsiFeasibility: jest.fn(),
  }));
});

jest.mock("@/services/persetujuan-service", () => {
  return jest.fn().mockImplementation(() => ({
    getPersetujuanFSSentral: jest.fn(),
    updateStatusFS: jest.fn(),
  }));
});

describe("DetailFSMesin.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    // Mock the useRoute function to return params and query needed for the component
    (useRoute as jest.Mock).mockReturnValue({
      params: { id: "123" }, // Mock route params, adjust as needed for your test cases
      query: { id_sentral: "456", tahun: "2024" }, // Mock query params if needed
    });

    wrapper = shallowMount(DetailFSMesin, {
      global: {
        components: {
          ModalWrapper,
          Vue3Lottie,
        },
      },
    });
  });

  it("should render InfoHeader correctly when mesinDataById and approveSentralFS are available", async () => {
    wrapper.vm.mesinDataById = {
      mesin: "Mesin Test",
      daya_terpasang: 1000,
      daya_mampu: 800,
      kondisi_unit: "Baik",
      kode_jenis_pembangkit: "12345",
    };
    wrapper.vm.approveSentralFS = { umur_teknis: "10 Tahun" };

    await flushPromises();

    const infoHeader = wrapper.findComponent({ name: "InfoHeader" });
    expect(infoHeader.exists()).toBe(true);
    expect(infoHeader.props("namaMesin")).toBe("Mesin Test");
  });

  // it('should show modal when "Tolak Laporan" button is clicked', async () => {
  //   // Set state yang membuat tombol "Tolak Laporan" muncul
  //   wrapper.vm.approveMesinFS = { status: "Menunggu Persetujuan T2" };
  //   await wrapper.vm.$nextTick(); // Menunggu perubahan reaktif

  //   // Cari tombol berdasarkan teks yang muncul di dalam tombol
  //   const button = wrapper
  //     .findAll("button")
  //     .filter((btn) => btn.text().includes("Tolak Laporan"))
  //     .at(0);

  //   // Cek apakah tombol ditemukan
  //   if (button && button.exists()) {
  //     await button.trigger("click");
  //   } else {
  //     throw new Error('Tombol "Tolak Laporan" tidak ditemukan');
  //   }

  //   expect(wrapper.vm.modalCancel).toBe(true);

  //   const modalWrapper = wrapper.findComponent(ModalWrapper);
  //   expect(modalWrapper.exists()).toBe(true);
  // });

  // it('should show modal when "Setujui Laporan" button is clicked', async () => {
  //   // Set state yang membuat tombol "Setujui Laporan" muncul
  //   wrapper.vm.approveMesinFS = { status: "Menunggu Persetujuan T2" };
  //   await wrapper.vm.$nextTick(); // Menunggu perubahan reaktif

  //   const button = wrapper
  //     .findAll("button")
  //     .filter((btn) => btn.text().includes("Setujui Laporan"))
  //     .at(0);

  //   // Cek apakah tombol ditemukan
  //   if (button && button.exists()) {
  //     await button.trigger("click");
  //   } else {
  //     throw new Error('Tombol "Setujui Laporan" tidak ditemukan');
  //   }

  //   expect(wrapper.vm.modalApprove).toBe(true);
  // });

  // it("should show success message after rejection", async () => {
  //   wrapper.vm.modalCancel = true;
  //   await wrapper.vm.$nextTick(); // Tunggu reaktifitas

  //   const rejectButton = wrapper
  //     .findAll("button")
  //     .filter((btn) => btn.text().includes("Kirim Penolakan"))
  //     .at(0);

  //   if (rejectButton && rejectButton.exists()) {
  //     await rejectButton.trigger("click");
  //   } else {
  //     throw new Error('Tombol "Kirim Penolakan" tidak ditemukan');
  //   }

  //   await flushPromises(); // Tunggu promise selesai

  //   expect(wrapper.vm.isReject).toBe(true);
  //   expect(wrapper.vm.modalCancel).toBe(false);
  // });

  // it("should show success message after approval", async () => {
  //   wrapper.vm.modalApprove = true;
  //   await wrapper.vm.$nextTick(); // Menunggu perubahan reaktif

  //   const approveButton = wrapper
  //     .findAll("button")
  //     .filter((btn) => btn.text().includes("Setujui Laporan"))
  //     .at(0);

  //   if (approveButton && approveButton.exists()) {
  //     await approveButton.trigger("click");
  //   } else {
  //     throw new Error('Tombol "Setujui Laporan" tidak ditemukan');
  //   }

  //   await flushPromises(); // Tunggu semua promise selesai

  //   expect(wrapper.vm.isSuccess).toBe(true);
  //   expect(wrapper.vm.modalApprove).toBe(false);
  // });
});
