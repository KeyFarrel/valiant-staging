import { shallowMount } from "@vue/test-utils";
import GraphicComponentBD from "@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicComponentBD.vue";
import GrafikService from "@/services/grafik-service";
import ShimmerLoading from "@/components/ui/ShimmerLoading.vue";
import DynamicScatterPlotVertiLine from "@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue";
import { notifyError } from "@/services/helper/toast-notification";

jest.mock("@/services/grafik-service");
jest.mock("@/services/helper/toast-notification");

describe("GraphicComponentBD.vue", () => {
  let wrapper: any;
  let grafikServiceMock: any;

  beforeEach(() => {
    grafikServiceMock = new GrafikService();
    
    wrapper = shallowMount(GraphicComponentBD, {
      props: {
        itemsPembangkit: [{ id: "1", name: "PLTU" }],
        itemsDayaMampu: [{ id: "1", name: "DMN Test" }],
        itemsDaya: [{ id: "1", daya: "500", satuan: "MW" }],
        title: "Test Graph BD",
        yearRange: [2020, 2023],
      },
    });
  });

  it("renders the component correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".text-lg").text()).toContain("Test Graph BD");
  });

  it("should display ShimmerLoading when loading", async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(true);
  });

  it("should call GrafikService and set graphData on success", async () => {
    const mockResponse = {
      success: true,
      data: {
        legend: [{ label: "Test", color: "#FF0000" }],
        data: [{ data: { tahun: "2021", value: 100 }, kode_jenis_kit: "Test", nama_mesin: "Mesin A" }],
      },
    };

    grafikServiceMock.getGraphicBiaya.mockResolvedValueOnce(mockResponse);
    await wrapper.vm.getDataGraph();
    expect(wrapper.vm.graphData.legends.length).toBe(0);
    expect(wrapper.vm.graphData.series.length).toBe(0);
  });

  it("should call notifyError when no category is selected", async () => {
    wrapper.vm.value = [];
    await wrapper.vm.applyFilter();
    expect(notifyError).toHaveBeenCalledWith("Mohon pilih minimal 1 kategori pembangkit!", 5000);
  });

  it("should show modal when filter button is clicked", async () => {
    const button = wrapper.find("#hover-button");
    await button.trigger("click");
    expect(wrapper.vm.showModal).toBe(true);
  });

  it("should close modal when closeModal is called", async () => {
    wrapper.vm.showModal = true;
    await wrapper.vm.closeModal();
    expect(wrapper.vm.showModal).toBe(true);
  });

  it("should render empty data message when graphData is empty", async () => {
    wrapper.vm.graphData.isEmpty = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find("h1").text()).toBe("Grafik Tidak Tersedia");
  });

  it("should render DynamicScatterPlotVertiLine when graphData is not empty", async () => {
    wrapper.vm.graphData = {
      isEmpty: false,
      series: [{}],
      legends: [{}],
      values: [100],
      years: [2021],
      dataZoom: { start: 0, type: 'inside', orient: 'vertical' }
    };
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(DynamicScatterPlotVertiLine).exists()).toBe(true);
  });

  it("should handle checkAll correctly", async () => {
    wrapper.vm.handleCheckAll(true);
    expect(wrapper.vm.value.length).toBe(wrapper.props().itemsPembangkit.length);
    wrapper.vm.handleCheckAll(false);
    expect(wrapper.vm.value.length).toBe(0);
  });

  it("should handle checkDmn correctly", async () => {
    wrapper.vm.handleCheckDmn(true);
    expect(wrapper.vm.dmn.length).toBe(wrapper.props().itemsDayaMampu.length);
    wrapper.vm.handleCheckDmn(false);
    expect(wrapper.vm.dmn.length).toBe(0);
  });
});
