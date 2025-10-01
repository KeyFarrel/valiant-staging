import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import DynamicScatterPlot from "@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue";
import GlobalFormat from "@/services/format/global-format";

jest.mock("vue-echarts", () => ({
  __esModule: true,
  default: {
    name: "VChart",
    props: [
      "option",
      "autoresize",
      "theme",
      "initOptions",
      "updateOptions",
      "group",
      "manualUpdate",
      "wFull",
      "autocapitalize",
    ],
    template: '<div class="v-chart-mock" />',
  },
  THEME_KEY: Symbol("theme"),
}));

jest.mock("echarts/core", () => ({
  use: jest.fn(),
}));

jest.mock("echarts/charts", () => ({
  ScatterChart: {},
  LineChart: {},
}));

jest.mock("echarts/components", () => ({
  TitleComponent: {},
  TooltipComponent: {},
  LegendComponent: {},
  VisualMapComponent: {},
  MarkLineComponent: {},
}));

jest.mock("echarts/renderers", () => ({
  CanvasRenderer: {},
}));

jest.mock("@/services/format/global-format");

describe("DynamicScatterPlot", () => {
  let wrapper: any;
  const mockGlobalFormat = {
    formatRupiah: jest.fn((value) => `Rp ${value.toLocaleString()}`),
  };

  const defaultProps = {
    series: [
      {
        type: "scatter" as const,
        name: "Test Series",
        data: [[100, 200, 1000, "Test Point"]],
      },
    ],
    source: [
      [100, 200, 1000],
      [150, 250, 1200],
      [200, 300, 1500],
    ] as number[][],
    xData: { name: "X Axis", satuan: "Rp" },
    yData: { name: "Y Axis", satuan: "Rp" },
    pln: { x: 175, y: 275 },
    ipp: { x: 125, y: 225 },
    legends: [
      { label: "Legend 1", color: "#FF0000" },
      { label: "Legend 2", color: "#00FF00" },
    ],
    dataZoom: {
      start: 0,
      type: "inside" as const,
      orient: "horizontal" as const,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (GlobalFormat as jest.MockedClass<typeof GlobalFormat>).mockImplementation(
      () => mockGlobalFormat as any,
    );
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = {}) => {
    return mount(DynamicScatterPlot, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs: {
          "v-chart": {
            template: '<div class="v-chart-mock" />',
            props: [
              "option",
              "autoresize",
              "theme",
              "initOptions",
              "updateOptions",
              "group",
              "manualUpdate",
              "wFull",
              "autocapitalize",
            ],
          },
        },
      },
    });
  };

  describe("Component Rendering", () => {
    it("should render component successfully", () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it("should render v-chart component", () => {
      wrapper = createWrapper();
      const chart = wrapper.find(".v-chart-mock");
      expect(chart.exists()).toBe(true);
    });

    it("should pass correct props to v-chart component", () => {
      wrapper = createWrapper();
      const chartElement = wrapper.find(".v-chart-mock");
      expect(chartElement.exists()).toBe(true);

      expect(chartElement.classes()).toContain("chart");
    });

    it("should render legends correctly", () => {
      wrapper = createWrapper();
      const legendElements = wrapper.findAll('[data-testid="legend-item"]');

      const customLegends = wrapper.findAll(
        ".flex.flex-row.items-center.space-x-1\\.5",
      );
      expect(customLegends.length).toBeGreaterThan(0);
    });

    it("should render IPP and PLN legends", () => {
      wrapper = createWrapper();
      const text = wrapper.text();
      expect(text).toContain("IPP");
      expect(text).toContain("PLN");
    });
  });

  describe("Props Validation", () => {
    it("should accept all required props", () => {
      wrapper = createWrapper();
      expect(wrapper.props().series).toEqual(defaultProps.series);
      expect(wrapper.props().source).toEqual(defaultProps.source);
      expect(wrapper.props().xData).toEqual(defaultProps.xData);
      expect(wrapper.props().yData).toEqual(defaultProps.yData);
    });

    it("should handle optional props", () => {
      const propsWithoutOptional = {
        ...defaultProps,
        pln: undefined,
        ipp: undefined,
      };

      wrapper = createWrapper(propsWithoutOptional);
      expect(wrapper.props().pln).toBeUndefined();
      expect(wrapper.props().ipp).toBeUndefined();
    });

    it("should handle percentage unit for xData", () => {
      const propsWithPercentage = {
        ...defaultProps,
        xData: { name: "Percentage", satuan: "%" },
      };

      wrapper = createWrapper(propsWithPercentage);
      expect(wrapper.props().xData.satuan).toBe("%");
    });
  });

  describe("Chart Option Computation", () => {
    it("should compute chart options correctly", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      expect(vm.option).toBeDefined();
      expect(vm.option.grid).toBeDefined();
      expect(vm.option.tooltip).toBeDefined();
      expect(vm.option.xAxis).toBeDefined();
      expect(vm.option.yAxis).toBeDefined();
    });

    it("should set correct xAxis configuration", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      expect(vm.option.xAxis.type).toBe("value");
      expect(vm.option.xAxis.name).toBe("X Axis (Rp)");
      expect(vm.option.xAxis.nameLocation).toBe("middle");
    });

    it("should set correct yAxis configuration", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      expect(vm.option.yAxis.type).toBe("value");
      expect(vm.option.yAxis.name).toBe("Y Axis Rp");
      expect(vm.option.yAxis.nameLocation).toBe("middle");
    });

    it("should handle percentage unit for xAxis max value", () => {
      const propsWithPercentage = {
        ...defaultProps,
        xData: { name: "Percentage", satuan: "%" },
      };

      wrapper = createWrapper(propsWithPercentage);
      const vm = wrapper.vm;

      expect(vm.option.xAxis.max).toBe(100);
    });

    it("should calculate correct min and max values for axes", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const sourceData = defaultProps.source;
      const xValues = sourceData.map((item) => Number(item[0]));
      const yValues = sourceData.map((item) => Number(item[1]));

      const expectedXMin =
        Math.min(...xValues) -
        Math.round((Math.max(...xValues) - Math.min(...xValues)) / 10);
      const expectedXMax =
        Math.max(...xValues) +
        Math.round((Math.max(...xValues) - Math.min(...xValues)) / 10);

      expect(vm.option.xAxis.min).toBe(expectedXMin);
      expect(vm.option.xAxis.max).toBe(expectedXMax);
    });
  });

  describe("Tooltip Formatter", () => {
    it("should format IPPX tooltip correctly", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const params = {
        seriesName: "IPPX",
        value: [100, 200, 1000, "Test"],
      };

      const result = vm.option.tooltip.formatter(params);
      expect(result).toContain("IPP Average:");
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(200);
    });

    it("should format IPPY tooltip correctly", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const params = {
        seriesName: "IPPY",
        value: [100, 200, 1000, "Test"],
      };

      const result = vm.option.tooltip.formatter(params);
      expect(result).toContain("IPP Average:");
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(100);
    });

    it("should format PLNX tooltip correctly", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const params = {
        seriesName: "PLNX",
        value: [100, 200, 1000, "Test"],
      };

      const result = vm.option.tooltip.formatter(params);
      expect(result).toContain("PLN Average:");
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(200);
    });

    it("should format PLNY tooltip correctly", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const params = {
        seriesName: "PLNY",
        value: [100, 200, 1000, "Test"],
      };

      const result = vm.option.tooltip.formatter(params);
      expect(result).toContain("PLN Average:");
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(100);
    });

    it("should format regular data point tooltip correctly", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const params = {
        seriesName: "Regular",
        value: [100, 200, 1000, "Test Point"],
      };

      const result = vm.option.tooltip.formatter(params);
      expect(result).toContain("Test Point");
      expect(result).toContain("X Axis :");
      expect(result).toContain("Y Axis :");
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(100);
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(200);
    });
  });

  describe("Series Configuration", () => {
    it("should include PLN average lines in series", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const plnXSeries = vm.option.series.find((s: any) => s.name === "PLNX");
      const plnYSeries = vm.option.series.find((s: any) => s.name === "PLNY");

      expect(plnXSeries).toBeDefined();
      expect(plnYSeries).toBeDefined();
      expect(plnXSeries.color).toBe("#FF5656");
      expect(plnYSeries.color).toBe("#FF5656");
    });

    it("should include IPP average lines in series", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const ippXSeries = vm.option.series.find((s: any) => s.name === "IPPX");
      const ippYSeries = vm.option.series.find((s: any) => s.name === "IPPY");

      expect(ippXSeries).toBeDefined();
      expect(ippYSeries).toBeDefined();
      expect(ippXSeries.color).toBe("#0EA976");
      expect(ippYSeries.color).toBe("#0EA976");
    });

    it("should include original series in chart options", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      expect(vm.option.series).toContainEqual(defaultProps.series[0]);
    });
  });

  describe("Events", () => {
    it("should emit update:series when option setter is called", async () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      const newValue = { test: "value" };
      vm.option = newValue;

      await nextTick();

      expect(wrapper.emitted("update:series")).toBeTruthy();
      expect(wrapper.emitted("update:series")[0]).toEqual([newValue]);
    });
  });

  describe("Visual Map Configuration", () => {
    it("should configure visual map correctly", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      expect(vm.option.visualMap).toBeDefined();
      expect(vm.option.visualMap.show).toBe(false);
      expect(vm.option.visualMap.dimension).toBe(2);
      expect(vm.option.visualMap.min).toBe(2000);
      expect(vm.option.visualMap.max).toBe(1500000000);
    });
  });

  describe("Dataset Configuration", () => {
    it("should configure dataset correctly", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      expect(vm.option.dataset).toBeDefined();
      expect(Array.isArray(vm.option.dataset)).toBe(true);
      expect(vm.option.dataset[0].source).toEqual(defaultProps.source);
    });

    it("should include regression transform in dataset", () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;

      expect(vm.option.dataset[1]).toBeDefined();
      expect(vm.option.dataset[1].transform).toBeDefined();
      expect(vm.option.dataset[1].transform.type).toBe("ecStat:regression");
    });
  });

  describe("Error Handling", () => {
    it("should handle missing PLN data gracefully", () => {
      const propsWithoutPLN = {
        ...defaultProps,
        pln: undefined,
      };

      expect(() => {
        wrapper = createWrapper(propsWithoutPLN);
      }).not.toThrow();
    });

    it("should handle missing IPP data gracefully", () => {
      const propsWithoutIPP = {
        ...defaultProps,
        ipp: undefined,
      };

      expect(() => {
        wrapper = createWrapper(propsWithoutIPP);
      }).not.toThrow();
    });

    it("should handle empty source data", () => {
      const propsWithEmptySource = {
        ...defaultProps,
        source: [] as number[][],
      };

      expect(() => {
        wrapper = createWrapper(propsWithEmptySource);
      }).not.toThrow();
    });
  });

  describe("Styling", () => {
    it("should have correct chart height", () => {
      wrapper = createWrapper();

      const chartElement = wrapper.find(".chart");
      expect(chartElement.exists()).toBe(true);
    });

    it("should render legend colors correctly", () => {
      wrapper = createWrapper();

      const legendItems = wrapper.findAll(".w-3.h-3.rounded-full");
      expect(legendItems.length).toBeGreaterThan(0);
    });
  });

  describe("Reactivity", () => {
    it("should update chart when props change", async () => {
      wrapper = createWrapper();

      const newSeries = [
        {
          type: "scatter" as const,
          name: "Updated Series",
          data: [[300, 400, 2000, "Updated Point"]],
        },
      ];

      await wrapper.setProps({ series: newSeries });

      expect(wrapper.props().series).toEqual(newSeries);
    });

    it("should recalculate chart options when source data changes", async () => {
      wrapper = createWrapper();
      const oldOption = wrapper.vm.option;

      const newSource = [
        [300, 400, 2000],
        [350, 450, 2200],
      ] as number[][];

      await wrapper.setProps({ source: newSource });

      expect(wrapper.vm.option).not.toEqual(oldOption);
    });
  });
});
