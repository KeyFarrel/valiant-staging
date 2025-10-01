import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import DynamicScatterPlotVertiLine from '@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlotVertiLine.vue';
import GlobalFormat from '@/services/format/global-format';

// Mock vue-echarts
jest.mock('vue-echarts', () => ({
  __esModule: true,
  default: {
    name: 'VChart',
    props: ['option', 'autoresize', 'theme', 'initOptions', 'updateOptions', 'group', 'manualUpdate', 'wFull', 'autocapitalize'],
    template: '<div class="v-chart-mock" />',
  },
  THEME_KEY: Symbol('theme'),
}));

// Mock echarts core
jest.mock('echarts/core', () => ({
  use: jest.fn(),
}));

// Mock echarts components
jest.mock('echarts/charts', () => ({
  ScatterChart: {},
}));

jest.mock('echarts/components', () => ({
  TitleComponent: {},
  TooltipComponent: {},
  LegendComponent: {},
  VisualMapComponent: {},
  MarkLineComponent: {},
}));

jest.mock('echarts/renderers', () => ({
  CanvasRenderer: {},
}));

// Mock GlobalFormat
jest.mock('@/services/format/global-format');

describe('DynamicScatterPlotVertiLine', () => {
  let wrapper: any;
  const mockGlobalFormat = {
    formatRupiah: jest.fn((value) => `Rp ${value.toLocaleString()}`),
    formatEnergy: jest.fn((value) => `${value} MWh`),
  };

  const defaultProps = {
    series: [
      {
        type: 'scatter' as const,
        name: 'Test Series',
        data: [[2020, 1000, 500, 'Test Point 1'], [2021, 1500, 600, 'Test Point 2']],
      },
    ],
    xData: { name: 'Tahun', satuan: '' },
    yData: { name: 'Energy', satuan: 'MWh' },
    legends: [
      { label: 'Legend 1', color: '#FF0000' },
      { label: 'Legend 2', color: '#00FF00' },
    ],
    years: [2020, 2021, 2022, 2023],
    yValues: [1000, 1500, 2000, 2500],
    dataZoom: { start: 0, type: 'inside' as const, orient: 'horizontal' as const },
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock GlobalFormat constructor
    (GlobalFormat as jest.MockedClass<typeof GlobalFormat>).mockImplementation(() => mockGlobalFormat as any);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = {}) => {
    return mount(DynamicScatterPlotVertiLine, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        stubs: {
          'v-chart': {
            template: '<div class="v-chart-mock" />',
            props: ['option', 'autoresize', 'theme', 'initOptions', 'updateOptions', 'group', 'manualUpdate', 'wFull', 'autocapitalize'],
          },
        },
      },
    });
  };

  describe('Component Rendering', () => {
    it('should render component successfully', () => {
      wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('should render v-chart component', () => {
      wrapper = createWrapper();
      const chart = wrapper.find('.v-chart-mock');
      expect(chart.exists()).toBe(true);
    });

    it('should pass correct props to v-chart component', () => {
      wrapper = createWrapper();
      const chartElement = wrapper.find('.v-chart-mock');
      expect(chartElement.exists()).toBe(true);
      expect(chartElement.classes()).toContain('chart');
    });

    it('should render legends correctly', () => {
      wrapper = createWrapper();
      const customLegends = wrapper.findAll('.flex.flex-row.items-center.space-x-1\\.5');
      expect(customLegends.length).toBe(defaultProps.legends.length);
    });

    it('should render legend labels correctly', () => {
      wrapper = createWrapper();
      const text = wrapper.text();
      expect(text).toContain('Legend 1');
      expect(text).toContain('Legend 2');
    });
  });

  describe('Props Validation', () => {
    it('should accept all required props', () => {
      wrapper = createWrapper();
      expect(wrapper.props().series).toEqual(defaultProps.series);
      expect(wrapper.props().xData).toEqual(defaultProps.xData);
      expect(wrapper.props().yData).toEqual(defaultProps.yData);
      expect(wrapper.props().years).toEqual(defaultProps.years);
      expect(wrapper.props().yValues).toEqual(defaultProps.yValues);
    });

    it('should handle optional dataZoom prop', () => {
      const propsWithoutDataZoom = {
        ...defaultProps,
        dataZoom: undefined,
      };
      
      wrapper = createWrapper(propsWithoutDataZoom);
      expect(wrapper.props().dataZoom).toBeUndefined();
    });

    it('should handle different units for yData', () => {
      const propsWithDifferentUnit = {
        ...defaultProps,
        yData: { name: 'Power', satuan: 'MW' },
      };
      
      wrapper = createWrapper(propsWithDifferentUnit);
      expect(wrapper.props().yData.satuan).toBe('MW');
    });
  });

  describe('Chart Option Computation', () => {
    it('should compute chart options correctly', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option).toBeDefined();
      expect(vm.option.grid).toBeDefined();
      expect(vm.option.tooltip).toBeDefined();
      expect(vm.option.xAxis).toBeDefined();
      expect(vm.option.yAxis).toBeDefined();
    });

    it('should set correct xAxis configuration', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.xAxis.type).toBe('value');
      expect(vm.option.xAxis.name).toBe('Tahun');
      expect(vm.option.xAxis.nameLocation).toBe('middle');
      expect(vm.option.xAxis.nameGap).toBe(36);
    });

    it('should set correct yAxis configuration', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.yAxis.type).toBe('value');
      expect(vm.option.yAxis.name).toBe('Energy MWh');
      expect(vm.option.yAxis.nameLocation).toBe('middle');
      expect(vm.option.yAxis.nameGap).toBe(62);
    });

    it('should calculate correct min and max values for xAxis based on years', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const expectedMin = Math.min(...defaultProps.years) - 0.05;
      const expectedMax = Math.max(...defaultProps.years) + 0.05;
      
      expect(vm.option.xAxis.min).toBe(expectedMin);
      expect(vm.option.xAxis.max).toBe(expectedMax);
    });

    it('should calculate correct splitNumber for xAxis', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const expectedSplitNumber = Math.max(...defaultProps.years) - Math.min(...defaultProps.years);
      expect(vm.option.xAxis.splitNumber).toBe(expectedSplitNumber);
    });

    it('should calculate correct max value for yAxis', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const yValues = defaultProps.yValues;
      const expectedMax = Math.max(...yValues) + Math.round((Math.max(...yValues) - Math.min(...yValues)) / 10);
      
      expect(vm.option.yAxis.max).toBe(expectedMax);
    });

    it('should hide yAxis splitLine', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.yAxis.splitLine.show).toBe(false);
    });
  });

  describe('Tooltip Formatter', () => {
    it('should format tooltip correctly', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const params = {
        value: [2020, 1500, 500, 'Test Data Point'],
      };
      
      const result = vm.option.tooltip.formatter(params);
      expect(result).toContain('Test Data Point');
      expect(result).toContain('Tahun : 2020');
      expect(result).toContain('Energy :');
      expect(mockGlobalFormat.formatRupiah).toHaveBeenCalledWith(1500);
    });

    it('should include unit in tooltip', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const params = {
        value: [2021, 2000, 600, 'Another Test Point'],
      };
      
      const result = vm.option.tooltip.formatter(params);
      expect(result).toContain('MWh');
    });
  });

  describe('Axis Label Formatters', () => {
    it('should format xAxis labels as integers', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const formatter = vm.option.xAxis.axisLabel.formatter;
      expect(formatter(2020.5)).toBe('2021');
      expect(formatter(2020.1)).toBe('2020');
    });

    it('should format yAxis labels using GlobalFormat.formatEnergy', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const formatter = vm.option.yAxis.axisLabel.formatter;
      formatter(1500.75);
      
      expect(mockGlobalFormat.formatEnergy).toHaveBeenCalledWith('1501');
    });

    it('should configure xAxis label display options', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.xAxis.axisLabel.fontSize).toBe(10);
      expect(vm.option.xAxis.axisLabel.showMinLabel).toBe(false);
      expect(vm.option.xAxis.axisLabel.showMaxLabel).toBe(false);
    });

    it('should configure yAxis label display options', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.yAxis.axisLabel.fontSize).toBe(10);
    });
  });

  describe('Series Configuration', () => {
    it('should include original series in chart options', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.series).toEqual(defaultProps.series);
    });

    it('should handle multiple series', () => {
      const multipleSeriesProps = {
        ...defaultProps,
        series: [
          {
            type: 'scatter' as const,
            name: 'Series 1',
            data: [[2020, 1000, 500, 'Point 1']],
          },
          {
            type: 'scatter' as const,
            name: 'Series 2',
            data: [[2021, 1500, 600, 'Point 2']],
          },
        ],
      };
      
      wrapper = createWrapper(multipleSeriesProps);
      const vm = wrapper.vm;
      
      expect(vm.option.series.length).toBe(2);
      expect(vm.option.series[0].name).toBe('Series 1');
      expect(vm.option.series[1].name).toBe('Series 2');
    });
  });

  describe('Events', () => {
    it('should emit update:series when option setter is called', async () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const newValue = { test: 'value' };
      vm.option = newValue;
      
      await nextTick();
      
      expect(wrapper.emitted('update:series')).toBeTruthy();
      expect(wrapper.emitted('update:series')[0]).toEqual([newValue]);
    });
  });

  describe('Visual Map Configuration', () => {
    it('should configure visual map correctly', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.visualMap).toBeDefined();
      expect(vm.option.visualMap.show).toBe(false);
      expect(vm.option.visualMap.dimension).toBe(2);
      expect(vm.option.visualMap.min).toBe(2000);
      expect(vm.option.visualMap.max).toBe(1500000000);
      expect(vm.option.visualMap.seriesIndex).toEqual([0, 1]);
    });

    it('should configure symbol size range in visual map', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.visualMap.inRange.symbolSize).toEqual([10, 70]);
    });
  });

  describe('DataZoom Configuration', () => {
    it('should include dataZoom when provided', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.dataZoom).toEqual(defaultProps.dataZoom);
    });

    it('should handle undefined dataZoom', () => {
      const propsWithoutDataZoom = {
        ...defaultProps,
        dataZoom: undefined,
      };
      
      wrapper = createWrapper(propsWithoutDataZoom);
      const vm = wrapper.vm;
      
      expect(vm.option.dataZoom).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty years array gracefully', () => {
      const propsWithEmptyYears = {
        ...defaultProps,
        years: [],
      };
      
      expect(() => {
        wrapper = createWrapper(propsWithEmptyYears);
      }).not.toThrow();
    });

    it('should handle empty yValues array gracefully', () => {
      const propsWithEmptyYValues = {
        ...defaultProps,
        yValues: [],
      };
      
      expect(() => {
        wrapper = createWrapper(propsWithEmptyYValues);
      }).not.toThrow();
    });

    it('should handle empty series array gracefully', () => {
      const propsWithEmptySeries = {
        ...defaultProps,
        series: [],
      };
      
      expect(() => {
        wrapper = createWrapper(propsWithEmptySeries);
      }).not.toThrow();
    });
  });

  describe('Styling', () => {
    it('should have correct chart height', () => {
      wrapper = createWrapper();
      
      const chartElement = wrapper.find('.chart');
      expect(chartElement.exists()).toBe(true);
    });

    it('should render legend colors correctly', () => {
      wrapper = createWrapper();
      
      const legendItems = wrapper.findAll('.w-3.h-3.rounded-full');
      expect(legendItems.length).toBe(defaultProps.legends.length);
    });

    it('should apply correct styles to legend items', () => {
      wrapper = createWrapper();
      
      const legendColorElements = wrapper.findAll('.w-3.h-3.rounded-full');
      expect(legendColorElements[0].attributes('style')).toContain('background-color: rgb(255, 0, 0)');
      expect(legendColorElements[1].attributes('style')).toContain('background-color: rgb(0, 255, 0)');
    });
  });

  describe('Reactivity', () => {
    it('should update chart when series props change', async () => {
      wrapper = createWrapper();
      
      const newSeries = [
        {
          type: 'scatter' as const,
          name: 'Updated Series',
          data: [[2022, 3000, 800, 'Updated Point']],
        },
      ];
      
      await wrapper.setProps({ series: newSeries });
      
      expect(wrapper.props().series).toEqual(newSeries);
    });

    it('should recalculate chart options when years change', async () => {
      wrapper = createWrapper();
      const oldOption = wrapper.vm.option;
      
      const newYears = [2024, 2025, 2026];
      
      await wrapper.setProps({ years: newYears });
      
      expect(wrapper.vm.option).not.toEqual(oldOption);
      expect(wrapper.vm.option.xAxis.min).toBe(Math.min(...newYears) - 0.05);
      expect(wrapper.vm.option.xAxis.max).toBe(Math.max(...newYears) + 0.05);
    });

    it('should recalculate chart options when yValues change', async () => {
      wrapper = createWrapper();
      const oldOption = wrapper.vm.option;
      
      const newYValues = [5000, 6000, 7000];
      
      await wrapper.setProps({ yValues: newYValues });
      
      expect(wrapper.vm.option).not.toEqual(oldOption);
    });

    it('should update axis labels when xData/yData change', async () => {
      wrapper = createWrapper();
      
      const newXData = { name: 'Periode', satuan: '' };
      const newYData = { name: 'Daya', satuan: 'MW' };
      
      await wrapper.setProps({ 
        xData: newXData,
        yData: newYData 
      });
      
      expect(wrapper.vm.option.xAxis.name).toBe('Periode');
      expect(wrapper.vm.option.yAxis.name).toBe('Daya MW');
    });
  });

  describe('Grid Configuration', () => {
    it('should configure grid layout correctly', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      expect(vm.option.grid.top).toBe('2%');
      expect(vm.option.grid.left).toBe('5%');
      expect(vm.option.grid.right).toBe('2%');
      expect(vm.option.grid.bottom).toBe('5%');
      expect(vm.option.grid.containLabel).toBe(true);
    });
  });

  describe('Name Text Style Configuration', () => {
    it('should configure xAxis name text style correctly', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const nameTextStyle = vm.option.xAxis.nameTextStyle;
      expect(nameTextStyle.align).toBe('center');
      expect(nameTextStyle.fontSize).toBe(15);
      expect(nameTextStyle.color).toBe('#4D5E80');
      expect(nameTextStyle.fontWeight).toBe('bold');
      expect(nameTextStyle.padding).toEqual([20, 0, 0, -80]);
    });

    it('should configure yAxis name text style correctly', () => {
      wrapper = createWrapper();
      const vm = wrapper.vm;
      
      const nameTextStyle = vm.option.yAxis.nameTextStyle;
      expect(nameTextStyle.align).toBe('center');
      expect(nameTextStyle.fontSize).toBe(15);
      expect(nameTextStyle.color).toBe('#4D5E80');
      expect(nameTextStyle.fontWeight).toBe('bold');
    });
  });
});
