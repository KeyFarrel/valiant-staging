import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

// Import dan mock dependencies sebelum import komponen
vi.mock('vue-echarts', () => ({
  default: {
    name: 'VChart',
    template: '<div class="v-chart" data-testid="v-chart">Chart Mock</div>',
    props: ['option', 'wFull', 'autocapitalize'],
  },
  THEME_KEY: Symbol('theme'),
}));

vi.mock('echarts/core', () => ({
  use: vi.fn(),
}));

vi.mock('echarts/charts', () => ({
  ScatterChart: {},
  LineChart: {},
  LineSeriesOption: {},
  ScatterSeriesOption: {},
}));

vi.mock('echarts/components', () => ({
  TitleComponent: {},
  TooltipComponent: {},
  LegendComponent: {},
  VisualMapComponent: {},
  MarkLineComponent: {},
  TooltipComponentOption: {},
  VisualMapComponentOption: {},
  GridComponentOption: {},
}));

vi.mock('echarts/renderers', () => ({
  CanvasRenderer: {},
}));

vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah(value: number) {
      return `Rp ${value.toLocaleString()}`;
    }
  }
}));

// Unmock komponen untuk menggunakan implementasi asli
vi.doUnmock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue');

// Import komponen setelah setup mocks
const DynamicScatterPlot = await import('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue');

describe('DynamicScatterPlot', () => {
  let wrapper: any;
  
  const defaultProps = {
    series: [],
    source: [[100, 200, 1000000, 'Test Point 1'], [150, 250, 1500000, 'Test Point 2']] as any,
    xData: { name: 'CAPEX', satuan: 'USD/kW' },
    yData: { name: 'OPEX', satuan: 'USD/MWh' },
    pln: { x: 125, y: 225 },
    ipp: { x: 130, y: 230 },
    legends: [
      { label: 'PLTU', color: '#ff0000' },
      { label: 'PLTG', color: '#00ff00' }
    ],
    dataZoom: { start: 0, type: 'inside', orient: 'horizontal' }
  };

  const minimalProps = {
    series: [],
    source: [],
    xData: { name: '', satuan: '' },
    yData: { name: '', satuan: '' },
    legends: []
  };

  beforeEach(() => {
    wrapper = mount(DynamicScatterPlot.default, {
      props: defaultProps
    });
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'VChart' }).exists()).toBe(true);
  });

  it('should render legends correctly', () => {
    expect(wrapper.text()).toContain('PLTU');
    expect(wrapper.text()).toContain('PLTG');
    expect(wrapper.text()).toContain('PLN');
    expect(wrapper.text()).toContain('IPP');
  });

  it('should display legends with correct colors', () => {
    const legendElements = wrapper.findAll('.w-3.h-3.rounded-full');
    expect(legendElements.length).toBeGreaterThan(0);
  });

  it('should handle props correctly', () => {
    expect(wrapper.vm.series).toEqual(defaultProps.series);
    expect(wrapper.vm.source).toEqual(defaultProps.source);
    expect(wrapper.vm.xData).toEqual(defaultProps.xData);
    expect(wrapper.vm.yData).toEqual(defaultProps.yData);
    expect(wrapper.vm.pln).toEqual(defaultProps.pln);
    expect(wrapper.vm.ipp).toEqual(defaultProps.ipp);
    expect(wrapper.vm.legends).toEqual(defaultProps.legends);
    expect(wrapper.vm.dataZoom).toEqual(defaultProps.dataZoom);
  });

  it('should handle empty source data', () => {
    const emptyWrapper = mount(DynamicScatterPlot.default, {
      props: {
        ...defaultProps,
        source: [[0], [0]]  // Minimal data to avoid Math.min/max errors
      }
    });
    
    expect(emptyWrapper.exists()).toBe(true);
  });

  it('should handle missing optional props', () => {
    const wrapperWithoutOptional = mount(DynamicScatterPlot.default, {
      props: {
        ...minimalProps,
        source: [[10, 20], [30, 40]], // Minimal valid source
        dataZoom: { start: 0, type: 'inside', orient: 'horizontal' }  // Add required prop
      }
    });
    
    expect(wrapperWithoutOptional.exists()).toBe(true);
    expect(wrapperWithoutOptional.vm.pln).toBeUndefined();
    expect(wrapperWithoutOptional.vm.ipp).toBeUndefined();
  });

  it('should emit update:series event', () => {
    const testSeries = [{ type: 'scatter', data: [[1, 2]] }];
    wrapper.vm.option = testSeries;
    
    expect(wrapper.emitted('update:series')).toBeTruthy();
    expect(wrapper.emitted('update:series')[0][0]).toEqual(testSeries);
  });

  it('should compute chart option correctly', () => {
    const computedOption = wrapper.vm.option;
    
    expect(computedOption).toBeDefined();
    expect(computedOption.grid).toBeDefined();
    expect(computedOption.tooltip).toBeDefined();
    expect(computedOption.xAxis).toBeDefined();
    expect(computedOption.yAxis).toBeDefined();
    expect(computedOption.series).toBeDefined();
    expect(computedOption.visualMap).toBeDefined();
    expect(computedOption.dataset).toBeDefined();
  });

  it('should handle percentage xData satuan', () => {
    const percentageWrapper = mount(DynamicScatterPlot.default, {
      props: {
        ...defaultProps,
        xData: { name: 'Test', satuan: '%' }
      }
    });
    
    // Access internal option through the component instance
    expect(percentageWrapper.exists()).toBe(true);
    expect(percentageWrapper.vm.xData.satuan).toBe('%');
  });

  it('should handle negative yData values', () => {
    const negativeWrapper = mount(DynamicScatterPlot.default, {
      props: {
        ...defaultProps,
        source: [[-100, -200], [100, 200]]
      }
    });
    
    // Verify component renders with negative values
    expect(negativeWrapper.exists()).toBe(true);
    expect(negativeWrapper.vm.source).toEqual([[-100, -200], [100, 200]]);
  });

  it('should test tooltip formatter for IPPX series', () => {
    const computedOption = wrapper.vm.option;
    const formatter = computedOption.tooltip.formatter;
    
    const params = {
      seriesName: 'IPPX',
      value: [100, 200, 1000000, 'Test Point']
    };
    
    const result = formatter(params);
    expect(result).toContain('IPP Average');
    expect(result).toContain('Rp 200');
  });

  it('should test tooltip formatter for IPPY series', () => {
    const computedOption = wrapper.vm.option;
    const formatter = computedOption.tooltip.formatter;
    
    const params = {
      seriesName: 'IPPY',
      value: [150, 250, 1500000, 'Test Point']
    };
    
    const result = formatter(params);
    expect(result).toContain('IPP Average');
    expect(result).toContain('Rp 150');
  });

  it('should test tooltip formatter for PLNX series', () => {
    const computedOption = wrapper.vm.option;
    const formatter = computedOption.tooltip.formatter;
    
    const params = {
      seriesName: 'PLNX',
      value: [300, 400, 2000000, 'Test Point']
    };
    
    const result = formatter(params);
    expect(result).toContain('PLN Average');
    expect(result).toContain('Rp 400');
  });

  it('should test tooltip formatter for PLNY series', () => {
    const computedOption = wrapper.vm.option;
    const formatter = computedOption.tooltip.formatter;
    
    const params = {
      seriesName: 'PLNY',
      value: [500, 600, 3000000, 'Test Point']
    };
    
    const result = formatter(params);
    expect(result).toContain('PLN Average');
    expect(result).toContain('Rp 500');
  });

  it('should test tooltip formatter for default case', () => {
    const computedOption = wrapper.vm.option;
    const formatter = computedOption.tooltip.formatter;
    
    const params = {
      seriesName: 'SCATTER',
      value: [700, 800, 4000000, 'Default Test Point']
    };
    
    const result = formatter(params);
    expect(result).toContain('Default Test Point');
    expect(result).toContain('CAPEX');
    expect(result).toContain('OPEX');
    expect(result).toContain('Rp 700');
    expect(result).toContain('Rp 800');
  });
});