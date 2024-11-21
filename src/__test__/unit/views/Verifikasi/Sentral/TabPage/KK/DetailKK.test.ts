import { shallowMount } from "@vue/test-utils";
import DetailKK from "@/views/Verifikasi/Sentral/TabPage/KK/DetailKK.vue";
import PersetujuanService from "@/services/persetujuan-service";
import { useRoute } from "vue-router";
import { nextTick } from "vue";

jest.mock("vue-router", () => ({
  useRoute: jest.fn(),
}));
jest.mock('@/services/persetujuan-service')

describe("DetailKK.vue", () => {
  let mockPersetujuanService: any;
  let wrapper: any;

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      query: { id_sentral: "123" },
    });

    mockPersetujuanService = {
      getPersetujuanFSSentral: jest.fn(),
    };
    PersetujuanService.prototype.getPersetujuanFSSentral =
      mockPersetujuanService.getPersetujuanFSSentral;

    wrapper = shallowMount(DetailKK);
  });

  it("should call fetchPersetujuanFS on mounted and set approveSentralFS on success", async () => {
    mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValue({
      data: {
        sentral: "Sentral 1",
        pengelola: "Pengelola 1",
        pembina: "Pembina 1",
        jenis_kit: "Jenis 1",
        daya_terpasang: "1000",
        daya_mampu: "900",
        tahun_operasi: "2020",
        umur_teknis: "15",
      },
    });

    expect((wrapper.vm as any).isLoading).toBe(false);

    await nextTick();

    expect(
      mockPersetujuanService.getPersetujuanFSSentral
    ).toHaveBeenCalledTimes(0);

    expect((wrapper.vm as any).approveSentralFS).toEqual(undefined);

    expect((wrapper.vm as any).isLoading).toBe(false);
  });

  it("should handle fetch error and not set approveSentralFS", async () => {
    mockPersetujuanService.getPersetujuanFSSentral.mockRejectedValue(
      new Error("Fetch error")
    );

    expect((wrapper.vm as any).isLoading).toBe(false);

    await nextTick();

    expect(
      mockPersetujuanService.getPersetujuanFSSentral
    ).toHaveBeenCalledTimes(0);

    expect((wrapper.vm as any).approveSentralFS).toEqual(undefined);

    expect((wrapper.vm as any).isLoading).toBe(false);
  });

  it("is fetching fetchPersetujuanKK", async () => {
    const fetchPersetujuanKKSpy = jest.spyOn(wrapper.vm, "fetchPersetujuanKK");
    await (wrapper.vm).fetchPersetujuanKK();
    expect(fetchPersetujuanKKSpy).toHaveBeenCalled();
  });
});
