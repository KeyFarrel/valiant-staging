import { mount } from "@vue/test-utils";
import DynamicScatterPlotVertiLine from "@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue";
import VChart from 'vue-echarts';
import { nextTick } from "vue";

describe("DynamicScatterPlotVertiLine.vue", () => {
  let wrapper: any;

  const propsData = {
    dataZoom: { start: 0, type: "slider", orient: "horizontal" },
    series: [
      {
        name: "Series 1",
        type: "scatter" as const,
        data: [[1, 2, 3, "Label 1"], [4, 5, 6, "Label 2"]],
      },
    ],
    xData: { name: "X Axis", satuan: "units" },
    yData: { name: "Y Axis", satuan: "units" },
    legends: [
      { label: "Legend 1", color: "#ff0000" },
      { label: "Legend 2", color: "#00ff00" },
    ],
    years: [2000, 2001, 2002, 2003, 2004],
    yValues: [100, 200, 300, 400, 500],
  };

  beforeEach(() => {
    wrapper = mount(DynamicScatterPlotVertiLine, {
      props: propsData,
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it("renders VChart with correct props", async () => {
    await nextTick();
    const vChart = wrapper.findComponent(VChart);
    expect(vChart.exists()).toBe(true);
    expect(vChart.props("option")).toBeTruthy();
  });

  it("computed option should return correct chart options", async () => {
    await nextTick();
    const option = wrapper.vm.option;
    expect(option.grid).toEqual({
      top: "2%",
      left: "5%",
      right: "2%",
      bottom: "5%",
      containLabel: true,
    });
    expect(option.tooltip).toBeTruthy();
    expect(option.xAxis).toBeTruthy();
    expect(option.yAxis).toBeTruthy();
    expect(option.visualMap).toBeTruthy();
    expect(option.dataZoom).toEqual(propsData.dataZoom);
    expect(option.series).toEqual(propsData.series);
  });

  it("renders legends correctly", async () => {
    await nextTick();
    const legends = wrapper.findAll(".flex.flex-row.items-center.space-x-1.5");
    expect(legends.length).toBe(propsData.legends.length);
    legends.wrappers.forEach((legendWrapper, index) => {
      const legend = propsData.legends[index];
      const colorDiv = legendWrapper.find(".w-3.h-3.rounded-full");
      const label = legendWrapper.find("p");
      expect(colorDiv.attributes("style")).toContain(`background-color: ${legend.color}`);
      expect(label.text()).toBe(legend.label);
    });
  });
});